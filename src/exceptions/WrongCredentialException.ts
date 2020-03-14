import HttpException from './HttpException';

class WrongCredentialException extends HttpException {
  constructor() {
    console.log('WrongCredentialException')
    // inherits from HttpException(status, message)
    super(401, `Invalid credential. Please check your email and password`)
  }
}

export default WrongCredentialException;