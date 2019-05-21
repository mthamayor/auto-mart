import express from 'express';
import dotenv from 'dotenv';
import route from './api/routes';
import config from './api/config';

dotenv.config();

const app = express();

app.use(route);

const environment = process.env.NODE_ENV;
const stage = config[environment];
const { port } = stage;

app.listen(port);
console.log(`Server started at ${port}`);

export default app;
