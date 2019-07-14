/**
 * user validator controller
 * Handles every user Validator related tasks
 */
import validator from 'validator';
import { ordersHelper, carsHelper } from '../models';
import { ResponseHandler } from '../utils';

/**
 * @class PurchaseOrdersValidator
 * @description Validates Purchase Orders route
 * @exports PurchaseOrdersValidator
 */
class PurchaseOrdersValidator {
  /**
   * @method createPurchaseOrder
   * @description - Validates create purchase orders parameters
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @param {function} next - Passes control to next middleware
   */
  static async createPurchaseOrder(req, res, next) {
    const carId = req.body.car_id;
    const { amount } = req.body;
    const authData = req.authToken.data;
    const buyer = authData.id;

    if (
      carId === undefined
      || String(carId).trim() === ''
      || !validator.isNumeric(String(carId))
    ) {
      ResponseHandler.error(res, 400, 'car id is undefined or invalid');
      return;
    }

    if (
      amount === undefined
      || String(amount).trim() === ''
      || !validator.isNumeric(String(amount))
    ) {
      ResponseHandler.error(res, 400, 'price is undefined or invalid');
      return;
    }

    const findCar = await carsHelper.getCar(parseInt(carId, 10));

    if (findCar === -1) {
      ResponseHandler.error(res, 404, 'car not found');
      return;
    }

    if (findCar.status !== 'available') {
      ResponseHandler.error(res, 403, 'car has already been sold');
      return;
    }

    const purchaseOrder = await ordersHelper.getOrderByBuyer(buyer, parseInt(carId, 10));
    if (purchaseOrder !== -1) {
      ResponseHandler.error(res, 409, 'you already created a purchase order');
      return;
    }
    next();
  }

  /**
   * @method updatePurchaseOrder
   * @description - Validates update purchase order parameters
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @param {function} next - Passes control to next middleware
   */
  static async updatePurchaseOrder(req, res, next) {
    const orderId = req.params.order_id;
    const authData = req.authToken.data;
    const buyer = authData.id;
    const { price } = req.body;

    if (
      orderId === undefined
      || String(orderId).trim() === ''
      || !validator.isNumeric(orderId)
    ) {
      ResponseHandler.error(res, 400, 'order id is undefined or invalid');
      return;
    }

    if (
      price === undefined
      || String(price).trim() === ''
      || !validator.isNumeric(String(price))
    ) {
      ResponseHandler.error(res, 400, 'new price is undefined or invalid');
      return;
    }

    const findOrder = await ordersHelper.getOrder(parseInt(orderId, 10));

    if (findOrder === -1) {
      ResponseHandler.error(res, 404, 'purchase order does not exist');
      return;
    }

    if (findOrder.buyer !== buyer) {
      ResponseHandler.error(res, 403, "you cannot edit another user's order");
      return;
    }

    const findCar = await carsHelper.getCar(findOrder.car_id);

    if (findCar === -1) {
      ResponseHandler.error(res, 404, 'the ad does not exist');
      return;
    }

    if (findCar.status !== 'available') {
      ResponseHandler.error(res, 403, 'the transaction is not pending');
      return;
    }

    next();
  }

  /**
   * @method createPurchaseOrder
   * @description - Validates create purchase orders parameters
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @param {function} next - Passes control to next middleware
   */
  static async orderResponse(req, res, next) {
    const orderId = req.params.order_id;
    const authData = req.authToken.data;
    const user = parseInt(authData.id, 10);

    if (
      orderId === undefined
      || String(orderId).trim() === ''
      || !validator.isNumeric(String(orderId))
    ) {
      ResponseHandler.error(res, 400, 'order id is undefined or invalid');
      return;
    }

    const findOrder = await ordersHelper.getOrder(parseInt(orderId, 10));

    if (findOrder === -1) {
      ResponseHandler.error(
        res,
        404,
        'order not found',
      );
      return;
    }

    const findCar = await carsHelper.getCar(findOrder.car_id);

    if (findCar.owner !== user) {
      ResponseHandler.error(
        res,
        403,
        'only the owner of the ad can accept or reject purchase orders',
      );
      return;
    }

    if (findCar.status !== 'available') {
      ResponseHandler.error(res, 403, 'car has already been sold');
      return;
    }

    next();
  }
}

export default PurchaseOrdersValidator;
