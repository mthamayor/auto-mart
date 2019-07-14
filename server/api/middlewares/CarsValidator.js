/* eslint-disable no-await-in-loop */
/**
 * cars validator controller
 * Handles every car Validator related tasks
 */
import validator from 'validator';
import multer from 'multer';
import fs from 'fs';
import { promisify } from 'util';
import { carsHelper } from '../models';
import upload from '../config/multer';
import { imageUploader, ResponseHandler } from '../utils';

const unlinkAsync = promisify(fs.unlink);

/**
 * @class CarsValidator
 * @description Validates Cars route
 * @exports CarsValidator
 */
class CarsValidator {
  /**
   * @method createAd
   * @description - Validates create ad parameters
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @param {function} next - Passes control to next middleware
   */
  static createAd(req, res, next) {
    upload(req, res, async (err) => {
      if (err || err instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
        ResponseHandler.error(res, 415, 'Images uploaded are not valid');
        return;
      }

      // Everything went fine.
      console.log(req.files);
      const imgFiles = req.files;

      const bodyType = req.body.body_type;
      const {
        state, price, manufacturer, model,
      } = req.body;

      if (state === undefined || String(state).trim() === '') {
        ResponseHandler.error(res, 400, 'vehicle state is undefined');
        return;
      }

      if (state !== 'new' && state !== 'used') {
        ResponseHandler.error(
          res,
          400,
          'vehicle state can only be new or used',
        );
        return;
      }

      if (price === undefined || String(price).trim() === '') {
        ResponseHandler.error(res, 400, 'price is undefined');
        return;
      }

      if (!validator.isNumeric(String(price))) {
        ResponseHandler.error(res, 400, 'price is not a number');
        return;
      }

      if (manufacturer === undefined || String(manufacturer).trim() === '') {
        ResponseHandler.error(res, 400, 'manufacturer is undefined or invalid');
        return;
      }

      if (model === undefined || String(model).trim() === '') {
        ResponseHandler.error(res, 400, 'model undefined or invalid');
        return;
      }

      if (bodyType === undefined || bodyType.trim() === '') {
        ResponseHandler.error(res, 400, 'body type is undefined or invalid');
        return;
      }

      // Restrict images to 1 - 6
      if (imgFiles.length <= 0 || imgFiles.length > 6) {
        ResponseHandler.error(res, 400, 'please add between 1 and 6 images');
        return;
      }
      const imageList = [];

      for (let i = 0; i < imgFiles.length; i += 1) {
        const image = await imageUploader(req.files[i]);
        // delete files after upload
        await unlinkAsync(imgFiles[i].path);
        if (image === -1) {
          ResponseHandler.error(
            res,
            502,
            'error uploading the images to cloudinary',
          );
          return;
        }
        imageList.push(image);
      }

      req.body.imageUrlList = imageList;

      next();
    });
  }

  static verifyImage(req, res, next) {
    console.log(typeof req.body.image_url);
    console.log(req.body.image_url);
    console.log(`IMG_URL ${req.body.img_url}`);
    next();
  }

  /**
   * @method markAsSold
   * @description - validates mark as sold parameters
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @param {function} next - Passes control to next middleware
   */
  static async markAsSold(req, res, next) {
    const carId = req.params.car_id;

    const authData = req.authToken;

    const user = authData.id === undefined ? authData.data.id : authData.id;

    if (
      carId === undefined
      || String(carId).trim() === ''
      || !validator.isNumeric(String(carId))
    ) {
      ResponseHandler.error(
        res,
        400,
        'car_id parameter is undefined or invalid',
      );
      return;
    }

    const findCar = await carsHelper.getCar(parseInt(carId, 10));

    if (findCar === -1) {
      ResponseHandler.error(res, 404, 'car advert does not exist');
      return;
    }

    if (findCar.owner !== user) {
      ResponseHandler.error(res, 403, "you cannot edit another user's advert");
      return;
    }

    if (findCar.status !== 'available') {
      ResponseHandler.error(
        res,
        409,
        'the car has already been marked as sold',
      );
      return;
    }

    next();
  }

  /**
   * @method updateCarPrice
   * @description - Validates update car price parameters
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @param {function} next - Passes control to next middleware
   */
  static updateCarPrice(req, res, next) {
    const { price } = req.body;

    if (
      price === undefined
      || String(price).trim() === ''
      || !validator.isNumeric(String(price))
    ) {
      ResponseHandler.error(res, 400, 'price is undefined or invalid');
      return;
    }

    next();
  }

  /**
   * @method getCar
   * @description - validates get car parameter
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @param {function} next - Passes control to next middleware
   */
  static async getCar(req, res, next) {
    const carId = req.params.car_id;

    if (String(carId).trim() === '' || !validator.isNumeric(String(carId))) {
      ResponseHandler.error(res, 400, 'car_id parameter is not a valid number');
      return;
    }

    const car = await carsHelper.getCar(parseInt(carId, 10));

    if (car === -1) {
      ResponseHandler.error(res, 404, 'car does not exist');
      return;
    }

    next();
  }

  /**
   * @method filterCars
   * @description - Validates filter cars parameters
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @param {function} next - Passes control to next middleware
   */
  static filterCars(req, res, next) {
    const { status, state, manufacturer } = req.query;

    let minPrice = req.query.min_price;

    let maxPrice = req.query.max_price;

    const bodyType = req.query.body_type;

    const filterParams = [];

    let filterPriceParams;

    if (status !== undefined && String(status).trim() !== '') {
      filterParams.push({ name: 'status', value: status });
    }

    if (state !== undefined && String(state).trim() !== '') {
      filterParams.push({ name: 'state', value: state });
    }

    if (manufacturer !== undefined && String(manufacturer).trim() !== '') {
      filterParams.push({ name: 'manufacturer', value: manufacturer });
    }

    if (bodyType !== undefined && String(bodyType).trim() !== '') {
      filterParams.push({ name: 'body_type', value: bodyType });
    }

    if (
      (minPrice === undefined && minPrice !== maxPrice)
      || (maxPrice === undefined && maxPrice !== minPrice)
    ) {
      ResponseHandler.error(
        res,
        400,
        'please specify both min_price and maxprice',
      );
      return;
    }
    if (
      minPrice !== undefined
      && maxPrice !== undefined
      && String(maxPrice).trim() !== ''
      && String(minPrice).trim() !== ''
    ) {
      if (!validator.isNumeric(String(minPrice))) {
        ResponseHandler.error(res, 400, 'min_price is not a number');
        return;
      }

      if (!validator.isNumeric(String(maxPrice))) {
        ResponseHandler.error(res, 400, 'max_price is not a number');
        return;
      }

      minPrice = parseFloat(minPrice);
      maxPrice = parseFloat(maxPrice);

      if (minPrice >= maxPrice) {
        ResponseHandler.error(
          res,
          400,
          'min_price cannot be greater or equal to max price',
        );
        return;
      }
      filterPriceParams = { minPrice, maxPrice };
    }
    req.filterParams = filterParams;

    req.filterPriceParams = filterPriceParams;

    next();
  }
}

export default CarsValidator;
