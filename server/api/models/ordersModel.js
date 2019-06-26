import { query } from '../config/pool';

export const getOrder = async (id) => {
  const queryText = {
    name: 'get-order',
    text: 'SELECT * FROM orders WHERE id = $1',
    values: [id],
  };
  const queryResult = await query(queryText);

  return queryResult.rows[0] || -1;
};


export const getOrderByBuyer = async (buyer, carId) => {
  const queryText = {
    name: 'get-order-buyer',
    text: 'SELECT * FROM orders WHERE buyer = $1 AND car_id = $2',
    values: [buyer, carId],
  };
  const queryResult = await query(queryText);

  return queryResult.rows[0] || -1;
};

export const getOrdersByBuyer = async (userId) => {
  const queryText = {
    name: 'get-orders-buyer',
    text: 'SELECT * FROM orders WHERE buyer = $1',
    values: [userId],
  };
  const queryResult = await query(queryText);

  return queryResult.rows;
};

export const getOrdersByCar = async (carId) => {
  const queryText = {
    name: 'get-orders-car',
    text: 'SELECT * FROM orders WHERE car_id = $1',
    values: [carId],
  };
  const queryResult = await query(queryText);

  return queryResult.rows;
};

export const editPurchaseOrder = async (id, newPrice) => {
  const queryText = {
    name: 'edit-purchase-order',
    text: 'UPDATE orders SET price_offered = $1, status = $2 WHERE id = $3 RETURNING *',
    values: [newPrice, 'pending', id],
  };
  const queryResult = await query(queryText);

  return queryResult.rows[0];
};

export const clearOrders = async () => {
  const queryText = 'DELETE FROM orders';
  const queryResult = await query(queryText);
  return queryResult;
};
