/**
 * Routes every order API endpoint here
 */

import express from 'express';

import authorization from '../middlewares/authorization';
import purchaseOrdersValidator from '../middlewares/purchaseOrdersValidator';
import purchaseOrders from '../controllers/purchaseOrders';

const ordersRouter = express.Router();

// Protected route
ordersRouter.post(
  '/',
  authorization.verifyToken,
  purchaseOrdersValidator.createPurchaseOrder,
  purchaseOrders.createOrder,
);

export default ordersRouter;
