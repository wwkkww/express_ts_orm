import HttpException from './HttpException';

class AuthenticationTokenMissingException extends HttpException {
  constructor() {
    console.log('AuthenticationTokenMissingException')
    // inherits from HttpException(status, message)
    super(401, 'Authentication token missing')
  }
}

export default AuthenticationTokenMissingException;