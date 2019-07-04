/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
// Handle form submission

const searchForm = document.querySelector('#search-form');
const carText = document.querySelector('#car-header');
const carsContainer = document.querySelector('#car-container');
const manufacturerInput = document.querySelector('#manufacturer-input');
const bodyTypeInput = document.querySelector('#body-type-input');
const clearManufacturer = document.querySelector('#clear-manufacturer');
const clearBodyType = document.querySelector('#clear-body-type');

const processCars = ({ data }) => {
  let cars = '';
  let statusLabel;
  let stateLabel;
  data.forEach((element) => {
    const imageUrls = element.image_urls;
    if (element.state === 'new') {
      stateLabel = '<small class="uppercase badge badge-gold mt">New</small>';
    } else {
      stateLabel = '<small class="uppercase badge badge-brown mt">Used</small>';
    }
    if (element.status === 'available') {
      statusLabel = '<small class="uppercase badge badge-success badge-absolute">Available</small>';
    } else {
      statusLabel = '<small class="uppercase badge badge-danger badge-absolute">Sold</small>';
    }
    const car = `
      <a href="./car.html?car_id=${
  element.id
}" class="car-container d-flex mb mt shadow">
          <div
            class="flex-1 d-flex p-small align-items-center search-img-container"
          >
            <img
              class="search-img img-responsive"
              src="${imageUrls[0]}"
            />
            ${statusLabel}
          </div>
          <div class="search-description-container flex-1 pl pr">
            ${stateLabel}
            <h4 class="font-slabo">
              ${element.name}
            </h4>
            <div class="mb"></div>
            <div class="divider mb"></div>
            <div class="capitalized mb">
              Model: <span class="uppercase">${element.model}</span>
            </div>
            <div class="capitalized mb">
              Type: <span class="uppercase">${element.body_type}</span>
            </div>
            <div class="capitalized mb">
              Manufacturer: <span class="uppercase">${
  element.manufacturer
}</span>
            </div>
            <div class="font-weight-bold capitalized mb">
              Price: <span class="">₦<span>${Helpers.formatMoney(
    element.price,
  )}</span></span>
            </div>
          </div>
        </a>
    `;
    cars += car;
  });
  return cars;
};

const searchCars = (queryParams = '') => {
  Populator.showAsyncNotification();
  const endpoint = `https://mthamayor-auto-mart.herokuapp.com/api/v1/car?status=available&${queryParams}`;
  const fetchRequest = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  fetch(endpoint, fetchRequest)
    .then(res => res.json())
    .then((response) => {
      Populator.hideAsyncNotification();
      if (response.error) {
        Populator.showStickyNotification('error', response.error);
        return;
      }
      const carsSearch = processCars(response);
      carText.textContent = response.data.length > 0
        ? `${response.data.length} car found`
        : 'No cars found';
      carsContainer.innerHTML = carsSearch;
    })
    .catch((err) => {
      Populator.hideAsyncNotification();
      Populator.showNotification('Internet error occured. please try again');
      console.log(err);
    });
};

searchCars();

// Clear buttons
clearManufacturer.addEventListener('click', () => {
  manufacturerInput.value = '';
});
clearBodyType.addEventListener('click', () => {
  bodyTypeInput.value = '';
});

//  form-fields

searchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const manufacturer = searchForm['manufacturer-filter'].value;
  const bodyType = searchForm['body-type-filter'].value;
  const lowerPrice = searchForm['lower-price'].value;
  const higherPrice = searchForm['higher-price'].value;
  const vehicleState = searchForm['vehicle-state'].value;

  // Form validation
  if (lowerPrice.length > 0 || higherPrice.length > 0) {
    if (
      (lowerPrice.length > 0 && higherPrice.length <= 0)
      || (lowerPrice.length <= 0 && higherPrice.length > 0)
    ) {
      Populator.showNotification('Please specify both min and max prices');
      return;
    }
    const isNum = /^\d+$/;
    if (!isNum.test(lowerPrice)) {
      Populator.showNotification('Please enter a valid min price');
      return;
    }

    if (!isNum.test(higherPrice)) {
      Populator.showNotification('Please enter a valid max price');
      return;
    }
    if (parseInt(lowerPrice, 10) >= parseInt(higherPrice, 10)) {
      Populator.showNotification(
        'Lower price cannot be greater than or equal to higher price',
      );
      return;
    }
  }

  // Form validation ends here
  // Api calls
  let queryParam = {};

  if (String(manufacturer).length > 0) {
    queryParam.manufacturer = String(manufacturer).toLowerCase();
  }
  if (String(bodyType).length > 0) {
    queryParam.body_type = String(bodyType).toLowerCase();
  }
  if (String(vehicleState).length > 0) {
    queryParam.state = String(vehicleState).toLowerCase();
  }

  if (String(lowerPrice).length > 0 && String(higherPrice).length > 0) {
    queryParam.min_price = String(lowerPrice).toLowerCase();
    queryParam.max_price = String(higherPrice).toLowerCase();
  }
  console.log(queryParam);

  queryParam = Helpers.serialize(queryParam);

  searchCars(queryParam);
});
