import 'dotenv/config';
import { createConnection } from 'typeorm';
import App from './app';
import postController from './posts/post.controller';
import authenticationController from './authentication/authentication.controller';
import userController from './users/user.controller';
import reportController from './report/report.controller';
import validateEnv from './utils/validateEnv';
import config from './ormconfig';

validateEnv();

(
  async () => {
    try {
      // init orm config
      await createConnection(config)
    } catch (error) {
      console.log('Error while connection to database ', error)
      return error;
    };

    const app = new App(
      [
        postController
      ]
    );
    app.listen();
  }
)();
