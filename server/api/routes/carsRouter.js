/**
 * Routes every car API endpoint here
 */
import express from 'express';
import { Cars } from '../controllers';
import { Authorization, CarsValidator } from '../middlewares';
import Flags from '../controllers/Flags';

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
  CarsValidator.getCar,
  Cars.getCar,
);

carsRouter.delete(
  '/:car_id/',
  Authorization.verifyToken,
  Authorization.isAdmin,
  CarsValidator.getCar,
  Cars.deleteCar,
);

carsRouter.get('/',
  Authorization.adminSearch,
  CarsValidator.filterCars,
  Cars.filterCars);

// Admins can view all flags for posted AD
carsRouter.get(
  '/:car_id/flags',
  Authorization.verifyToken,
  Authorization.isAdmin,
  CarsValidator.getCar,
  Flags.getCarFlags,
);

export default carsRouter;
