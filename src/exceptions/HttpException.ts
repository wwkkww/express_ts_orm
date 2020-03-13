class HttpException extends Error {
  status: number;
  message: string;

  constructor(status: number, message: string) {
    super(message);
    console.log('HttpException')
    this.status = status;
    this.message = message;
  }
}

export default HttpException;