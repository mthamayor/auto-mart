import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import helpers from '../utils/helpers';
import { dummyUsers, usersHelper } from '../models';
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

    // Hash and encrypt password
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);

    const id = dummyUsers.length + 1;

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
    return res.status(201).send({
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

    return res.status(200).send({
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
    return res.status(200).send({
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
};

export default auth;
