import { dummyCars, carsHelper } from '../models';
import { ResponseHandler } from '../utils';

/**
 * @class Cars
 * @description - Performs every car related tasks
 * @exports Cars
 */
class Cars {
  /**
   * @method createAd
   * @description - Creates advert
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @returns {object} - JSON Response
   */
  static createAd(req, res) {
    const {
      state,
      price,
      manufacturer,
      model,
      bodyType,
      name,
      imageUrlList,
    } = req.body;

    const createdOn = Date.now();

    const status = 'available';

    const id = dummyCars.length === 0 ? 1 : carsHelper.getLastCar().id + 1;

    const authData = req.authToken.data;

    carsHelper.addCar({
      id,
      owner: authData.id,
      createdOn,
      manufacturer,
      status,
      state,
      price: parseFloat(price, 10),
      model,
      name,
      bodyType,
      imageUrlList,
    });

    const car = carsHelper.getCar(id);

    const data = {
      id: car.id,
      created_on: car.createdOn,
      name: car.name,
      owner: car.owner,
      manufacturer: car.manufacturer,
      model: car.model,
      price: car.price,
      state: car.state,
      status: car.status,
      body_type: car.bodyType,
      image_urls: car.imageUrlList,
    };

    ResponseHandler.success(res, 201, data);
  }

  /**
   * @method markAsSold
   * @description - Marks advert as sold
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @returns {object} - JSON Response
   */
  static markAsSold(req, res) {
    let id = req.params.car_id;
    id = parseInt(id, 10);

    carsHelper.markAsSold(id);

    const car = carsHelper.getCar(id);

    const data = {
      id: car.id,
      owner: car.owner,
      created_on: car.createdOn,
      manufacturer: car.manufacturer,
      model: car.model,
      price: car.price,
      state: car.state,
      status: car.status,
      image_urls: car.imageUrlList,
    };

    ResponseHandler.success(res, 201, data);
  }

  /**
   * @method updateCarPrice
   * @description - Updates the price of an advert
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @returns {object} - JSON Response
   */
  static updateCarPice(req, res) {
    let id = req.params.car_id;

    let { newPrice } = req.body;

    id = parseInt(id, 10);

    newPrice = parseFloat(newPrice);

    carsHelper.updateCarPrice(id, newPrice);

    const car = carsHelper.getCar(id);

    const data = {
      id: car.id,
      created_on: car.createdOn,
      name: car.name,
      owner: car.owner,
      manufacturer: car.manufacturer,
      model: car.model,
      price: car.price,
      state: car.state,
      status: car.status,
      body_type: car.bodyType,
      image_urls: car.imageUrlList,
    };

    ResponseHandler.success(res, 201, data);
  }

  /**
   * @method getAvailableCar
   * @description - Fetches a specific available car
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @returns {object} - JSON Response
   */
  static getAvailableCar(req, res) {
    let carId = req.params.car_id;

    carId = parseInt(carId, 10);

    const car = carsHelper.getAvailableCar(carId);

    const data = {
      id: car.id,
      created_on: car.createdOn,
      name: car.name,
      owner: car.owner,
      manufacturer: car.manufacturer,
      model: car.model,
      price: car.price,
      state: car.state,
      status: car.status,
      body_type: car.bodyType,
      image_urls: car.imageUrlList,
    };

    ResponseHandler.success(res, 200, data);
  }

  /**
   * @method deletePassword
   * @description - Deletes an advert
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @returns {object} - JSON Response
   */
  static deleteCar(req, res) {
    let carId = req.params.car_id;

    carId = parseInt(carId, 10);

    carsHelper.deleteCar(carId);

    ResponseHandler.success(res, 200, 'Car Ad successfully deleted');
  }

  static filterCars(req, res) {
    const { filterParams, filterPriceParams } = req;

    let filteredCars = carsHelper.filterCars(filterParams);

    if (filterPriceParams !== undefined) {
      filteredCars = carsHelper.filterPrice(filteredCars, filterPriceParams);
    }

    const data = [];

    filteredCars.forEach((car) => {
      const returnData = {
        id: car.id,
        owner: car.owner,
        created_on: car.createdOn,
        manufacturer: car.manufacturer,
        status: car.status,
        state: car.state,
        price: car.price,
        model: car.model,
        name: car.name,
        body_type: car.bodyType,
        image_urls: car.imageUrlList,
      };
      data.push(returnData);
    });

    ResponseHandler.success(res, 200, data);
  }
}

export default Cars;
