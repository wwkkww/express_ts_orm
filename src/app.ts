import express from 'express';
import mongoose from 'mongoose';
import errorMiddleware from './middleware/error.middleware';

class App {
  public app: express.Application;

  constructor(controllers: any) {
    this.app = express();

    this.connectDatabase()
    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    // Express runs all the middleware from the first to the last, 
    // error handlers should be at the end of application stack
    this.initializeErrorHandling()
  }

  private connectDatabase() {
    const { MONGO_USER, MONGO_PASSWORD, MONGO_PATH } = process.env;
    // connect mongoDB
    mongoose.connect(
      `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}${MONGO_PATH}`,
      { useNewUrlParser: true, useUnifiedTopology: true })
      .then(() => console.log('MongoDB connected'))
      .catch((err) => console.log(err))
  }

  private initializeMiddlewares() {
    console.log("initializeMiddlewares")
    console.log("bodyparser: express.json() ")
    this.app.use(express.json());
  }

  private initializeErrorHandling() {
    console.log("initializeErrorHandling")
    this.app.use(errorMiddleware);
  }


  private initializeControllers(controllers: any) {
    console.log("initializeControllers")
    controllers.forEach((controller: any) => {
      /**
       * /posts
       * /posts/:id
       * /auth/register
       * /auth/login
       */
      this.app.use('/', controller.router)
    });
  }

  public listen() {
    this.app.listen(process.env.PORT, () => {
      console.log(`Server started at port: ${process.env.PORT}`)
    })
  }
}

export default App;