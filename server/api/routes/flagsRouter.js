/**
 * Routes every car API endpoint here
 */
import express from 'express';
import { Flags } from '../controllers';
import { Authorization, FlagsValidator } from '../middlewares';

const flagsRouter = express.Router();

// Protected route
flagsRouter.post(
  '/',
  Authorization.verifyToken,
  FlagsValidator.createFlag,
  Flags.createFlag,
);


export default flagsRouter;
