/**
 * user validator controller
 * Handles every user Validator related tasks
 */

import validator from 'validator';
import dbCarsHelper from '../utils/dbCarsHelper';
import dbOrdersHelper from '../utils/dbOrdersHelper';

const purchaseOrdersValidator = {
  createPurchaseOrder(req, res, next) {
    const { carId, priceOffered } = req.body;
    const authData = req.authToken.data;
    const buyer = authData.id;

    if (
      carId === undefined
      || carId.trim() === ''
      || !validator.isNumeric(carId)
    ) {
      res.status(400).send({
        status: 400,
        error: 'car id is undefined or invalid',
      });
      return;
    }

    if (
      priceOffered === undefined
      || priceOffered.trim() === ''
      || !validator.isNumeric(priceOffered)
    ) {
      res.status(400).send({
        status: 400,
        error: 'price is undefined or invalid',
      });
      return;
    }

    const findCar = dbCarsHelper.getCar(parseInt(carId, 10));

    if (findCar.owner === buyer) {
      res.status(409).send({
        status: 409,
        error: 'you cannot create purchase order for ad you created',
      });
      return;
    }
    if (findCar === -1) {
      res.status(404).send({
        status: 404,
        error: 'car not found',
      });
      return;
    }

    if (findCar.status !== 'available') {
      res.status(403).send({
        status: 403,
        error: 'car has already been sold',
      });
      return;
    }

    const purchaseOrder = dbOrdersHelper.getOrderByBuyer(buyer);
    if (purchaseOrder !== -1) {
      res.status(409).send({
        status: 409,
        error: 'you already created a purchase order',
      });
      return;
    }
    next();
  },
  updatePurchaseOrder(req, res, next) {
    const orderId = req.params.order_id;
    const authData = req.authToken.data;
    const buyer = authData.id;
    const { newPrice } = req.body;

    if (
      orderId === undefined
      || orderId.trim() === ''
      || !validator.isNumeric(orderId)
    ) {
      return res.status(400).send({
        status: 400,
        error: 'order id is undefined or invalid',
      });
    }

    if (
      newPrice === undefined
      || newPrice.trim() === ''
      || !validator.isNumeric(newPrice)
    ) {
      return res.status(400).send({
        status: 400,
        error: 'new price is undefined or invalid',
      });
    }

    const findOrder = dbOrdersHelper.getOrder(
      parseInt(orderId, 10),
    );
    if (findOrder === -1) {
      return res.status(404).send({
        status: 404,
        error: 'purchase order does not exist',
      });
    }

    if (findOrder.buyer !== buyer) {
      return res.status(403).send({
        status: 403,
        error: 'you cannot edit another user\'s order',
      });
    }

    if (findOrder.status !== 'pending') {
      return res.status(403).send({
        status: 403,
        error: 'the transaction is not pending',
      });
    }

    return next();
  },
};

export default purchaseOrdersValidator;
