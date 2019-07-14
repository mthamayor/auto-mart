/**
 * Routes every car API endpoint here
 */
import express from 'express';
import { Flags, Cars, PurchaseOrders } from '../controllers';
import { Authorization, CarsValidator } from '../middlewares';


const carsRouter = express.Router();

// Users can create ad
carsRouter.post('/',
  Authorization.verifyToken,
  CarsValidator.createAd,
  Cars.createAd);

// Users can mark their adverts as sold
carsRouter.patch(
  '/:car_id/status',
  Authorization.verifyToken,
  CarsValidator.markAsSold,
  Cars.markAsSold,
);

// Users can update price of their adverts
carsRouter.patch(
  '/:car_id/price',
  Authorization.verifyToken,
  CarsValidator.updateCarPrice,
  Cars.updateCarPice,
);

// Users can get a particular car
carsRouter.get(
  '/:car_id/',
  CarsValidator.getCar,
  Cars.getCar,
);

// Admins can delete cars
carsRouter.delete(
  '/:car_id/',
  Authorization.verifyToken,
  CarsValidator.getCar,
  Cars.deleteCar,
);

// Admin can get all cars
carsRouter.get('/',
  Authorization.verifyToken,
  CarsValidator.filterCars,
  Cars.filterCars);

// Admins can view all flags for posted AD
carsRouter.get(
  '/:car_id/flags',
  Authorization.verifyToken,
  CarsValidator.getCar,
  Flags.getCarFlags,
);

// Users can get all their cars
carsRouter.get('/user/my-cars', Authorization.verifyToken, Cars.getCarsByOwner);

// Users can get all orders for their car
carsRouter.get(
  '/:car_id/orders',
  CarsValidator.getCar,
  PurchaseOrders.getOrdersByCar,
);

export default carsRouter;
