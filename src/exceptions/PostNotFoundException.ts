import HttpException from './HttpException';

class PostNotFoundException extends HttpException {
  constructor(id: string) {
    console.log('PostNotFoundException')
    // inherits from HttpException(status, message)
    super(404, `Post with id ${id} not found`)
  }
}

export default PostNotFoundException;