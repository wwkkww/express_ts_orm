import express from 'express';
import { getRepository } from 'typeorm';
import Controller from '../interfaces/controller.interface';
import Address from './address.entity';

class AddressController implements Controller {
  public path = "/address";
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(this.path, this.getAllAddress)
  }

  private getAllAddress = async (request: express.Request, response: express.Response) => {
    const address = await getRepository(Address).find({ relations: ['user'] })
    response.send(address);
  }
}

const addressController = new AddressController()
export default addressController;
