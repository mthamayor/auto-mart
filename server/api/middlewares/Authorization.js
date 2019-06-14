import jwt from 'jsonwebtoken';
import { ResponseHandler } from '../utils';

/**
 * @class Authorization
 * @description Checks authorization for protected pages
 * @exports Authorization
 */
class Authorization {
  /**
   * @method verifyToken
   * @description - Verifies user's token
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @param {function} next - Passes control to next middleware
   */
  static verifyToken(req, res, next) {
    /**
     * TOKEN FORMAT
     * Authorization: Bearer <access_token>
     */
    const bearerHeader = req.headers.authorization;
    // Check if bearer is undefined
    if (typeof bearerHeader === 'undefined') {
      ResponseHandler.error(res, 401, 'authorization token not provided');
      return;
    }
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    const token = bearerToken;

    // Check if the token is valid
    // invalid token - asynchronous

    const secret = process.env.JWT_SECRET || 'jwtSecret';

    jwt.verify(token, secret, (err, authToken) => {
      if (err) {
        ResponseHandler.error(
          res,
          401,
          'user not authenticated, invalid authorization token provided',
        );
        return;
      }

      // if authenticated with auth token,
      // append authToken to request

      req.authToken = authToken;

      next();
    });
  }

  /**
   * @method isAdmin
   * @description - Checks if user is an admin
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @param {function} next - Passes control to next middleware
   */
  static isAdmin(req, res, next) {
    const authData = req.authToken.data;
    if (authData.isAdmin === false) {
      ResponseHandler.error(
        res,
        401,
        'you do not have permission to access this route',
      );
      return;
    }
    next();
  }

  /**
   * @method adminSearch
   * @description - Checks if its admin protected route
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @param {function} next - Passes control to next middleware
   */
  static adminSearch(req, res, next) {
    const { status } = req.query;
    const querySize = Object.keys(req.query).length;

    if ((status !== undefined && status === 'sold') || querySize <= 0) {
      const bearerHeader = req.headers.authorization;
      if (bearerHeader === undefined) {
        ResponseHandler.error(
          res,
          401,
          'you do not have permission to access this route',
        );
        return;
      }
      const token = bearerHeader.split(' ')[1];
      const secret = process.env.JWT_SECRET || 'jwtSecret';
      let decoded;

      try {
        decoded = jwt.verify(token, secret);
      } catch (err) {
        ResponseHandler.error(
          res,
          401,
          'invalid token provided. please provide a valid token',
        );
        return;
      }

      if (!decoded.data.isAdmin) {
        ResponseHandler.error(
          res,
          403,
          'Forbidden: only admins can access this route',
        );
        return;
      }
    }
    next();
  }
}

export default Authorization;
