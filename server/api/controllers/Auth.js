import crypto from 'crypto';
import debug from 'debug';
import { usersHelper, passwordHelper } from '../models';
import { ResponseHandler, HelperFunctions } from '../utils';
import customMailer from '../config/mailer';
import { query } from '../config/pool';

const log = debug('automart');

/**
 * @class Auth
 * @description Performs every auth related tasks
 * @exports Auth
 */
class Auth {
  /**
   * @method signUp
   * @description Adds user
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @returns {object} - JSON Response
   */
  static async signUp(req, res) {
    let firstName = req.body.first_name;
    let lastName = req.body.last_name;
    let {
      email, address, password,
    } = req.body;

    email = HelperFunctions.removeAllWhitespace(email);
    firstName = HelperFunctions.removeAllWhitespace(firstName);
    lastName = HelperFunctions.removeAllWhitespace(lastName);
    address = address.trim();
    address = HelperFunctions.replaceAllWhitespace(address);
    password = HelperFunctions.removeAllWhitespace(password);

    const hash = HelperFunctions.hashPassword(password);

    const queryText = {
      name: 'insert-user',
      text:
        'INSERT INTO users(email, first_name, last_name, address, password) '
        + 'VALUES($1, $2, $3, $4, $5) '
        + 'RETURNING id, email, first_name, last_name, address, is_admin',
      values: [email, firstName, lastName, address, hash],
    };
    let queryResult;
    try {
      queryResult = await query(queryText);
    } catch (err) {
      log(err.stack);
      ResponseHandler.error(res, 500, 'internal server error');
      return;
    }
    const data = queryResult.rows[0];

    // Create a jwt token and send along with the data
    const options = { expiresIn: '1d' };
    const secret = process.env.JWT_SECRET || 'jwtSecret';

    const signingData = {
      id: data.id,
      firstName: data.first_name,
      lastName: data.last_name,
      email: data.email,
      address: data.address,
      isAdmin: data.is_admin,
    };

    data.token = HelperFunctions.signToken(signingData, secret, options);

    ResponseHandler.success(res, 201, data);
  }

  /**
   * @method signIn
   * @description - Fetches user
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @returns {object} - JSON Response
   */
  static async signIn(req, res) {
    const { email } = req.body;

    // Retreive data from db
    const data = await usersHelper.getUserByEmail(email);

    // Create a jwt token and send along with the data
    const options = { expiresIn: '1d' };
    const secret = process.env.JWT_SECRET || 'jwtSecret';

    const signingData = {
      id: data.id,
      firstName: data.first_name,
      lastName: data.last_name,
      email: data.email,
      address: data.address,
      isAdmin: data.is_admin,
    };

    data.token = HelperFunctions.signToken(signingData, secret, options);

    ResponseHandler.success(res, 200, data);
  }

  /**
   * @method setAdmin
   * @description Sets user as an admin
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @returns {object} - JSON Response
   */
  static async setAdmin(req, res) {
    let userId = req.params.user_id;
    userId = parseInt(userId, 10);
    await usersHelper.setAdmin(userId);
    // Retreive data from db
    const data = await usersHelper.getUser(userId);
    // Create a jwt token and send along with the data
    const options = { expiresIn: '1d' };
    const secret = process.env.JWT_SECRET || 'jwtSecret';
    const signingData = {
      id: data.id,
      firstName: data.first_name,
      lastName: data.last_name,
      email: data.email,
      address: data.address,
      isAdmin: data.is_admin,
    };
    data.token = HelperFunctions.signToken(signingData, secret, options);

    ResponseHandler.success(res, 200, data);
  }

  /**
   * @method forgotPassword
   * @description - Requests password change for a user
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @returns {object} - JSON Response
   */
  static forgotPassword(req, res) {
    const { email } = req.body;
    const token = crypto.randomBytes(20).toString('hex');

    passwordHelper.addRequest({
      email,
      token,
      expiresOn: Date.now() + 3600000,
    });
    const resetRequest = passwordHelper.getRequest(email);

    const mailOptions = {
      to: resetRequest.email,
      from: process.env.GMAIL,
      subject: 'AutoMart Password Reset',
      text:
        'You are receiving this because you requested to reset your password\n\n'
        + 'please click on the following link to complete the process\n\n'
        + `https://mthamayor.github.io/auto-mart/reset-password?token=${token}`,
    };

    if (process.env.NODE_ENV !== 'production') {
      ResponseHandler.success(res, 200, { token });
      return;
    }

    customMailer.sendMail(mailOptions, (err) => {
      if (err) {
        ResponseHandler.error(res, 500, 'Password reset Failed');
        return;
      }
      ResponseHandler.success(res, 200, 'Password reset successful');
    });
  }

  /**
   * @method resetPassword
   * @description - Resets user's password
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @returns {object} - JSON Response
   */
  static async resetPassword(req, res) {
    let newPassword = req.body.new_password;
    let { email } = req.body;

    email = email.trim();
    newPassword = newPassword.trim();
    const hash = HelperFunctions.hashPassword(newPassword);
    await usersHelper.changePassword(email, hash);
    passwordHelper.removeRequest(email);

    ResponseHandler.success(res, 200, 'Password successfully changed');
  }

  /**
   * @method reset
   * @description - Requests password change for a user
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @returns {object} - JSON Response
   */
  static async reset(req, res) {
    const { email } = req.params;
    const newPassword = req.body.new_password;

    if (
      (newPassword !== undefined)
    ) {
      const hash = HelperFunctions.hashPassword(newPassword);
      await usersHelper.changePassword(email, hash);
      ResponseHandler.success(res, 204);
      return;
    }
    const password = crypto.randomBytes(8).toString('hex');
    const hash = HelperFunctions.hashPassword(password);
    await usersHelper.changePassword(email, hash);

    const mailOptions = {
      to: email,
      from: process.env.GMAIL,
      subject: 'AutoMart Password Reset',
      text:
        'You are receiving this because you requested to reset your password\n\n'
        + `new password: ${password}\n\n`,
    };

    customMailer.sendMail(mailOptions, () => {
      ResponseHandler.success(res, 204);
    });
  }
}

export default Auth;
