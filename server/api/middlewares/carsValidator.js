/* eslint-disable no-await-in-loop */
/**
 * user validator controller
 * Handles every user Validator related tasks
 */
import validator from 'validator';
import multer from 'multer';
import fs from 'fs';
import { promisify } from 'util';

import helpers from '../utils/helpers';

const unlinkAsync = promisify(fs.unlink);

const storage = multer.diskStorage({
  filename: (req, file, callback) => {
    callback(null, Date.now() + file.originalname);
  },
});
const upload = multer({ storage }).array('imageArray', 10);

const carsValidator = {
  createAd(req, res, next) {
    upload(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
        return res.status(400).send({
          status: 400,
          error: 'Images uploaded are not valid',
        });
      } if (err) {
        // An unknown error occurred when uploading.
        return res.status(403).send({
          status: 403,
          error: 'Error occured while uploading',
        });
      }
      // Everything went fine.

      const imgFiles = req.files;
      const {
        owner,
        state,
        price,
        manufacturer,
        model,
        bodyType,
        name,
        email,
      } = req.body;
      if (owner === undefined || owner.trim() === '') {
        return res.status(400).send({
          status: 400,
          error: 'owner undefined or invalid',
        });
      }
      if (!validator.isNumeric(owner)) {
        return res.status(400).send({
          status: 400,
          error: 'owner is not a number',
        });
      }
      if (email === undefined || email.trim() === '' || !validator.isEmail(email)) {
        return res.status(400).send({
          status: 400,
          error: 'email is not valid',
        });
      }
      if (state === undefined || state.trim() === '') {
        return res.status(400).send({
          status: 400,
          error: 'vehicle state is undefined',
        });
      }
      if (state !== 'new' && state !== 'used') {
        return res.status(400).send({
          status: 400,
          error: 'vehicle state can only be new or used',
        });
      }
      if (price === undefined || price.trim() === '') {
        return res.status(400).send({
          status: 400,
          error: 'price is undefined',
        });
      }
      if (!validator.isNumeric(price)) {
        return res.status(400).send({
          status: 400,
          error: 'price is not a number',
        });
      }
      if (manufacturer === undefined || manufacturer.trim() === '') {
        return res.status(400).send({
          status: 400,
          error: 'manufacturer is undefined or invalid',
        });
      }
      if (model === undefined || model.trim() === '') {
        return res.status(400).send({
          status: 400,
          error: 'model undefined or invalid',
        });
      }
      if (bodyType === undefined || bodyType.trim() === '') {
        return res.status(400).send({
          status: 400,
          error: 'body type is undefined or invalid',
        });
      }
      if (name === undefined || name.trim() === '') {
        return res.status(400).send({
          status: 400,
          error: 'vehicle name undefined or invalid',
        });
      }
      // Restrict images to 1 - 4
      if (imgFiles.length <= 0 || imgFiles.length > 6) {
        return res.status(400).send({
          status: 400,
          error: 'please add between 1 and 6 images',
        });
      }
      const imageList = [];

      for (let i = 0; i < imgFiles.length; i += 1) {
        const image = await helpers.uploadImage(req.files[i]);
        await unlinkAsync(imgFiles[i].path);
        if (image === -1) {
          return res.status(502).send({
            status: 502,
            error: 'error uploading the images to cloudinary',
          });
        }
        imageList.push(image);
      }

      req.body.imageUrlList = imageList;
      return next();
    });
  },
};

export default carsValidator;
