/**
 * Routes every docs API endpoint here
 */
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../../../openapi.json';


const docsRouter = express.Router();

docsRouter.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export default docsRouter;
