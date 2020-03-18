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
import AuthenticationService from './authentication.service';

class AuthenticationController implements Controller {
  router = express.Router();
  path = '/auth';
  private authenticationService = new AuthenticationService()

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
    const loginData: LogInDto = request.body;
    const user = await getRepository(User).findOne({ email: loginData.email });
    if (user) {
      const passwordMatch = await bcrypt.compare(loginData.password, user.password);
      if (passwordMatch) {
        user.password = "**********"
        const tokenData: TokenData = this.authenticationService.createToken(user.id)
        response.setHeader('Set-Cookie', [this.authenticationService.createCookie(tokenData)])
        response.send(user)
      } else {
        next(new WrongCredentialException())
      }
    } else {
      next(new WrongCredentialException())
    }

    /**
     *
     * MONGODB CODE
     *
     */
    // const logInData: LogInDto = request.body
    // const user = await userModel.findOne({ email: logInData.email })
    // if (user) {
    //   const passwordMatch = await bcrypt.compare(logInData.password, user.password)
    //   if (passwordMatch) {
    //     user.password = "********"
    //     const tokenData: TokenData = this.createToken(user._id)
    //     response.setHeader('Set-Cookie', [this.createCookie(tokenData)])
    //     response.send(user)
    //   } else {
    //     next(new WrongCredentialException())
    //   }
    // } else {
    //   next(new WrongCredentialException())
    // }
  }

  private registration = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
    const userData: CreateUserDto = request.body;
    try {
      const { cookie, newUser } = await this.authenticationService.register(userData)
      response.setHeader('Set-Cookie', [cookie]);
      response.send(newUser)
    } catch (error) {
      next(error)
    }
  }

  private logOut = (request: express.Request, response: express.Response) => {
    response.setHeader('Set-Cookie', ['Authorization=;Max-age=0']);
    response.sendStatus(200);
  }

}

const authenticationController = new AuthenticationController()
export default authenticationController