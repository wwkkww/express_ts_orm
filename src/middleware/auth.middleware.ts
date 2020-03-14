import express from 'express';
import jwt from 'jsonwebtoken';
import WrongAuthenticationTokenException from '../exceptions/WrongAuthenticationTokenException';
import AuthenticationTokenMissingException from '../exceptions/AuthenticationTokenMissingException';
import DataStoreInToken from '../interfaces/dataStoredInToken';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import userModel from '../users/user.model';


async function authMiddleware(request: RequestWithUser, response: express.Response, next: express.NextFunction) {
  const cookies = request.cookies
  console.log('authMiddleware:', cookies)
  if (cookies && cookies.Authorization) {
    const secret = String(process.env.JWT_SECRET);
    try {
      const verificationResponse = jwt.verify(cookies.Authorization, secret) as DataStoreInToken
      const id = verificationResponse._id;
      const user = await userModel.findById(id)
      if (user) {
        request.user = user;
        next();
      } else {
        next(new WrongAuthenticationTokenException())
      }
    } catch (error) {
      next(new WrongAuthenticationTokenException())
    }
  } else {
    next(new AuthenticationTokenMissingException())
  }
}

export default authMiddleware