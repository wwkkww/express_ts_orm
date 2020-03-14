import bcrypt from 'bcrypt';
import express from 'express';
import Controller from '../interfaces/controller.interface';
import CreateUserDto from '../users/user.dto';
import LogInDto from './login.dto';
import userModel from '../users/user.model';
import EmailAlreadyExistException from '../exceptions/EmailAlreadyExistException';
import WrongCredentialException from '../exceptions/WrongCredentialException';
import { validationMiddleware } from '../middleware/validation.middleware';

class AuthenticationController implements Controller {
  path = '/auth';
  router = express.Router();

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes() {
    // auth/register
    this.router.post(`${this.path}/register`, validationMiddleware(CreateUserDto), this.registration)

    // auth/login
    this.router.post(`${this.path}/login`, validationMiddleware(LogInDto), this.loggingIn)

  }

  private loggingIn = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
    const logInData: LogInDto = request.body
    const user = await userModel.findOne({ email: logInData.email })
    if (user) {
      const passwordMatch = await bcrypt.compare(logInData.password, user.password)
      if (passwordMatch) {
        user.password = "********"
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
      response.send(newUser)
    }
  }
}

const authenticationController = new AuthenticationController()
export default authenticationController