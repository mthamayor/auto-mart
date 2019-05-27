import dummyOrders from '../models/dummyOrders';
import dbCarsHelper from '../utils/dbCarsHelper';
import dbOrdersHelper from '../utils/dbOrdersHelper';

const purchaseOrders = {
  createOrder(req, res) {
    let { buyer, carId, priceOffered } = req.body;

    carId = parseInt(carId, 10);
    buyer = parseInt(buyer, 10);
    priceOffered = parseFloat(priceOffered);

    const status = 'pending';
    const createdOn = Date.now();
    const id = dummyOrders.length + 1;

    dbOrdersHelper.addPurchaseOrder({
      id,
      carId,
      buyer,
      priceOffered,
      createdOn,
      status,
    });
    const car = dbCarsHelper.getCar(carId);

    res.status(201).send({
      status: 201,
      data: {
        id,
        car_id: parseInt(carId, 10),
        created_on: createdOn,
        status,
        price: car.price,
        price_offered: priceOffered,
      },
    });
  },
  // Update the price of purchase order
  updatePurchaseOrder(req, res) {
    let orderId = req.params.order_id;
    orderId = parseInt(orderId, 10);

    let { newPrice } = req.body;

    newPrice = parseFloat(newPrice);

    let order = dbOrdersHelper.getOrder(orderId);
    const oldPrice = order.priceOffered;

    order = dbOrdersHelper.editPurchaseOrder(orderId, newPrice);
    const data = {
      id: order.id,
      car_id: order.carId,
      status: order.status,
      old_price_offered: oldPrice,
      new_price_offered: order.priceOffered,
    };
    res.status(201).send({
      status: 201,
      data,
    });
  },
};

export default purchaseOrders;
