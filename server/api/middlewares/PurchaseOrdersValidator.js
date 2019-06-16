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
    const { carId, priceOffered } = req.body;
    const authData = req.authToken.data;
    const buyer = authData.id;

    if (
      carId === undefined
      || carId.trim() === ''
      || !validator.isNumeric(carId)
    ) {
      ResponseHandler.error(res, 400, 'car id is undefined or invalid');
      return;
    }

    if (
      priceOffered === undefined
      || priceOffered.trim() === ''
      || !validator.isNumeric(priceOffered)
    ) {
      ResponseHandler.error(res, 400, 'price is undefined or invalid');
      return;
    }

    const findCar = await carsHelper.getCar(parseInt(carId, 10));

    if (findCar.owner === buyer) {
      ResponseHandler.error(
        res,
        409,
        'you cannot create purchase order for ad you created',
      );
      return;
    }
    if (findCar === -1) {
      ResponseHandler.error(res, 404, 'car not found');
      return;
    }

    if (findCar.status !== 'available') {
      ResponseHandler.error(res, 403, 'car has already been sold');
      return;
    }

    const purchaseOrder = ordersHelper.getOrderByBuyer(buyer);
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
  static updatePurchaseOrder(req, res, next) {
    const orderId = req.params.order_id;
    const authData = req.authToken.data;
    const buyer = authData.id;
    const { newPrice } = req.body;

    if (
      orderId === undefined
      || orderId.trim() === ''
      || !validator.isNumeric(orderId)
    ) {
      ResponseHandler.error(res, 400, 'order id is undefined or invalid');
      return;
    }

    if (
      newPrice === undefined
      || newPrice.trim() === ''
      || !validator.isNumeric(newPrice)
    ) {
      ResponseHandler.error(res, 400, 'new price is undefined or invalid');
      return;
    }

    const findOrder = ordersHelper.getOrder(parseInt(orderId, 10));

    if (findOrder === -1) {
      ResponseHandler.error(res, 404, 'purchase order does not exist');
      return;
    }

    if (findOrder.buyer !== buyer) {
      ResponseHandler.error(res, 403, "you cannot edit another user's order");
      return;
    }

    if (findOrder.status !== 'pending') {
      ResponseHandler.error(res, 403, 'the transaction is not pending');
      return;
    }

    next();
  }
}

export default PurchaseOrdersValidator;
