import bcrypt from 'bcrypt';
import express from 'express';
import Controller from '../interfaces/controller.interface';

class AuthenticationController implements Controller {
  path = '/auth';
  router = express.Router();

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes() {
    // auth/login
    this.router.post(`${this.path}/login`, this.loggingIn)

    // auth/register
    this.router.post(`${this.path}/register`, this.registration)
  }

  private loggingIn() {

  }

  private registration() {

  }
}

export default AuthenticationController