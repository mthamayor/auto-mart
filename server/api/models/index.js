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
  getLastCar,
} from './dummyCars';

import dummyOrders, {
  editPurchaseOrder,
  addPurchaseOrder,
  getOrder,
  getOrderByBuyer,
  clearOrders,
  getLastOrder,
} from './dummyOrders';

import dummyUsers, {
  getUser,
  getUserByEmail,
  addUser,
  removeAllUsers,
  setAdmin,
  changePassword,
  getLastUser,
} from './dummyUsers';

import dummyFlags, {
  addFlag, getAllFlags, getFlag, getLastFlag,
} from './flags';
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
  getLastCar,
};

const ordersHelper = {
  addPurchaseOrder,
  getOrder,
  getOrderByBuyer,
  editPurchaseOrder,
  clearOrders,
  getLastOrder,
};

const usersHelper = {
  getUser,
  removeAllUsers,
  addUser,
  getUserByEmail,
  setAdmin,
  changePassword,
  getLastUser,
};

const flagsHelper = {
  addFlag, getAllFlags, getFlag, getLastFlag,
};

const passwordHelper = {
  passwordReset, getRequest, getRequestWithToken, addRequest, removeRequest,
};

export {
  dummyCars, dummyUsers, dummyOrders,
  dummyFlags, carsHelper, ordersHelper,
  usersHelper, flagsHelper, passwordHelper,
};
