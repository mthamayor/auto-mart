import jwt from 'jsonwebtoken';

const authorization = {
  /**
   * TOKEN FORMAT
   * Authorization: Bearer <access_token>
   */
  verifyToken(req, res, next) {
    const bearerHeader = req.headers.authorization;
    // Check if bearer is undefined
    if (typeof bearerHeader === 'undefined') {
      res.status(401).send({
        status: 401,
        error: 'authorization token not provided',
      });
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
        res.status(401).send({
          status: 401,
          error:
            'user not authenticated, invalid authorization token provided',
        });
        return;
      }
      // if authenticated with auth token,
      // append authToken to request

      req.authToken = authToken;
      next();
    });
  },
  isAdmin(req, res, next) {
    const authData = req.authToken.data;
    if (authData.isAdmin === false) {
      res.status(401).send({
        status: 401,
        error: 'you do not have permission to access this route',
      });
      return;
    }
    next();
  },
};

export default authorization;
