/* eslint-disable no-await-in-loop */
/**
 * user validator controller
 * Handles every user Validator related tasks
 */
import validator from 'validator';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

import helpers from '../utils/helpers';
import { carsHelper } from '../models';

const unlinkAsync = promisify(fs.unlink);

const storage = multer.diskStorage({
  filename: (req, file, callback) => {
    callback(null, Date.now() + file.originalname);
  },
});
const fileFilter = (req, file, callback) => {
  const ext = path.extname(file.originalname);
  if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
    callback(new Error('Only images are allowed'));
    return;
  }
  callback(null, true);
};
const upload = multer({ storage, fileFilter }).array('imageArray', 10);

const carsValidator = {
  createAd(req, res, next) {
    upload(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
        res.status(400).send({
          status: 400,
          error: 'Images uploaded are not valid',
        });
        return;
      } if (err) {
        // An unknown error occurred when uploading.
        res.status(403).send({
          status: 403,
          error: 'Error occured while uploading',
        });
        return;
      }
      // Everything went fine.

      const imgFiles = req.files;
      const {
        state,
        price,
        manufacturer,
        model,
        bodyType,
        name,
      } = req.body;
      if (state === undefined || state.trim() === '') {
        res.status(400).send({
          status: 400,
          error: 'vehicle state is undefined',
        });
        return;
      }
      if (state !== 'new' && state !== 'used') {
        res.status(400).send({
          status: 400,
          error: 'vehicle state can only be new or used',
        });
        return;
      }
      if (price === undefined || price.trim() === '') {
        res.status(400).send({
          status: 400,
          error: 'price is undefined',
        });
        return;
      }
      if (!validator.isNumeric(price)) {
        res.status(400).send({
          status: 400,
          error: 'price is not a number',
        });
        return;
      }
      if (manufacturer === undefined || manufacturer.trim() === '') {
        res.status(400).send({
          status: 400,
          error: 'manufacturer is undefined or invalid',
        });
        return;
      }
      if (model === undefined || model.trim() === '') {
        res.status(400).send({
          status: 400,
          error: 'model undefined or invalid',
        });
        return;
      }
      if (bodyType === undefined || bodyType.trim() === '') {
        res.status(400).send({
          status: 400,
          error: 'body type is undefined or invalid',
        });
        return;
      }
      if (name === undefined || name.trim() === '') {
        res.status(400).send({
          status: 400,
          error: 'vehicle name undefined or invalid',
        });
        return;
      }
      // Restrict images to 1 - 4
      if (imgFiles.length <= 0 || imgFiles.length > 6) {
        res.status(400).send({
          status: 400,
          error: 'please add between 1 and 6 images',
        });
        return;
      }
      const imageList = [];

      for (let i = 0; i < imgFiles.length; i += 1) {
        const image = await helpers.uploadImage(req.files[i]);
        await unlinkAsync(imgFiles[i].path);
        if (image === -1) {
          res.status(502).send({
            status: 502,
            error: 'error uploading the images to cloudinary',
          });
          return;
        }
        imageList.push(image);
      }

      req.body.imageUrlList = imageList;
      next();
    });
  },
  markAsSold(req, res, next) {
    const carId = req.params.car_id;
    const authData = req.authToken;
    let user;
    if (authData.id === undefined) {
      user = authData.data.id;
    } else { user = authData.id; }

    if (
      carId === undefined
      || carId.trim() === ''
      || !validator.isNumeric(carId)
    ) {
      res.status(400).send({
        status: 400,
        error: 'car_id parameter is undefined or invalid',
      });
      return;
    }
    const findCar = carsHelper.getCar(parseInt(carId, 10));

    if (findCar === -1) {
      res.status(404).send({
        status: 404,
        error: 'car advert does not exist',
      });
      return;
    }
    if (findCar.owner !== user) {
      res.status(403).send({
        status: 403,
        error: "you cannot edit another user's advert",
      });
      return;
    }

    if (findCar.status !== 'available') {
      res.status(409).send({
        status: 409,
        error: 'the car has already been marked as sold',
      });
      return;
    }

    next();
  },
  updateCarPrice(req, res, next) {
    const { newPrice } = req.body;

    if (
      newPrice === undefined
      || newPrice.trim() === ''
      || !validator.isNumeric(newPrice)
    ) {
      res.status(400).send({
        status: 400,
        error: 'newPrice is undefined or invalid',
      });
      return;
    }
    next();
  },

  getAvailableCar(req, res, next) {
    const carId = req.params.car_id;
    if (
      carId.trim() === ''
      || !validator.isNumeric(carId)
    ) {
      return res.status(400).send({
        status: 400,
        error: 'car_id parameter is not a valid number',
      });
    }
    const car = carsHelper.getAvailableCar(parseInt(carId, 10));
    if (car === -1) {
      return res.status(404).send({
        status: 404,
        error: 'car does not exist',
      });
    }
    return next();
  },
  filterCars(req, res, next) {
    const {
      status, state, manufacturer,
    } = req.query;
    let minPrice = req.query.min_price;
    let maxPrice = req.query.max_price;
    const bodyType = req.query.body_type;
    const filterParams = [];
    let filterPriceParams;

    if (status !== undefined && status.trim() !== '') {
      filterParams.push({ name: 'status', value: status });
    }
    if (state !== undefined && state.trim() !== '') {
      filterParams.push({ name: 'state', value: state });
    }

    if (manufacturer !== undefined && manufacturer.trim() !== '') {
      filterParams.push({ name: 'manufacturer', value: manufacturer });
    }

    if (bodyType !== undefined && bodyType.trim() !== '') {
      filterParams.push({ name: 'bodyType', value: bodyType });
    }

    if (
      (minPrice === undefined && minPrice !== maxPrice)
      || (maxPrice === undefined && maxPrice !== minPrice)
    ) {
      res.status(400).send({
        status: 400,
        error: 'please specify both min_price and maxprice',
      });
      return;
    }
    if (minPrice !== undefined
      && maxPrice !== undefined
      && maxPrice.trim() !== ''
      && minPrice.trim() !== '') {
      if (!validator.isNumeric(minPrice)) {
        res.status(400).send({
          status: 400,
          error: 'min_price is not a number',
        });
        return;
      }
      if (!validator.isNumeric(maxPrice)) {
        res.status(400).send({
          status: 400,
          error: 'max_price is not a number',
        });
        return;
      }
      minPrice = parseFloat(minPrice);
      maxPrice = parseFloat(maxPrice);

      if (minPrice >= maxPrice) {
        res.status(400).send({
          status: 400,
          error: 'min_price cannot be greater or equal to max price',
        });
        return;
      }
      filterPriceParams = { minPrice, maxPrice };
    }
    req.filterParams = filterParams;
    req.filterPriceParams = filterPriceParams;
    next();
  },
};

export default carsValidator;
