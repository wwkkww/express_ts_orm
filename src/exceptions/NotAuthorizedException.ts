import HttpException from './HttpException';

class NotAuthorizedException extends HttpException {
  constructor() {
    super(403, "You are not authorized to perform this action")
  }
}

export default NotAuthorizedException;