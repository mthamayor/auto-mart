import dummyCars, {
  addCar,
  getCar,
  getAvailableCar,
  markAsSold,
  updateCarPrice,
  clearCars,
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
} from './dummyUsers';

export const carsHelper = {
  addCar,
  getCar,
  getAvailableCar,
  markAsSold,
  clearCars,
  updateCarPrice,
};
export const ordersHelper = {
  addPurchaseOrder,
  getOrder,
  getOrderByBuyer,
  editPurchaseOrder,
  clearOrders,
};
export const usersHelper = {
  getUser,
  removeAllUsers,
  addUser,
  getUserByEmail,
};

export { dummyCars, dummyUsers, dummyOrders };
