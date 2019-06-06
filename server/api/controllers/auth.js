import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { dummyUsers, usersHelper, passwordHelper } from '../models';
import { hashPassword, helpers } from '../utils';
import customMailer from '../config/mailer';
/**
 * Auth controller
 * Handles every user and auth related tasks
 */
const auth = {
  /**
   * User sign up
   */
  signUp(req, res) {
    let {
      email, firstName, lastName, address, password,
    } = req.body;

    email = email.trim();
    firstName = firstName.trim();
    lastName = lastName.trim();
    address = address.trim();
    address = helpers.replaceAllWhitespace(address);
    password = password.trim();

    const hash = hashPassword(password);
    let id;
    if (dummyUsers.length === 0) {
      id = 1;
    } else {
      id = usersHelper.getLastUser().id + 1;
    }

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
    const data = usersHelper.getUser(id);

    // Create a jwt token and send along with the data
    const options = { expiresIn: '1d' };
    const secret = process.env.JWT_SECRET || 'jwtSecret';

    const token = jwt.sign(
      {
        data: {
          id: data.id,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          address: data.address,
          isAdmin: data.isAdmin,
        },
      },
      secret,
      options,
    );
    res.status(201).json({
      status: 201,
      data: {
        token,
        id: data.id,
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        address: data.address,
        isAdmin: data.isAdmin,
      },
    });
  },

  /**
   * User sign in
   */
  signIn(req, res) {
    const {
      email,
    } = req.body;

    // Retreive data from db
    const data = usersHelper.getUserByEmail(email);

    // Create a jwt token and send along with the data
    const options = { expiresIn: '1d' };
    const secret = process.env.JWT_SECRET || 'jwtSecret';

    const token = jwt.sign(
      {
        data: {
          id: data.id,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          address: data.address,
          isAdmin: data.isAdmin,
        },
      },
      secret,
      options,
    );

    res.status(200).json({
      status: 200,
      data: {
        token,
        id: data.id,
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        address: data.address,
        isAdmin: data.isAdmin,
      },
    });
  },
  setAdmin(req, res) {
    let userId = req.params.user_id;
    userId = parseInt(userId, 10);
    usersHelper.setAdmin(userId);
    // Retreive data from db
    const data = usersHelper.getUser(userId);
    // Create a jwt token and send along with the data
    const options = { expiresIn: '1d' };
    const secret = process.env.JWT_SECRET || 'jwtSecret';
    const token = jwt.sign(
      {
        data: {
          id: data.id,
          first_name: data.firstName,
          last_name: data.lastName,
          email: data.email,
          address: data.address,
          isAdmin: data.isAdmin,
        },
      },
      secret,
      options,
    );
    return res.status(200).json({
      status: 200,
      data: {
        token,
        id: data.id,
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        address: data.address,
        isAdmin: data.isAdmin,
      },
    });
  },
  forgotPassword(req, res) {
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
      text: 'You are receiving this because you requested to reset your password\n\n'
            + 'please click on the following link to complete the process\n\n'
            + `https://mthamayor.github.io/auto-mart/reset-password?token=${token}`,
    };

    if (process.env.NODE_ENV !== 'production') {
      res.status(200).json({
        status: 200,
        data: { token },
      });
      return;
    }

    customMailer.sendMail(mailOptions, (err) => {
      if (err) {
        res.status(500).json({
          status: 500,
          data: 'Password reset Failed',
        });
        return;
      }
      res.status(200).json({
        status: 200,
        data: 'Password reset successful',
      });
    });
  },
  resetPassword(req, res) {
    let {
      email, newPassword,
    } = req.body;

    email = email.trim();
    newPassword = newPassword.trim();
    const hash = hashPassword(newPassword);
    usersHelper.changePassword(email, hash);
    passwordHelper.removeRequest(email);

    res.status(200).json({
      status: 200,
      data: 'Password successfully changed',
    });
  },
};

export default auth;
