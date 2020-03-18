import bcrypt from 'bcrypt';
import express from 'express';
import jwt from 'jsonwebtoken';
import Controller from '../interfaces/controller.interface';
import CreateUserDto from '../users/user.dto';
import LogInDto from './login.dto';
import userModel from '../users/user.model';
import EmailAlreadyExistException from '../exceptions/EmailAlreadyExistException';
import WrongCredentialException from '../exceptions/WrongCredentialException';
import { validationMiddleware } from '../middleware/validation.middleware';
// import User from '../users/user.interface';
import TokenData from '../interfaces/tokenData.interface';
import DataStoreInToken from '../interfaces/dataStoredInToken';
import { getRepository } from 'typeorm';
import User from '../users/user.entity';

class AuthenticationService {

  public async register(userData: CreateUserDto) {
    if (await getRepository(User).findOne({ email: userData.email })) {
      throw new EmailAlreadyExistException(userData.email)
    }
    const hashedPassword = await bcrypt.hash(userData.password, 10)
    const newUser = getRepository(User).create({
      ...userData,
      password: hashedPassword
    });
    await getRepository(User).save(newUser);
    newUser.password = "**********";

    const tokenData: TokenData = this.createToken(newUser.id)
    const cookie = this.createCookie(tokenData)
    // response.setHeader('Set-Cookie', [this.createCookie(tokenData)])
    // response.send(newUser)

    return {
      cookie,
      newUser
    }

    /**
     *
     * MONGODB CODE
     *
     */
    // const userData: CreateUserDto = request.body;
    // const user = await userModel.findOne({ email: userData.email })
    // if (user) {
    //   next(new EmailAlreadyExistException(userData.email))
    // } else {
    //   const hashedPassword = await bcrypt.hash(userData.password, 10)
    //   const newUser = await userModel.create({
    //     ...userData,
    //     password: hashedPassword
    //   });
    //   newUser.password = "********"
    //   const tokenData: TokenData = this.createToken(newUser._id)
    //   // store token in a cookie. 
    //   // Token automatically send to server in Cookie header on each request
    //   //Server parses the cookie, check token and respond accordingly
    //   response.setHeader('Set-Cookie', [this.createCookie(tokenData)])

    //   response.send(newUser)
    // }
  }

  public createToken(userId: string): TokenData {
    const expiresIn: number = 60 * 60 * 12 // 12 hours
    const dataStoredInToken: DataStoreInToken = {
      _id: userId
    }
    return {
      token: jwt.sign(dataStoredInToken, String(process.env.JWT_SECRET), { expiresIn }),
      expiresIn
    }
  }

  public createCookie(tokenData: TokenData) {
    return `Authorization=${tokenData.token}; httpOnly; Max-Age=${tokenData.expiresIn}`
  }
}

export default AuthenticationService