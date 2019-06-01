import dummyCars, {
  addCar,
  getCar,
  getAvailableCar,
  markAsSold,
  updateCarPrice,
  clearCars,
  deleteCar,
  filterCars,
  filterPrice,
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

import dummyFlags, { addFlag, getAllFlags, getFlag } from './flags';

const carsHelper = {
  addCar,
  getCar,
  getAvailableCar,
  markAsSold,
  clearCars,
  updateCarPrice,
  deleteCar,
  filterCars,
  filterPrice,
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

const flagsHelper = {
  addFlag, getAllFlags, getFlag,
};

export {
  dummyCars, dummyUsers, dummyOrders,
  dummyFlags, carsHelper, ordersHelper,
  usersHelper, flagsHelper,
};
