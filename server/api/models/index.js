import dummyCars, {
  addCar,
  getCar,
  getAvailableCar,
  markAsSold,
  updateCarPrice,
  clearCars,
  deleteCar,
} from './dummyCars';

import dummyOrders, {
  editPurchaseOrder,
  addPurchaseOrder,
  getOrder,
  getOrderByBuyer,
  clearOrders,
} from './dummyOrders';
import dummyUsers, {
  getUser,
  getUserByEmail,
  addUser,
  removeAllUsers,
  setAdmin,
} from './dummyUsers';

const carsHelper = {
  addCar,
  getCar,
  getAvailableCar,
  markAsSold,
  clearCars,
  updateCarPrice,
  deleteCar,
};
const ordersHelper = {
  addPurchaseOrder,
  getOrder,
  getOrderByBuyer,
  editPurchaseOrder,
  clearOrders,
};
const usersHelper = {
  getUser,
  removeAllUsers,
  addUser,
  getUserByEmail,
  setAdmin,
};

export {
  dummyCars, dummyUsers, dummyOrders, carsHelper, ordersHelper, usersHelper,
};
