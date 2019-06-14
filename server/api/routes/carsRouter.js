/**
 * Routes every car API endpoint here
 */
import express from 'express';
import { Cars } from '../controllers';
import { Authorization, CarsValidator } from '../middlewares';

const carsRouter = express.Router();

// Protected route
carsRouter.post('/',
  Authorization.verifyToken,
  CarsValidator.createAd,
  Cars.createAd);

carsRouter.patch(
  '/:car_id/status',
  Authorization.verifyToken,
  CarsValidator.markAsSold,
  Cars.markAsSold,
);

carsRouter.patch(
  '/:car_id/price',
  Authorization.verifyToken,
  CarsValidator.markAsSold,
  CarsValidator.updateCarPrice,
  Cars.updateCarPice,
);

carsRouter.get(
  '/:car_id/',
  CarsValidator.getAvailableCar,
  Cars.getAvailableCar,
);

carsRouter.delete(
  '/:car_id/',
  Authorization.verifyToken,
  Authorization.isAdmin,
  CarsValidator.getAvailableCar,
  Cars.deleteCar,
);

carsRouter.get('/',
  Authorization.adminSearch,
  CarsValidator.filterCars,
  Cars.filterCars);

export default carsRouter;
