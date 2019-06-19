import { query } from '../config/pool';

export const getCar = async (id) => {
  const queryText = {
    name: 'fetch-car',
    text: 'SELECT * FROM cars WHERE id = $1',
    values: [id],
  };
  const queryResult = await query(queryText);

  return queryResult.rows[0] || -1;
};

export const getAllCars = async () => {
  const queryText = {
    name: 'fetch-all-cars',
    text: 'SELECT * FROM cars',
    values: [],
  };
  const queryResult = await query(queryText);
  return queryResult.rows;
};

export const getAvailableCars = async () => {
  const queryText = {
    name: 'fetch-available-cars',
    text: 'SELECT * FROM cars WHERE status = $1',
    values: ['available'],
  };
  const queryResult = await query(queryText);
  return queryResult.rows || -1;
};

export const markAsSold = async (id) => {
  const queryText = {
    name: 'mark-as-sold',
    text: 'UPDATE cars SET status = $1 WHERE id = $2 RETURNING *',
    values: ['sold', id],
  };
  const queryResult = await query(queryText);

  return queryResult.rows[0];
};

export const clearCars = async () => {
  const queryText = 'DELETE FROM cars';
  const queryResult = await query(queryText);
  return queryResult;
};

export const updateCarPrice = async (id, newPrice) => {
  const queryText = {
    name: 'update-car-price',
    text: 'UPDATE cars SET price = $1 WHERE id = $2 RETURNING *',
    values: [newPrice, id],
  };
  const queryResult = await query(queryText);

  return queryResult.rows[0];
};

export const deleteCar = async (id) => {
  const queryText = {
    name: 'delete-car',
    text: 'DELETE FROM cars  WHERE id = $1',
    values: [id],
  };
  const queryResult = await query(queryText);

  return queryResult.rows[0];
};

export const filterCars = async (filterReceived) => {
  let filterParams = filterReceived;
  let cars = await getAllCars();

  // Return cars if no filter is received
  if (filterReceived.length === 0) {
    return cars;
  }

  const carStatus = filterParams.filter(filter => (filter.name === 'status' && filter.value === 'available'));

  if (carStatus.length > 0) {
    cars = await getAvailableCars();
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

export default getCar;
