import 'dotenv/config';
import App from './app';
import postsController from './posts/posts.controller';
import authenticationController from './authentication/authentication.controller';
import validateEnv from './utils/validateEnv';

validateEnv();

const app = new App([
  postsController,
  authenticationController
])

app.listen()