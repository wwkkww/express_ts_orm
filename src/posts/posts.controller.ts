import express, { Request, Response, NextFunction } from 'express';
import Controller from '../interfaces/controller.interface';
import { IPost } from './post.interface';
import postModel from './post.model';
import PostNotFoundException from '../exceptions/PostNotFoundException';
import validationMiddleware from '../middleware/validation.middleware';
import CreatePostDto from './post.dto';

class PostsController implements Controller {
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
    this.router.post(this.path, validationMiddleware(CreatePostDto), this.createPost)
    // Get post by id
    this.router.get(`${this.path}/:id`, this.getPostById)
    // Patch a post
    this.router.patch(`${this.path}/:id`, this.modifyPost)
    // Delete a post
    this.router.delete(`${this.path}/:id`, this.deletePost)

  }

  private getAllPosts = (request: Request, response: Response) => {
    // NOTE: find() method does not cause the query to be executed, 
    // it happens after call the then function.
    // Can also do it by calling postModel.find().exec() function that returns a promise
    postModel.find()
      .then((result) => response.send(result))
  };

  private createPost = (request: Request, response: Response) => {
    const { author, content, title } = request.body
    const postData: IPost = { author, content, title }
    const createdPost = new postModel(postData)

    createdPost.save()
      .then(savedPost => response.send(savedPost))
  };

  private getPostById = (request: Request, response: Response, next: NextFunction) => {
    // console.log(request.params)
    const id = request.params.id;
    // alternative: postModel.findOne({ _id: id, title: title })
    postModel.findById(id)
      .then((post) => {
        if (post)
          response.send(post)
        else {
          next(new PostNotFoundException(id))
          // next(new HttpException(404, "Post not found. Please try angain"))
          // response.status(404).send({ error: "Post not found" })
        }
      });
  };

  private modifyPost = (request: Request, response: Response) => {
    const id = request.params.id;
    const postData: IPost = request.body;
    // { new: true } pass into options to get the new, modified document instead of the old one
    postModel.findByIdAndUpdate(id, postData, { new: true })
      .then(post => response.send(post))
  }

  private deletePost = (request: Request, response: Response, next: NextFunction) => {
    const id = request.params.id;
    postModel.findByIdAndDelete(id)
      .then(result => {
        if (result) {
          response.send(result)
        } else {
          next(new PostNotFoundException(id))
          // response.status(404).send({ error: "Post not found" })
        }
      })
  }
}


const postsController = new PostsController()
export default postsController;