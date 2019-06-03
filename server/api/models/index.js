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
  changePassword,
} from './dummyUsers';

import dummyFlags, { addFlag, getAllFlags, getFlag } from './flags';
import passwordReset, {
  getRequest, addRequest, removeRequest, getRequestWithToken,
} from './passwordReset';

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
  changePassword,
};

const flagsHelper = {
  addFlag, getAllFlags, getFlag,
};

const passwordHelper = {
  passwordReset, getRequest, getRequestWithToken, addRequest, removeRequest,
};

export {
  dummyCars, dummyUsers, dummyOrders,
  dummyFlags, carsHelper, ordersHelper,
  usersHelper, flagsHelper, passwordHelper,
};
