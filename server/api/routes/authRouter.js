/**
 * Routes every auth API endpoint here
 */

import express from 'express';
import { auth } from '../controllers';
import { authValidator } from '../middlewares';

const authRouter = express.Router();

authRouter.post('/signup', authValidator.signUp, auth.signUp);

authRouter.post('/signin', authValidator.signIn, auth.signIn);

// Make a user an admin
authRouter.post('/:user_id/admin', authValidator.setAdmin, auth.setAdmin);

// Forgot password route
authRouter.post('/forgot', authValidator.forgotPassword, auth.forgotPassword);

// Reset password route
authRouter.post('/reset', authValidator.resetPassword, auth.resetPassword);

export default authRouter;
