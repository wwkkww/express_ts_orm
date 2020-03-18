import express from 'express';
import Controller from '../interfaces/controller.interface';
import CreateCategoryDto from './category.dto';
import Category from './category.entity';
import { getRepository } from 'typeorm';
import { validationMiddleware } from '../middleware/validation.middleware';


class CategoryController implements Controller {
  public path = "/category";
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
    const categories = await getRepository(Category).find();
    response.send(categories)
  }


  private getAllCategoryById = async (request: express.Request, response: express.Response, next: express.NextFunction) => {

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