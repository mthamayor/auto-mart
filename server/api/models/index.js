import {
  getCar,
  getAvailableCar,
  markAsSold,
  updateCarPrice,
  clearCars,
  deleteCar,
  filterCars,
  filterPrice,
} from './carsModel';

import {
  editPurchaseOrder,
  getOrder,
  getOrderByBuyer,
  clearOrders,
} from './ordersModel';

import {
  getUser,
  getUserByEmail,
  removeAllUsers,
  setAdmin,
  changePassword,
} from './usersModel';

import dummyFlags, {
  addFlag, getAllFlags, getFlag, getLastFlag,
} from './flags';
import passwordReset, {
  getRequest, addRequest, removeRequest, getRequestWithToken,
} from './passwordReset';

const carsHelper = {
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
  getOrder,
  getOrderByBuyer,
  editPurchaseOrder,
  clearOrders,
};

const usersHelper = {
  getUser,
  removeAllUsers,
  getUserByEmail,
  setAdmin,
  changePassword,
};

const flagsHelper = {
  addFlag, getAllFlags, getFlag, getLastFlag,
};

const passwordHelper = {
  passwordReset, getRequest, getRequestWithToken, addRequest, removeRequest,
};

export {
  dummyFlags, carsHelper, ordersHelper,
  usersHelper, flagsHelper, passwordHelper,
};
