import jwt from 'jsonwebtoken';

const authorization = {
  /**
   * TOKEN FORMAT
   * Authorization: Bearer <access_token>
   */
  verifyToken(req, res, next) {
    const bearerHeader = req.headers.authorization;
    let token;
    // Check if bearer is undefined
    if (typeof bearerHeader !== 'undefined') {
      const bearer = bearerHeader.split(' ');
      const bearerToken = bearer[1];
      token = bearerToken;
    } else {
      res.status(401).send({
        status: 401,
        error: 'authorization token not provided',
      });
      return;
    }

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
};

export default authorization;
