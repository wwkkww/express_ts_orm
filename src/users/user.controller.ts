import express from 'express';
import NotAuthorizedException from '../exceptions/NotAuthorizedException';
import Controller from '../interfaces/controller.interface';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import authMiddleware from '../middleware/auth.middleware';
import Post from '../posts/post.entity';
import User from './user.entity';
import { getRepository, Db } from 'typeorm';
// import postModel from '../posts/post.model';


class UserController implements Controller {
  public path = "/users"
  public router = express.Router()

  constructor() {
    this.intializeRoutes()
  }

  private intializeRoutes() {
    this.router.get(this.path, this.getAllUserWithPost)
    this.router.get(`${this.path}/:id/posts`, authMiddleware, this.getAllPostsByUserId)
  }

  private getAllUserWithPost = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
    console.log('getAllUser', request.url)
    // const users = await getRepository(User).find({ relations: ['posts'] })

    // const users = await getRepository(User)
    //   .createQueryBuilder("user")
    //   .leftJoinAndSelect("user.posts", "posts")
    //   .getCount();

    const users = await getRepository(User)
      .createQueryBuilder("user")
      .leftJoin("user.posts", "posts")
      .addSelect('COUNT(posts) as totalPost')
      .groupBy("user.id")
      .getRawMany();
    console.log("users:", users)
    response.send(users)
  }


  private getAllPostsByUserId = async (request: RequestWithUser, response: express.Response, next: express.NextFunction) => {

    const paramsUserId = parseInt(request.params.id);

    if (request.user) {
      const currentUserId = parseInt(request.user.id)
      // Only person logged in can get a list of all his posts
      // check current_user id === request.params userId
      if (paramsUserId === currentUserId) {
        // onst user = await getRepository(User).findOne({ email: loginData.email });
        const posts = await getRepository(Post).findAndCount({ author: request.user })
        response.send(posts)
      } else {
        next(new NotAuthorizedException())
      }
    } else {
      next(new NotAuthorizedException())
    }


    /**
     * MONGODB CODE
     */
    // const paramsUserId = request.params.id;
    // let currentUserId = ""
    // if (request.user) {
    //   currentUserId = String(request.user._id)
    // }
    // // Only person logged in can get a list of all his posts
    // // check current_user id === request.params userId
    // if (paramsUserId === currentUserId) {
    //   const posts = await postModel.find({ author: paramsUserId })
    //   response.send(posts)
    // } else {
    //   next(new NotAuthorizedException())
    // }
  }
}

const userController = new UserController()
export default userController