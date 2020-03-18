import express from 'express';
import Controller from '../interfaces/controller.interface';
import CreateCategoryDto from './category.dto';
import Category from './category.entity';
import { getRepository } from 'typeorm';
import { validationMiddleware } from '../middleware/validation.middleware';
import CategoryNotFoundException from '../exceptions/CategoryNotFoundException';


class CategoryController implements Controller {
  public path = "/categories";
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(this.path, this.getAllCategories)
    this.router.get(`${this.path}/:id`, this.getAllCategoryById)
    this.router.post(this.path, validationMiddleware(CreateCategoryDto), this.createCategory)

  }


  private getAllCategories = async (request: express.Request, response: express.Response) => {
    // Relations property name refer to format defined in Entity class
    const categories = await getRepository(Category).find({ relations: ['posts'] });
    response.send(categories)
  }


  private getAllCategoryById = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
    const catId = request.params.id;
    const category = await getRepository(Category).findOne({ id: catId }, { relations: ['posts'] })
    if (category) {
      response.send(category);
    } else {
      next(new CategoryNotFoundException(catId))
    }
  }

  private createCategory = async (request: express.Request, response: express.Response) => {
    const categoryData: CreateCategoryDto = request.body;
    const newCategory = getRepository(Category).create(categoryData)
    await getRepository(Category).save(newCategory)

    response.send(newCategory)
  }
}

const categoryController = new CategoryController()
export default categoryController;