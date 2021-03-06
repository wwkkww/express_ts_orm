import express, { Request, Response, NextFunction } from 'express';
import Controller from '../interfaces/controller.interface';
import { Post } from './post.interface';
import postModel from './post.model';
import PostNotFoundException from '../exceptions/PostNotFoundException';
import { validationMiddleware } from '../middleware/validation.middleware';
import CreatePostDto from './post.dto';
import authMiddleware from '../middleware/auth.middleware';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import userModel from '../users/user.model';

class PostsController implements Controller {
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
    // Get post by id
    this.router.get(`${this.path}/:id`, this.getPostById)

    // chain route handlers to use authMiddleware
    this.router
      .all(`${this.path}/*`, authMiddleware)
      .patch(`${this.path}/:id`, validationMiddleware(CreatePostDto, true), this.modifyPost) // Patch a post
      .post(this.path, authMiddleware, validationMiddleware(CreatePostDto), this.createPost) // Create a post
      .delete(`${this.path}/:id`, this.deletePost) // Delete a post
  }

  private getAllPosts = async (request: Request, response: Response) => {
    // NOTE: find() method does not cause the query to be executed, 
    // it happens after call the then function.
    // Can also do it by calling postModel.find().exec() function that returns a promise
    // Can bypass this with async/await
    // NOTE: execPopulate() is not needed when call populate() on an instance of a QUERY
    const posts = await postModel.find().populate('author', '-password')
    response.send(posts)
  };

  private createPost = async (request: RequestWithUser, response: Response) => {
    const postData: CreatePostDto = request.body
    let userId = ""
    if (request.user) {
      userId = request.user._id
    }
    const createdPost = new postModel({
      ...postData,
      author: userId
    })

    // const user = await userModel.findById(userId);
    // if (user) {
    //   user.posts = [...user.posts, createdPost._id];
    //   await user.save();
    // }

    const savedPost = await createdPost.save();
    // NOTE: execPopulate() needed when call populate() on an instance of a DOCUMENT
    await savedPost.populate('author', '-password').execPopulate();
    response.send(savedPost);
  };

  private getPostById = async (request: Request, response: Response, next: NextFunction) => {
    // console.log(request.params)
    const id = request.params.id;
    // alternative: postModel.findOne({ _id: id, title: title })
    const post = await postModel.findById(id)
    if (post)
      response.send(post)
    else {
      next(new PostNotFoundException(id))
      // next(new HttpException(404, "Post not found. Please try angain"))
      // response.status(404).send({ error: "Post not found" })
    }

  };

  private modifyPost = async (request: Request, response: Response) => {
    const id = request.params.id;
    const postData: Post = request.body;
    // { new: true } pass into options to get the new, modified document instead of the old one
    const post = await postModel.findByIdAndUpdate(id, postData, { new: true })
    response.send(post);
  }

  private deletePost = async (request: Request, response: Response, next: NextFunction) => {
    const id = request.params.id;
    const result = await postModel.findByIdAndDelete(id)
    if (result) {
      response.send(result)
    } else {
      next(new PostNotFoundException(id))
      // response.status(404).send({ error: "Post not found" })
    }

  }
}


const postsController = new PostsController()
export default postsController;