import validator from 'validator';
import { carsHelper } from '../models';

const flagsValidator = {
  createFlag(req, res, next) {
    const {
      carId, reason, description,
    } = req.body;
    const authData = req.authToken.data;
    const reporter = authData.id;

    if (
      carId === undefined
      || carId.trim() === ''
      || !validator.isNumeric(carId)
    ) {
      res.status(400).json({
        status: 400,
        error: 'car id is undefined or invalid',
      });
      return;
    }

    if (
      reason === undefined
      || reason.trim() === ''
    ) {
      res.status(400).json({
        status: 400,
        error: 'reason is undefined',
      });
      return;
    }
    if (
      description === undefined
      || description.trim() === ''
    ) {
      res.status(400).json({
        status: 400,
        error: 'description is undefined',
      });
      return;
    }

    const car = carsHelper.getCar(parseInt(carId, 10));

    if (car === -1) {
      res.status(404).json({
        status: 404,
        error: 'car to flag was not found',
      });
      return;
    }

    if (car.owner === reporter) {
      res.status(403).json({
        status: 403,
        error: 'you cannot flag your own advert',
      });
      return;
    }

    if (car.status === 'sold') {
      res.status(403).json({
        status: 403,
        error: 'you cannot flag a sold advert',
      });
      return;
    }

    next();
  },
};

export default flagsValidator;
