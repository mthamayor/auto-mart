import crypto from 'crypto';
import { dummyUsers, usersHelper, passwordHelper } from '../models';
import { ResponseHandler, HelperFunctions } from '../utils';
import customMailer from '../config/mailer';

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
  static signUp(req, res) {
    let {
      email, firstName, lastName, address, password,
    } = req.body;

    email = HelperFunctions.removeAllWhitespace(email);
    firstName = HelperFunctions.removeAllWhitespace(firstName);
    lastName = HelperFunctions.removeAllWhitespace(lastName);
    address = address.trim();
    address = HelperFunctions.replaceAllWhitespace(address);
    password = HelperFunctions.removeAllWhitespace(password);

    const hash = HelperFunctions.hashPassword(password);

    const id = dummyUsers.length === 0 ? 1 : usersHelper.getLastUser().id + 1;

    usersHelper.addUser({
      id,
      email,
      firstName,
      lastName,
      address,
      isAdmin: false,
      password: hash,
    });

    // Retreive data from db
    const user = usersHelper.getUser(id);

    // Create a jwt token and send along with the data
    const options = { expiresIn: '1d' };
    const secret = process.env.JWT_SECRET || 'jwtSecret';

    const signingData = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      address: user.address,
      isAdmin: user.isAdmin,
    };

    const data = {
      token: HelperFunctions.signToken(signingData, secret, options),
      id: user.id,
      first_name: user.firstName,
      last_name: user.lastName,
      email: user.email,
      address: user.address,
      isAdmin: user.isAdmin,
    };
    ResponseHandler.success(res, 201, data);
  }

  /**
   * @method signIn
   * @description - Fetches user
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @returns {object} - JSON Response
   */
  static signIn(req, res) {
    const { email } = req.body;

    // Retreive data from db
    const user = usersHelper.getUserByEmail(email);

    // Create a jwt token and send along with the data
    const options = { expiresIn: '1d' };
    const secret = process.env.JWT_SECRET || 'jwtSecret';

    const signingData = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      address: user.address,
      isAdmin: user.isAdmin,
    };

    const data = {
      token: HelperFunctions.signToken(signingData, secret, options),
      id: user.id,
      first_name: user.firstName,
      last_name: user.lastName,
      email: user.email,
      address: user.address,
      isAdmin: user.isAdmin,
    };

    ResponseHandler.success(res, 200, data);
  }

  /**
   * @method setAdmin
   * @description Sets user as an admin
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @returns {object} - JSON Response
   */
  static setAdmin(req, res) {
    let userId = req.params.user_id;
    userId = parseInt(userId, 10);
    usersHelper.setAdmin(userId);
    // Retreive data from db
    const user = usersHelper.getUser(userId);
    // Create a jwt token and send along with the data
    const options = { expiresIn: '1d' };
    const secret = process.env.JWT_SECRET || 'jwtSecret';
    const signingData = {
      id: user.id,
      first_name: user.firstName,
      last_name: user.lastName,
      email: user.email,
      address: user.address,
      isAdmin: user.isAdmin,
    };
    const data = {
      token: HelperFunctions.signToken(signingData, secret, options),
      id: user.id,
      first_name: user.firstName,
      last_name: user.lastName,
      email: user.email,
      address: user.address,
      isAdmin: user.isAdmin,
    };

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
  static resetPassword(req, res) {
    let { email, newPassword } = req.body;

    email = email.trim();
    newPassword = newPassword.trim();
    const hash = HelperFunctions.hashPassword(newPassword);
    usersHelper.changePassword(email, hash);
    passwordHelper.removeRequest(email);

    ResponseHandler.success(res, 200, 'Password successfully changed');
  }
}

export default Auth;
