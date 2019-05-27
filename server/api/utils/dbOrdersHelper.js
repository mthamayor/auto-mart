import dummyOrders from '../models/dummyOrders';

const dbOrdersHelper = {
  addPurchaseOrder(order) {
    dummyOrders.push(order);
  },
  getOrder(id) {
    for (let i = 0; i < dummyOrders.length; i += 1) {
      if (dummyOrders[i].id === id) {
        return dummyOrders[i];
      }
    }
    return -1;
  },
  getOrderByBuyer(buyer) {
    for (let i = 0; i < dummyOrders.length; i += 1) {
      if (dummyOrders[i].buyer === buyer) {
        return dummyOrders[i];
      }
    }
    return -1;
  },
  editPurchaseOrder(id, newPrice) {
    for (let i = 0; i < dummyOrders.length; i += 1) {
      if (dummyOrders[i].id === id) {
        dummyOrders[i].priceOffered = newPrice;
        return dummyOrders[i];
      }
    }
    return -1;
  },
  clearDB() {
    while (dummyOrders.length > 0) {
      dummyOrders.pop();
    }
  },
};

export default dbOrdersHelper;
