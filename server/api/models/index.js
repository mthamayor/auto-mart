import {
  getCar,
  getCarsByOwner,
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


import { clearFlags } from './flagsModel';

import passwordReset, {
  getRequest, addRequest, removeRequest, getRequestWithToken,
} from './passwordReset';

const carsHelper = {
  getCar,
  getCarsByOwner,
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
  clearFlags,
};

const passwordHelper = {
  passwordReset, getRequest, getRequestWithToken, addRequest, removeRequest,
};

export {
  carsHelper, ordersHelper,
  usersHelper, flagsHelper, passwordHelper,
};
