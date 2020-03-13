import express from 'express';
import Post from './post.interface';

class PostsController {
  public router = express.Router();
  public path = "/posts"

  constructor() {
    this.intializeRoutes();
  }

  private posts: Post[] = [
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
    // console.log(request.url)
    response.send(this.posts);
  };

  createPost = (request: express.Request, response: express.Response) => {
    const { author, content, title } = request.body
    const post: Post = { author, content, title }
    this.posts.push(post)
    response.send(post);
  };
}


const postsController = new PostsController()
export default postsController;