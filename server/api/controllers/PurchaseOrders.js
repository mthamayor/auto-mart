import { dummyOrders, ordersHelper, carsHelper } from '../models';
import { ResponseHandler } from '../utils';

/**
 * @class PurchaseOrders
 * @description - Performs every purchase order related tasks
 * @exports Flags
 */
class PurchaseOrders {
  /**
   * @method createOrder
   * @description -  Creates purchase order
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @returns {object} - JSON Response
   */
  static createOrder(req, res) {
    let { carId, priceOffered } = req.body;
    const authData = req.authToken.data;
    carId = parseInt(carId, 10);
    priceOffered = parseFloat(priceOffered);
    const status = 'pending';
    const createdOn = Date.now();

    const id = dummyOrders.length === 0 ? 1 : ordersHelper.getLastOrder().id + 1;

    ordersHelper.addPurchaseOrder({
      id,
      buyer: authData.id,
      carId,
      priceOffered,
      createdOn,
      status,
    });

    const car = carsHelper.getCar(carId);

    const data = {
      id,
      buyer: authData.id,
      car_id: parseInt(carId, 10),
      created_on: createdOn,
      status,
      price: car.price,
      price_offered: priceOffered,
    };

    ResponseHandler.success(res, 201, data);
  }

  /**
   * @method updatePurchaseOrder
   * @description - Updates price of purchase order
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @returns {object} - JSON Response
   */
  static updatePurchaseOrder(req, res) {
    let orderId = req.params.order_id;

    orderId = parseInt(orderId, 10);

    let { newPrice } = req.body;

    newPrice = parseFloat(newPrice);

    let order = ordersHelper.getOrder(orderId);

    const oldPrice = order.priceOffered;

    order = ordersHelper.editPurchaseOrder(orderId, newPrice);

    const data = {
      id: order.id,
      car_id: order.carId,
      status: order.status,
      old_price_offered: oldPrice,
      new_price_offered: order.priceOffered,
    };

    ResponseHandler.success(res, 201, data);
  }
}

export default PurchaseOrders;