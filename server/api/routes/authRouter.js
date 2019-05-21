/**
 * Routes every auth API endpoint here
 */

import express from 'express';
import auth from '../controllers/auth';
import authValidator from '../middlewares/authValidator';

const authRouter = express.Router();

authRouter.post('/signup', authValidator.signUp, auth.signUp);

export default authRouter;
