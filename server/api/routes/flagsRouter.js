/**
 * Routes every car API endpoint here
 */
import express from 'express';
import { flags } from '../controllers';
import { authorization, flagsValidator } from '../middlewares';

const flagsRouter = express.Router();

// Protected route
flagsRouter.post(
  '/',
  authorization.verifyToken,
  flagsValidator.createFlag,
  flags.createFlag,
);


export default flagsRouter;
