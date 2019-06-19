import debug from 'debug';
import { ordersHelper, carsHelper } from '../models';
import { ResponseHandler } from '../utils';
import { query } from '../config/pool';

const log = debug('automart');

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
  static async createOrder(req, res) {
    let { carId, priceOffered } = req.body;
    const authData = req.authToken.data;
    carId = parseInt(carId, 10);
    priceOffered = parseFloat(priceOffered);

    const queryText = {
      name: 'insert-order',
      text:
        'INSERT INTO orders(buyer, car_id, price_offered) '
        + 'VALUES($1, $2, $3) '
        + 'RETURNING *',
      values: [authData.id, carId, priceOffered],
    };

    let queryResult;
    try {
      queryResult = await query(queryText);
      // eslint-disable-next-line prefer-destructuring
      queryResult = queryResult.rows[0];
    } catch (err) {
      log(err.stack);
      ResponseHandler.error(res, 500, 'internal server error');
      return;
    }

    const car = await carsHelper.getCar(carId);

    const data = {
      id: queryResult.id,
      buyer: queryResult.buyer,
      car_id: queryResult.car_id,
      status: queryResult.status,
      price: car.price,
      price_offered: queryResult.price_offered,
      created_on: queryResult.created_on,
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
  static async updatePurchaseOrder(req, res) {
    let orderId = req.params.order_id;

    orderId = parseInt(orderId, 10);

    let { newPrice } = req.body;

    newPrice = parseFloat(newPrice);

    let order = await ordersHelper.getOrder(orderId);

    const oldPrice = order.price_offered;

    order = await ordersHelper.editPurchaseOrder(orderId, newPrice);

    const data = {
      id: order.id,
      car_id: order.car_id,
      status: order.status,
      old_price_offered: oldPrice,
      new_price_offered: order.price_offered,
    };

    ResponseHandler.success(res, 201, data);
  }

  /**
   * @method acceptOrder
   * @description -  Accepts a purchase order
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @returns {object} - JSON Response
   */
  static async acceptOrder(req, res) {
    let orderId = req.params.order_id;
    orderId = parseInt(orderId, 10);

    const queryText = {
      name: 'accept-order',
      text: 'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
      values: ['accepted', orderId],
    };

    let queryResult;
    let car;
    try {
      queryResult = await query(queryText);
      // eslint-disable-next-line prefer-destructuring
      queryResult = queryResult.rows[0];
      car = await carsHelper.markAsSold(queryResult.car_id);
    } catch (err) {
      log(err.stack);
      ResponseHandler.error(res, 500, 'internal server error');
      return;
    }

    const data = {
      id: queryResult.id,
      buyer: queryResult.buyer,
      car_id: queryResult.car_id,
      status: queryResult.status,
      price: car.price,
      price_offered: queryResult.price_offered,
      created_on: queryResult.created_on,
    };

    ResponseHandler.success(res, 200, data);
  }

  /**
   * @method rejectOrder
   * @description -  Rejects a purchase order
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @returns {object} - JSON Response
   */
  static async rejectOrder(req, res) {
    let orderId = req.params.order_id;
    orderId = parseInt(orderId, 10);

    const queryText = {
      name: 'accept-order',
      text: 'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
      values: ['rejected', orderId],
    };

    let queryResult;
    try {
      queryResult = await query(queryText);
      // eslint-disable-next-line prefer-destructuring
      queryResult = queryResult.rows[0];
    } catch (err) {
      log(err.stack);
      ResponseHandler.error(res, 500, 'internal server error');
      return;
    }

    const car = await carsHelper.getCar(queryResult.car_id);

    const data = {
      id: queryResult.id,
      buyer: queryResult.buyer,
      car_id: queryResult.car_id,
      status: queryResult.status,
      price: car.price,
      price_offered: queryResult.price_offered,
      created_on: queryResult.created_on,
    };

    ResponseHandler.success(res, 200, data);
  }
}

export default PurchaseOrders;
