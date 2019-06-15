/**
 * Auth validator controller
 * Handles every Auth validator related tasks
 */

import validator from 'validator';
import bcrypt from 'bcryptjs';
import { usersHelper, passwordHelper } from '../models';
import { ResponseHandler, HelperFunctions } from '../utils';

/**
 * @class AuthValidator
 * @description Validates Auth route
 * @exports AuthValidator
 */
class AuthValidator {
  /**
   * @method signUp
   * @description - Validates signUp parameters
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @param {function} next - Passes control to next middleware
   */
  static signUp(req, res, next) {
    const {
      email, firstName, lastName, address, password,
    } = req.body;

    if (email === undefined || !validator.isEmail(email)) {
      ResponseHandler.error(res, 400, 'email is undefined or invalid');
      return;
    }
    if (firstName === undefined || !validator.isAlpha(firstName.trim())) {
      ResponseHandler.error(res, 400, 'first name is undefined or invalid');
      return;
    }
    if (lastName === undefined || !validator.isAlpha(lastName.trim())) {
      ResponseHandler.error(res, 400, 'last name is undefined or invalid');
      return;
    }
    if (address === undefined || address.trim() === '') {
      ResponseHandler.error(res, 400, 'address is undefined or invalid');
      return;
    }
    if (password === undefined || password.trim() === '') {
      ResponseHandler.error(res, 400, 'password is undefined or invalid');
      return;
    }
    if (!HelperFunctions.validPassword(password)) {
      ResponseHandler.error(res, 400, 'password is not valid');
      return;
    }

    // Check if user already exists
    if (usersHelper.getUserByEmail(email) !== -1) {
      ResponseHandler.error(res, 409, 'user already exists');
      return;
    }

    next();
  }

  /**
   * @method signIn
   * @description - Validates signIn parameters
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @param {function} next - Passes control to next middleware
   */
  static signIn(req, res, next) {
    const { email, password } = req.body;

    if (email === undefined || !validator.isEmail(email)) {
      ResponseHandler.error(res, 400, 'email is undefined or invalid');
      return;
    }

    if (password === undefined || password.trim() === '') {
      ResponseHandler.error(res, 400, 'password is undefined');
      return;
    }

    // Check if user does not exist
    if (usersHelper.getUserByEmail(email) === -1) {
      ResponseHandler.error(res, 404, 'user does not exist');
      return;
    }

    // Check if password matches
    const user = usersHelper.getUserByEmail(email);
    const passwordMatch = bcrypt.compareSync(password, user.password);

    if (!passwordMatch) {
      ResponseHandler.error(res, 401, 'invalid login credentials');
      return;
    }
    next();
  }

  static setAdmin(req, res, next) {
    const id = req.params.user_id;
    if (usersHelper.getUser(parseInt(id, 10)) === -1) {
      ResponseHandler.error(res, 404, 'user does not exist');
      return;
    }
    next();
  }

  /**
   * @method forgotPassword
   * @description - Validates forgot passsword parameters
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @param {function} next - Passes control to next middleware
   */
  static forgotPassword(req, res, next) {
    const { email } = req.body;
    if (!validator.isEmail(email)) {
      ResponseHandler.error(res, 400, 'email is invalid');
      return;
    }
    // check if user exists
    const user = usersHelper.getUserByEmail(email.trim());

    if (user === -1) {
      ResponseHandler.error(res, 404, 'user not found');
      return;
    }
    next();
  }

  /**
   * @method resetPassword
   * @description - Validates reset password parameters
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @param {function} next - Passes control to next middleware
   */
  static resetPassword(req, res, next) {
    const { newPassword, token } = req.body;
    if (newPassword === undefined || newPassword.trim() === '') {
      ResponseHandler.error(res, 400, 'new password is undefined');
      return;
    }
    if (!HelperFunctions.validPassword(newPassword)) {
      ResponseHandler.error(res, 400, 'password is not valid');
      return;
    }

    const passwordRequest = passwordHelper.getRequestWithToken(token);

    if (passwordRequest === -1) {
      ResponseHandler.error(res, 400, 'invalid password reset token provided');
      return;
    }

    if (Date.now() > passwordRequest.expiresOn) {
      ResponseHandler.error(res, 400, 'Token has expired');
      return;
    }

    req.body.email = passwordRequest.email;

    next();
  }
}

export default AuthValidator;
