/**
 * user validator controller
 * Handles every user Validator related tasks
 */

import validator from 'validator';
import bcrypt from 'bcryptjs';
import { usersHelper, passwordHelper } from '../models';
import helpers from '../utils/helpers';

const authValidator = {
  signUp(req, res, next) {
    const {
      email, firstName, lastName, address, password,
    } = req.body;

    if (email === undefined || !validator.isEmail(email)) {
      res.status(400).json({
        status: 400,
        error: 'email is undefined or invalid',
      });
      return;
    }
    if (firstName === undefined || !validator.isAlpha(firstName.trim())) {
      res.status(400).json({
        status: 400,
        error: 'first name is undefined or invalid',
      });
      return;
    }
    if (lastName === undefined || !validator.isAlpha(lastName.trim())) {
      res.status(400).json({
        status: 400,
        error: 'last name is undefined or invalid',
      });
      return;
    }
    if (address === undefined || address.trim() === '') {
      res.status(400).json({
        status: 400,
        error: 'address is undefined or invalid',
      });
      return;
    }
    if (password === undefined || password.trim() === '') {
      res.status(400).json({
        status: 400,
        error: 'password is undefined or invalid',
      });
      return;
    }

    // Check if user already exists
    if (usersHelper.getUserByEmail(email) !== -1) {
      res.status(409).json({
        status: 409,
        error: 'user already exists',
      });
      return;
    }

    next();
  },
  signIn(req, res, next) {
    const {
      email,
      password,
    } = req.body;

    if (email === undefined || !validator.isEmail(email)
    ) {
      res
        .status(400)
        .json({
          status: 400,
          error: 'email is undefined or invalid',
        });
      return;
    }

    if (password === undefined || password.trim() === ''
    ) {
      res
        .status(400)
        .json({
          status: 400,
          error: 'password is undefined',
        });
      return;
    }

    // Check if user does not exist
    if (usersHelper.getUserByEmail(email) === -1) {
      res
        .status(404)
        .json({
          status: 404,
          error: 'user does not exist',
        });
      return;
    }

    // Check if password matches
    const user = usersHelper.getUserByEmail(email);
    const passwordMatch = bcrypt.compareSync(password, user.password);
    if (!passwordMatch) {
      res.status(401).json({
        status: 401,
        error: 'invalid login credentials',
      });
      return;
    }
    next();
  },
  setAdmin(req, res, next) {
    const id = req.params.user_id;
    if (usersHelper.getUser(parseInt(id, 10)) === -1) {
      res.status(404).json({
        status: 404,
        error: 'user does not exist',
      });
      return;
    }
    next();
  },
  forgotPassword(req, res, next) {
    const { email } = req.body;
    if (!validator.isEmail(email)) {
      res.status(400).json({
        status: 400,
        error: 'email is invalid',
      });
      return;
    }
    // check if user exists
    const user = usersHelper.getUserByEmail(email.trim());

    if (user === -1) {
      res.status(404).json({
        status: 404,
        error: 'user not found',
      });
      return;
    }
    next();
  },
  resetPassword(req, res, next) {
    const { newPassword, token } = req.body;
    if (newPassword === undefined || newPassword.trim() === '') {
      res.status(400).json({
        status: 400,
        error: 'new password is undefined',
      });
      return;
    }
    if (!helpers.validPassword(newPassword)) {
      res.status(400).json({
        status: 400,
        error: 'password is not valid',
      });
      return;
    }

    const passwordRequest = passwordHelper.getRequestWithToken(token);

    if (passwordRequest === -1) {
      res.status(400).json({
        status: 400,
        error: 'invalid password reset token provided',
      });
      return;
    }

    if (Date.now() > passwordRequest.expiresOn) {
      res.status(400).json({
        status: 400,
        error: 'Token has expired',
      });
      return;
    }

    req.body.email = passwordRequest.email;

    next();
  },
};

export default authValidator;
