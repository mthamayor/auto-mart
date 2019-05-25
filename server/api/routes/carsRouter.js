/**
 * Routes every car API endpoint here
 */

import express from 'express';
import cars from '../controllers/cars';
import authorization from '../middlewares/authorization';
import carsValidator from '../middlewares/carsValidator';

const carsRouter = express.Router();


// Protected route
carsRouter.post('/', authorization.verifyToken, carsValidator.createAd, cars.createAd);

export default carsRouter;
