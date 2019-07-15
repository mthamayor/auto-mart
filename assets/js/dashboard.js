/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
// Handle form submission

let getUser = localStorage.getItem('user');
if (
  getUser === null
  || getUser === undefined
  || getUser === 'undefined'
  || getUser === 'null'
) {
  window.location.replace('signin.html');
}

getUser = JSON.parse(getUser);

const welcomeMessageContainer = document.querySelector(
  '#welcome-message-container',
);
welcomeMessageContainer.textContent = `Welcome, ${getUser.first_name} ${
  getUser.last_name
}`;

const processCars = ({ data }) => {
  const carsContainer = document.querySelector('#user-adverts-container');

  if (data.length === 0) {
    carsContainer.innerHTML = '<p>You do not have any advert</p>';
    return;
  }
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
}" class="car-container d-flex-inline mb mt shadow">
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
  carsContainer.innerHTML = cars;
};

/* Fetch the car */
const fetchCar = async (carId) => {
  let car;
  Populator.pageLoading(true);
  const endpoint = `https://mthamayor-auto-mart.herokuapp.com/api/v1/car/${carId}`;
  const fetchRequest = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${getUser.token}`,
      'Content-Type': 'application/json',
    },
  };

  await fetch(endpoint, fetchRequest)
    .then(res => res.json())
    .then((response) => {
      if (response.error) {
        car = -1;
      } else {
        car = response.data;
      }
    })
    .catch((err) => {
      Populator.hideAsyncNotification();
      Populator.showNotification('Internet error occured. please try again');
      console.log(err);
    });
  return car;
};

const populateOrdersElement = async (order) => {
  let orderStatus;
  if (order.status === 'rejected') {
    orderStatus = '<small class="uppercase badge badge-brown mt">Rejected</small>';
  } else if (order.status === 'accepted') {
    orderStatus = '<small class="uppercase badge badge-success mt">Accepted</small>';
  } else if (order.status === 'pending') {
    orderStatus = '<small class="uppercase badge badge-gold mt">Pending</small>';
  }

  const car = await fetchCar(order.car_id);

  if (car === -1) {
    return '';
  }

  let statusLabel;
  if (car.status === 'available') {
    statusLabel = '<small class="uppercase badge badge-success badge-absolute">Available</small>';
  } else {
    statusLabel = '<small class="uppercase badge badge-danger badge-absolute">Sold</small>';
  }
  const orderElement = `
      <a
            href="./edit-purchase-order.html?car_id=${car.id}"
            class="car-container d-flex-inline mb mt shadow"
          >
            <div
              class="flex-1 d-flex p-small align-items-center search-img-container"
            >
              <img
                class="search-img img-responsive"
                src="${car.image_url[0]}"
              />
              ${statusLabel}
            </div>
            <div class="search-description-container text-start flex-1 pl pr">
              ${orderStatus}
              <h4 class="font-slabo">
                ${car.name}
              </h4>
              <div class="mb"></div>
              <div class="divider mb"></div>
              <div class="font-weight-bold capitalized mb">
                Car Price: <span class="">₦<span>${car.price}</span></span>
              </div>
              <div class="font-weight-bold capitalized mb">
                Price offered: <span class="">₦<span>${
  order.price_offered
}</span></span>
              </div>
            </div>
          </a>    
    `;
  return orderElement;
};

const populateOrdersContainer = async (data) => {
  const ordersContainer = document.querySelector('#purchase-orders-container');
  const orders = '';
  if (data.length === 0) {
    ordersContainer.innerHTML = '<p>You have not created any purchase orders</p>';
    return;
  }
  ordersContainer.innerHTML = '';
  data.forEach(async (order) => {
    const orderElement = await populateOrdersElement(order);
    ordersContainer.innerHTML += orderElement;
  });
};

/* Fetch the orders */
const fetchUserOrders = async () => {
  Populator.pageLoading(true);
  const endpoint = 'https://mthamayor-auto-mart.herokuapp.com/api/v1/order/user/my-orders';
  const fetchRequest = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getUser.token}`,
    },
  };

  try {
    const res = await fetch(endpoint, fetchRequest);
    const response = await res.json();

    if (response.error) {
      Populator.showStickyNotification('error', response.error);
      throw new Error('Server error');
    }

    const { data } = response;

    populateOrdersContainer(data);
  } catch (err) {
    Populator.hideAsyncNotification();
    throw new Error('Internet error occured');
  }

  Populator.pageLoading(false);
};

/* Fetch the cars */
const fetchUserCars = async () => {
  Populator.pageLoading(true);
  const endpoint = 'https://mthamayor-auto-mart.herokuapp.com/api/v1/car/user/my-cars';
  const fetchRequest = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getUser.token}`,
    },
  };

  try {
    const res = await fetch(endpoint, fetchRequest);
    const response = await res.json();

    if (response.error) {
      Populator.showStickyNotification('error', response.error);
      throw new Error('Server error');
    }

    processCars(response);

    Populator.pageLoading(false);
  } catch (err) {
    console.log(err);
  }
};

fetchUserCars();
fetchUserOrders();
