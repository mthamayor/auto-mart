import dummyCars from './dummyCars';

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
};
export default dbCarsHelper;
