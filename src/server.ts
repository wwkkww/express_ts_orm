import 'dotenv/config';
import App from './app';
import postController from './posts/post.controller';
import authenticationController from './authentication/authentication.controller';
import userController from './users/user.controller';
import validateEnv from './utils/validateEnv';

validateEnv();

const app = new App([
  postController,
  authenticationController,
  userController
])

app.listen()