import 'dotenv/config';
import mongoose from 'mongoose';
import App from './app';
import PostsController from './posts/posts.controller';

const { MONGO_USER, MONGO_PASSWORD, MONGO_PATH } = process.env;

// connect mongoDB
mongoose.connect(
  `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}${MONGO_PATH}`,
  { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err))

const app = new App([new PostsController()], 5000)


app.listen()