import express from 'express';
import mongoose from 'mongoose';

class App {
  public app: express.Application;

  constructor(controllers: any, port: number) {
    this.app = express();

    this.connectDatabase()
    this.initializeMiddlewares();
    this.initializeControllers(controllers)
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
    this.app.use(express.json());
  }

  private initializeControllers(controllers: any) {
    controllers.forEach((controller: any) => {
      this.app.use('/', controller.router)
    });
  }

  public listen() {
    this.app.listen(process.env.PORT, () => {
      console.log(`Server started at port${process.env.PORT}`)
    })
  }
}

export default App;