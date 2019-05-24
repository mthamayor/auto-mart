import dummyCars from '../models/dummyCars';
import dbCarsHelper from '../models/dbCarsHelper';

const cars = {
  createAd(req, res) {
    const {
      owner,
      state,
      email,
      price,
      manufacturer,
      model,
      bodyType,
      name,
      imageUrlList,
    } = req.body;

    const createdOn = Date.now();
    const status = 'pending';
    const id = dummyCars.length + 1;

    dbCarsHelper.addCar({
      id,
      createdOn,
      manufacturer,
      status,
      state,
      price,
      model,
      name,
      bodyType,
      owner,
      email,
      imageUrlList,
      purchaseOrders: [],
    });

    const car = dbCarsHelper.getCar(id);

    res.status(201).send({
      status: 201,
      data: {
        id: car.id,
        email: car.email,
        created_on: car.createdOn,
        manufacturer: car.manufacturer,
        model: car.model,
        price: car.price,
        state: car.state,
        status: car.status,
        image_urls: car.imageUrlList,
        purchase_orders: car.purchaseOrders,
      },
    });
  },
};

export default cars;
