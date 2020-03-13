import 'dotenv/config';
import App from './app';
import postsController from './posts/posts.controller';
import validateEnv from './utils/validateEnv';

validateEnv();

const app = new App([
  postsController
], 5000)

app.listen()