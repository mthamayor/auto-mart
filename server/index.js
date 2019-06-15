import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import appRootPath from 'app-root-path';
import debug from 'debug';
import route from './api/routes';
import config from './api/config';

dotenv.config();

const log = debug('automart');

const app = express();
// create a write stream (in append mode)
const accessLogStream = fs.createWriteStream(path.join(appRootPath.path, 'access.log'), { flags: 'a' });

app.use(morgan('combined', { stream: accessLogStream }));

app.use(cors());

app.use(route);

const environment = process.env.NODE_ENV;
const stage = config[environment];
const { port } = stage;

app.listen(port);
log(`Server started at ${port}`);

export default app;
