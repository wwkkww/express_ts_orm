import 'dotenv/config';
import 'reflect-metadata';
import { createConnection } from 'typeorm';
import App from './app';
import postController from './posts/post.controller';
import config from './ormconfig';
import validateEnv from './utils/validateEnv';
import addressController from './address/address.controller';
import authenticationController from './authentication/authentication.controller';
import categoryController from './category/category.controller';

validateEnv();

(
  async () => {
    try {
      // init orm config
      // console.log(config);
      const connection = await createConnection(config);

      // run migration in the code 
      // await connection.runMigrations()
      console.log('PG connected.');


    } catch (error) {
      console.log('Error while connection to database ', error)
      return error;
    };

    const app = new App(
      [
        authenticationController,
        postController,
        addressController,
        categoryController
      ]
    );
    app.listen();
  }
)();
