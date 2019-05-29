/**
 * user validator controller
 * Handles every user Validator related tasks
 */

import validator from 'validator';
import bcrypt from 'bcryptjs';
import { usersHelper } from '../models';

const authValidator = {
  signUp(req, res, next) {
    const {
      email, firstName, lastName, address, password,
    } = req.body;

    if (email === undefined || !validator.isEmail(email)) {
      return res.status(400).send({
        status: 400,
        error: 'email is undefined or invalid',
      });
    }
    if (firstName === undefined || !validator.isAlpha(firstName.trim())) {
      return res.status(400).send({
        status: 400,
        error: 'first name is undefined or invalid',
      });
    }
    if (lastName === undefined || !validator.isAlpha(lastName.trim())) {
      return res.status(400).send({
        status: 400,
        error: 'last name is undefined or invalid',
      });
    }
    if (address === undefined || address.trim() === '') {
      return res.status(400).send({
        status: 400,
        error: 'address is undefined or invalid',
      });
    }
    if (password === undefined || password.trim() === '') {
      return res.status(400).send({
        status: 400,
        error: 'password is undefined or invalid',
      });
    }

    // Check if user already exists
    if (usersHelper.getUserByEmail(email) !== -1) {
      return res.status(409).send({
        status: 409,
        error: 'user already exists',
      });
    }

    return next();
  },
  signIn(req, res, next) {
    const {
      email,
      password,
    } = req.body;

    if (email === undefined || !validator.isEmail(email)
    ) {
      return res
        .status(400)
        .send({
          status: 400,
          error: 'email is undefined or invalid',
        });
    }

    if (password === undefined || password.trim() === ''
    ) {
      return res
        .status(400)
        .send({
          status: 400,
          error: 'password is undefined',
        });
    }

    // Check if user does not exist
    if (usersHelper.getUserByEmail(email) === -1) {
      return res
        .status(404)
        .send({
          status: 404,
          error: 'user does not exist',
        });
    }

    // Check if password matches
    const user = usersHelper.getUserByEmail(email);
    const passwordMatch = bcrypt.compareSync(password, user.password);
    if (!passwordMatch) {
      return res.status(401).send({
        status: 401,
        error: 'invalid login credentials',
      });
    }
    return next();
  },
};

export default authValidator;
