import { Request, Response, NextFunction } from 'express';
import HttpException from '../exceptions/HttpException';

function errorMiddleware(error: HttpException, request: Request, response: Response, next: NextFunction) {
  // Error handling for general error
  const status = error.status || 500;
  const message = error.message || 'Oops! Something went wrong'

  response.status(status).send({ status, message })
}

export default errorMiddleware;