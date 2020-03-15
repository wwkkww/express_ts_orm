import express from 'express';
import Controller from '../interfaces/controller.interface';
import userModel from '../users/user.model';

class ReportController implements Controller {
  public path = '/report';
  public router = express.Router();

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.generateReport);
  }
  private generateReport = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
    const userByCountries = await userModel.aggregate(
      [
        {
          $group: {
            _id: {
              country: '$address.country'
            }
          }
        }
      ]
    );

    response.send({
      userByCountries
    })
  }
}

const reportController = new ReportController()
export default reportController;