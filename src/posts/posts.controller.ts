import express from 'express';
import { IPost } from './post.interface';
import postModel from './post.model';

class PostsController {
  public router = express.Router();
  public path = "/posts"

  constructor() {
    this.intializeRoutes();
  }

  private posts: IPost[] = [
    {
      author: 'John',
      content: "Lorem Ipsum",
      title: "My First Post"
    }
  ]

  private intializeRoutes() {
    // Get all posts
    this.router.get(this.path, this.getAllPosts)

    // Create a post
    this.router.post(this.path, this.createPost)

  }

  getAllPosts = (request: express.Request, response: express.Response) => {
    postModel.find()
      .then((result) => response.send(result))
  };

  createPost = (request: express.Request, response: express.Response) => {
    const { author, content, title } = request.body
    const postData: IPost = { author, content, title }
    const createdPost = new postModel(postData)

    createdPost.save()
      .then(savedPost => response.send(savedPost))
  };
}


const postsController = new PostsController()
export default postsController;