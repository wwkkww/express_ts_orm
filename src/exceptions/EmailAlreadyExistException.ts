import HttpException from './HttpException';

class EmailAlreadyExistException extends HttpException {
  constructor(email: string) {
    console.log('EmailAlreadyExistException')
    // inherits from HttpException(status, message)
    super(400, `User with email ${email} already exist`)
  }
}

export default EmailAlreadyExistException;