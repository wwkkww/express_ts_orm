import 'dotenv/config';
import 'reflect-metadata';
import { createConnection } from 'typeorm';
import App from './app';
import postController from './posts/post.controller';
import config from './ormconfig';
import validateEnv from './utils/validateEnv';

validateEnv();

(
  async () => {
    try {
      // init orm config
      console.log(config);
      await createConnection(config);
      console.log('PG connected.');


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
