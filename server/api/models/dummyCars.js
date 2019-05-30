/**
 *  Dummy db for cars
 * @param {number} id id of the car
 * @param {(number|Date)}createdOn the date the car advert was created
 * @param {string} status sold or available
 * @param {string} state new or used
 * @param {number} price the car price
 * @param {string} model the car model
 * @param {string} name the car name
 * @param {string} bodyType the car body type
 * @param {string} owner the owner of the advert
 * @param {string} email email of the owner
 * @param {(string|Array)} imageUrlList the advert images
 *
 */
const dummyCars = [];
export default dummyCars;

export const addCar = (car) => {
  dummyCars.push(car);
};
export const getCar = id => dummyCars.find(car => car.id === id) || -1;

export const getAvailableCar = id => dummyCars.find(car => (car.status === 'available' && car.id === id)) || -1;

export const getAvailableCars = () => dummyCars.filter(car => car.status === 'available');

export const markAsSold = (id) => {
  const car = getCar(id);
  if (car !== -1) {
    car.status = 'sold';
  }
  return car;
};

export const clearCars = () => {
  dummyCars.splice(0, dummyCars.length);
};

export const updateCarPrice = (id, newPrice) => {
  const car = getCar(id);
  if (car !== -1) {
    car.price = newPrice;
  }
  return car;
};

export const deleteCar = (id) => {
  for (let i = 0; i < dummyCars.length; i += 1) {
    if (dummyCars[i].id === id) {
      dummyCars.splice(i, 1);
    }
  }
};

export const filterCars = (filterReceived) => {
  let filterParams = filterReceived;
  let cars = dummyCars.map(car => car);

  // Return cars if no filter is received
  if (filterReceived.length === 0) {
    return cars;
  }

  const carStatus = filterParams.filter(filter => (filter.name === 'status' && filter.value === 'available'));

  if (carStatus.length > 0) {
    cars = getAvailableCars();
  }
  filterParams = filterParams.filter(filter => filter.name !== 'status');

  if (filterParams.length === 0) {
    return cars;
  }

  const filteredCars = cars.filter((car) => {
    let found = false;
    for (let i = 0; i < filterParams.length; i += 1) {
      const { name } = filterParams[i];
      const { value } = filterParams[i];
      const carName = car[name];
      if (carName.toUpperCase() === value.toUpperCase()) {
        found = true;
        break;
      }
    }
    return found;
  });
  return filteredCars;
};

export const filterPrice = (carList, filterPriceParam) => {
  const { minPrice, maxPrice } = filterPriceParam;
  const filteredCars = carList.filter(car => (car.price >= minPrice && car.price <= maxPrice));
  return filteredCars;
};
