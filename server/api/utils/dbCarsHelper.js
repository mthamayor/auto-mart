import dummyCars from '../models/dummyCars';

const dbCarsHelper = {
  addCar(car) {
    dummyCars.push(car);
  },
  getCar(id) {
    for (let i = 0; i < dummyCars.length; i += 1) {
      if (dummyCars[i].id === id) {
        return dummyCars[i];
      }
    }
    return -1;
  },
  getUserCar(id) {
    for (let i = 0; i < dummyCars.length; i += 1) {
      if (dummyCars[i].id === id && dummyCars[i].status === 'available') {
        return dummyCars[i];
      }
    }
    return -1;
  },
  markAsSold(id) {
    for (let i = 0; i < dummyCars.length; i += 1) {
      if (dummyCars[i].id === id) {
        dummyCars[i].status = 'sold';
        return dummyCars[i];
      }
    }
    return -1;
  },
  clearDB() {
    while (dummyCars.length > 0) {
      dummyCars.pop();
    }
  },
  updateCarPrice(id, newPrice) {
    for (let i = 0; i < dummyCars.length; i += 1) {
      if (dummyCars[i].id === id) {
        dummyCars[i].price = newPrice;
        return dummyCars[i];
      }
    }
    return -1;
  },
};
export default dbCarsHelper;
