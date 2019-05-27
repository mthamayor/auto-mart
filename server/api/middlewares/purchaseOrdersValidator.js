/**
 * user validator controller
 * Handles every user Validator related tasks
 */

import validator from 'validator';
import dbCarsHelper from '../utils/dbCarsHelper';
import dbOrdersHelper from '../utils/dbOrdersHelper';
import dbHelper from '../utils/dbHelper';


const purchaseOrdersValidator = {
  createPurchaseOrder(req, res, next) {
    const { buyer, carId, priceOffered } = req.body;

    if (
      buyer === undefined
      || buyer.trim() === ''
      || !validator.isNumeric(buyer)
    ) {
      return res.status(400).send({
        status: 400,
        error: 'buyer id is undefined or invalid',
      });
    }
    if (
      carId === undefined
      || carId.trim() === ''
      || !validator.isNumeric(carId)
    ) {
      return res.status(400).send({
        status: 400,
        error: 'car id is undefined or invalid',
      });
    }

    if (
      priceOffered === undefined
      || priceOffered.trim() === ''
      || !validator.isNumeric(priceOffered)
    ) {
      return res.status(400).send({
        status: 400,
        error: 'price is undefined or invalid',
      });
    }

    const findCar = dbCarsHelper.getCar(parseInt(carId, 10));
    const findBuyer = dbHelper.getUser(parseInt(buyer, 10));

    if (findBuyer === -1) {
      return res.status(404).send({
        status: 404,
        error: 'buyer does not exist',
      });
    }

    if (findCar.owner === parseInt(buyer, 10)) {
      return res.status(409).send({
        status: 409,
        error: 'you cannot create purchase order for ad you created',
      });
    }
    if (findCar === -1) {
      return res.status(404).send({
        status: 404,
        error: 'car not found',
      });
    }

    if (findCar.status !== 'available') {
      return res.status(403).send({
        status: 403,
        error: 'car has already been sold',
      });
    }

    const purchaseOrder = dbOrdersHelper.getOrderByBuyer(parseInt(buyer, 10));
    if (purchaseOrder !== -1) {
      return res.status(409).send({
        status: 409,
        error: 'you already created a purchase order',
      });
    }
    return next();
  },
  updatePurchaseOrder(req, res, next) {
    const orderId = req.params.order_id;
    const { buyer, newPrice } = req.body;

    if (
      buyer === undefined
      || buyer.trim() === ''
      || !validator.isNumeric(buyer)
    ) {
      return res.status(400).send({
        status: 400,
        error: 'buyer id is undefined or invalid',
      });
    }
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

    if (findOrder.buyer !== parseInt(buyer, 10)) {
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
