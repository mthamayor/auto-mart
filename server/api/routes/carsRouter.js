/**
 * Routes every car API endpoint here
 */

import express from 'express';
import cars from '../controllers/cars';
import authorization from '../middlewares/authorization';
import carsValidator from '../middlewares/carsValidator';

const carsRouter = express.Router();


// Protected route
carsRouter.post('/',
  authorization.verifyToken,
  carsValidator.createAd,
  cars.createAd);

carsRouter.patch(
  '/:car_id/status',
  authorization.verifyToken,
  carsValidator.markAsSold,
  cars.markAsSold,
);

carsRouter.patch(
  '/:car_id/price',
  authorization.verifyToken,
  carsValidator.markAsSold,
  carsValidator.updateCarPrice,
  cars.updateCarPice,
);

carsRouter.get(
  '/:car_id/',
  carsValidator.getUserCar,
  cars.getUserCar,
);

export default carsRouter;
