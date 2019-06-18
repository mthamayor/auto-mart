import express from 'express';
import bodyParser from 'body-parser';
import authRouter from './authRouter';
import carsRouter from './carsRouter';
import ordersRouter from './ordersRouter';
import flagsRouter from './flagsRouter';
import docsRouter from './docsRouter';
import usersRouter from './usersRouter';


const route = express.Router();

route.use(bodyParser.json());
route.use(bodyParser.urlencoded({ extended: false }));

route.get('/', (req, res) => {
  res.status(200).json('Welcome to Andela bootcamp AutoMart project');
});
route.get('/api/v1', (req, res) => {
  res.status(200).json('Welcome to Andela bootcamp AutoMart project v1');
});

route.use('/api/v1/auth', authRouter);

route.use('/api/v1/users', usersRouter);

route.use('/api/v1/car', carsRouter);

route.use('/api/v1/order', ordersRouter);

route.use('/api/v1/flag', flagsRouter);

route.use('/api/v1/docs', docsRouter);

export default route;
