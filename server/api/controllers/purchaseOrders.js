import dummyOrders from '../models/dummyOrders';
import dbCarsHelper from '../models/dbCarsHelper';
import dbOrdersHelper from '../models/dbOrdersHelper';

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
};

export default purchaseOrders;
