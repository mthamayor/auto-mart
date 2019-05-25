import jwt from 'jsonwebtoken';

const authorization = {
  /**
   * TOKEN FORMAT
   * Authorization: Bearer <access_token>
   */
  verifyToken(req, res, next) {
    const bearerHeader = req.headers.authorization;

    // Check if bearer is undefined
    if (typeof bearerHeader !== 'undefined') {
      const bearer = bearerHeader.split(' ');
      const bearerToken = bearer[1];
      req.token = bearerToken;
    } else {
      return res.status(401).send({
        status: 401,
        error: 'authorization token not provided',
      });
    }

    // Check if the token is valid
    // invalid token - synchronous
    if (process.env.NODE_ENV === 'production') {
      try {
        jwt.verify(req.token, process.env.JWT_SECRET || 'jwtSecret');
      } catch (err) {
        // err
        return res.status(401).send({
          status: 401,
          error: 'invalid access token provided, please sign in',
        });
      }
    }
    return next();
  },
};

export default authorization;
