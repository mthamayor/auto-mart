/**
 * Routes every order API endpoint here
 */

import express from 'express';

import { Authorization, PurchaseOrdersValidator } from '../middlewares';
import { PurchaseOrders } from '../controllers';

const ordersRouter = express.Router();

// Protected route
ordersRouter.post(
  '/',
  Authorization.verifyToken,
  PurchaseOrdersValidator.createPurchaseOrder,
  PurchaseOrders.createOrder,
);

// Protected route
ordersRouter.patch('/:order_id/price',
  Authorization.verifyToken,
  PurchaseOrdersValidator.updatePurchaseOrder,
  PurchaseOrders.updatePurchaseOrder);

export default ordersRouter;
