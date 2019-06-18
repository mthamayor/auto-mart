/**
 * Routes every auth API endpoint here
 */

import express from 'express';
import { Auth } from '../controllers';
import { AuthValidator } from '../middlewares';

const usersRouter = express.Router();

// Reset password route
usersRouter.post('/:email/reset_password', AuthValidator.reset, Auth.reset);

export default usersRouter;
