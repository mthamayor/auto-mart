import validator from 'validator';
import { carsHelper } from '../models';
import { ResponseHandler } from '../utils';

/**
 * @class FlagsValidator
 * @description Validates Flags route
 * @exports FlagsValidator
 */
class FlagsValidator {
  /**
   * @method createFlag
   * @description - Validates create flag parameters
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @param {function} next - Passes control to next middleware
   */
  static async createFlag(req, res, next) {
    const { carId, reason, description } = req.body;

    const authData = req.authToken.data;

    const reporter = authData.id;

    if (
      carId === undefined
      || String(carId).trim() === ''
      || !validator.isNumeric(carId)
    ) {
      ResponseHandler.error(res, 400, 'car id is undefined or invalid');
      return;
    }

    if (reason === undefined || String(reason).trim() === '') {
      ResponseHandler.error(res, 400, 'reason is undefined');
      return;
    }
    if (description === undefined || String(description).trim() === '') {
      ResponseHandler.error(res, 400, 'description is undefined');
      return;
    }

    const car = await carsHelper.getCar(parseInt(carId, 10));

    if (car === -1) {
      ResponseHandler.error(res, 404, 'car to flag was not found');
      return;
    }

    if (car.owner === reporter) {
      ResponseHandler.error(res, 403, 'you cannot flag your own advert');
      return;
    }

    if (car.status === 'sold') {
      ResponseHandler.error(res, 403, 'you cannot flag a sold advert');
      return;
    }

    next();
  }
}

export default FlagsValidator;
