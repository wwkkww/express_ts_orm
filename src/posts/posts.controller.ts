import express from 'express';
import Post from './post.interface';

class PostsController {
  router = express.Router();

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
    this.router.get('/posts', (request: express.Request, response: express.Response) => {
      // console.log(request.url)
      response.send(this.posts);
    })

    // Create a post
    this.router.post('/posts', (request: express.Request, response: express.Response) => {
      const { author, content, title } = request.body
      const post: Post = { author, content, title }
      this.posts.push(post)
      response.send(post);
    })
  }
}


export default PostsController;