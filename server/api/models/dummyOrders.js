/**
 *  Dummy db for purchase orders
 * @param {(number|Integer)} id id of the car
 * @param {(number|Integer)} buyer the date the car advert was created
 * @param {number|Integer} carId sold or available
 * @param {(number|Float)} amount sold or available
 * @param {String} status pending accept or rejected
 * @param {DateTime} createdOn pending accept or rejected
 */
const dummyOrders = [];

export default dummyOrders;

export const addPurchaseOrder = (order) => {
  dummyOrders.push(order);
};

export const getOrder = id => dummyOrders.find(order => order.id === id) || -1;

export const getOrderByBuyer = buyer => dummyOrders.find(order => order.buyer === buyer) || -1;

export const editPurchaseOrder = (id, newPrice) => {
  const order = getOrder(id);
  if (order !== -1) {
    order.price = newPrice;
  }
  return order;
};

export const clearOrders = () => {
  dummyOrders.splice(0, dummyOrders.length);
};
