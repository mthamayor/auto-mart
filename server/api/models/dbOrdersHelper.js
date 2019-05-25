import dummyOrders from './dummyOrders';

const dbOrdersHelper = {
  addPurchaseOrder(order) {
    dummyOrders.push(order);
  },
  getOrderByBuyer(buyer) {
    for (let i = 0; i < dummyOrders.length; i += 1) {
      if (dummyOrders[i].buyer === buyer) {
        return dummyOrders[i];
      }
    }
    return -1;
  },
};

export default dbOrdersHelper;
