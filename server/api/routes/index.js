import express from 'express';
import bodyParser from 'body-parser';
import authRouter from './authRouter';
import carsRouter from './carsRouter';
import ordersRouter from './ordersRouter';

const route = express.Router();

route.use(bodyParser.json());
route.use(bodyParser.urlencoded({ extended: false }));

route.get('/api/v1', (req, res) => {
  res.status(200).send('Welcome to Andela bootcamp AutoMart project v1');
});

route.use('/api/v1/auth', authRouter);

route.use('/api/v1/car', carsRouter);

route.use('/api/v1/order', ordersRouter);

export default route;
