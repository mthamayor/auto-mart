/**
 * Routes every auth API endpoint here
 */

import express from 'express';
import { Auth } from '../controllers';
import { AuthValidator } from '../middlewares';

const authRouter = express.Router();

authRouter.post('/signup', AuthValidator.signUp, Auth.signUp);

authRouter.post('/signin', AuthValidator.signIn, Auth.signIn);

// Make a user an admin
authRouter.post('/:user_id/admin', AuthValidator.setAdmin, Auth.setAdmin);

// Forgot password route
authRouter.post('/forgot', AuthValidator.forgotPassword, Auth.forgotPassword);

// Reset password route
authRouter.post('/reset', AuthValidator.resetPassword, Auth.resetPassword);

export default authRouter;
