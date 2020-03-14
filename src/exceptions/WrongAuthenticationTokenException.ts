import HttpException from './HttpException';

class WrongAuthenticationTokenException extends HttpException {
  constructor() {
    console.log('WrongAuthenticationTokenException')
    // inherits from HttpException(status, message)
    super(401, 'Invalid authentication token')
  }
}

export default WrongAuthenticationTokenException;