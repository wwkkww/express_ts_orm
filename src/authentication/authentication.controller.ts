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
import User from '../users/user.interface';
import TokenData from '../interfaces/tokenData.interface';
import DataStoreInToken from '../interfaces/dataStoredInToken';

class AuthenticationController implements Controller {
  router = express.Router();
  path = '/auth';

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes() {
    // auth/register
    this.router.post(`${this.path}/register`, validationMiddleware(CreateUserDto), this.registration)
    // auth/login
    this.router.post(`${this.path}/login`, validationMiddleware(LogInDto), this.logIn)
    // auth/logout
    this.router.post(`${this.path}/logout`, this.logOut)

  }

  private logIn = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
    const logInData: LogInDto = request.body
    const user = await userModel.findOne({ email: logInData.email })
    if (user) {
      const passwordMatch = await bcrypt.compare(logInData.password, user.password)
      if (passwordMatch) {
        user.password = "********"
        const tokenData: TokenData = this.createToken(user._id)
        response.setHeader('Set-Cookie', [this.createCookie(tokenData)])
        response.send(user)
      } else {
        next(new WrongCredentialException())
      }
    } else {
      next(new WrongCredentialException())
    }
  }

  private registration = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
    const userData: CreateUserDto = request.body;
    const user = await userModel.findOne({ email: userData.email })
    if (user) {
      next(new EmailAlreadyExistException(userData.email))
    } else {
      const hashedPassword = await bcrypt.hash(userData.password, 10)
      const newUser = await userModel.create({
        ...userData,
        password: hashedPassword
      });
      newUser.password = "********"
      const tokenData: TokenData = this.createToken(newUser._id)
      // store token in a cookie. 
      // Token automatically send to server in Cookie header on each request
      //Server parses the cookie, check token and respond accordingly
      response.setHeader('Set-Cookie', [this.createCookie(tokenData)])

      response.send(newUser)
    }
  }

  private logOut = (request: express.Request, response: express.Response) => {
    response.setHeader('Set-Cookie', ['Authorization=;Max-age=0']);
    response.sendStatus(200);
  }

  private createToken(userId: string): TokenData {
    const expiresIn: number = 60 * 60 * 12 // 12 hours
    const dataStoredInToken: DataStoreInToken = {
      _id: userId
    }
    return {
      token: jwt.sign(dataStoredInToken, String(process.env.JWT_SECRET), { expiresIn }),
      expiresIn
    }
  }

  private createCookie(tokenData: TokenData) {
    return `Authorization=${tokenData.token}; httpOnly; Max-Age=${tokenData.expiresIn}`
  }
}

const authenticationController = new AuthenticationController()
export default authenticationController