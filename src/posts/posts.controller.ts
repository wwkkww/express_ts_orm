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
    // Get post by id
    this.router.get(`${this.path}/:id`, this.getPostById)
    // Delete a post
    this.router.delete(`${this.path}/:id`, this.deletePost)

  }

  private getAllPosts = (request: express.Request, response: express.Response) => {
    // NOTE: find() method does not cause the query to be executed, 
    // it happens after call the then function.
    // Can also do it by calling postModel.find().exec() function that returns a promise
    postModel.find()
      .then((result) => response.send(result))
  };

  private createPost = (request: express.Request, response: express.Response) => {
    const { author, content, title } = request.body
    const postData: IPost = { author, content, title }
    const createdPost = new postModel(postData)

    createdPost.save()
      .then(savedPost => response.send(savedPost))
  };

  private getPostById = (request: express.Request, response: express.Response) => {
    // console.log(request.params)
    const id = request.params.id;
    // alternative: postModel.findOne({ _id: id, title: title })
    postModel.findById(id)
      .then((post) => response.send(post));
  };

  private deletePost = (request: express.Request, response: express.Response) => {
    const id = request.params.id;
    postModel.findByIdAndDelete(id)
      .then(result => {
        console.log(result)
        if (result) {
          response.send(result)
        } else {
          response.send(404)
        }
      })
  }


}


const postsController = new PostsController()
export default postsController;