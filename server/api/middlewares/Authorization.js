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
}

export default Authorization;
