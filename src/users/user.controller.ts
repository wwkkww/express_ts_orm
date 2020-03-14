import express from 'express';
import NotAuthorizedException from '../exceptions/NotAuthorizedException';
import Controller from '../interfaces/controller.interface';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import authMiddleware from '../middleware/auth.middleware';
import postModel from '../posts/post.model';


class UserController implements Controller {
  public path = "/users"
  public router = express.Router()

  constructor() {
    this.intializeRoutes()
  }

  private intializeRoutes() {
    this.router.get(`${this.path}/:id/posts`, authMiddleware, this.getAllPostsByUserId)
  }

  private getAllPostsByUserId = async (request: RequestWithUser, response: express.Response, next: express.NextFunction) => {
    const paramsUserId = request.params.id;
    let currentUserId = ""
    if (request.user) {
      currentUserId = String(request.user._id)
    }
    // Only person logged in can get a list of all his posts
    // check current_user id === request.params userId
    if (paramsUserId === currentUserId) {
      const posts = await postModel.find({ author: paramsUserId })
      response.send(posts)
    } else {
      next(new NotAuthorizedException())
    }
  }
}

const userController = new UserController()
export default userController