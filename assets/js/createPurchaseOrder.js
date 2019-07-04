/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

let getUser = localStorage.getItem('user');
let fetchedCar;
if (
  getUser === null
  || getUser === undefined
  || getUser === 'undefined'
  || getUser === 'null'
) {
  window.location.replace('signin.html');
}

/* Extract car id from url */
const urlString = window.location.href;
const currentUrl = new URL(urlString);
const extractCarId = currentUrl.searchParams.get('car_id');

getUser = JSON.parse(getUser);

const populateOrder = () => {
  const orderElement = `
    <p class="section-header">Order Preview</p>
          <!-- The letter header -->
          <div class="d-flex align-items-center">
            <div class="flex-1">
              <div class="in-page-logo">
                <img class="img-responsive" src="assets/img/logo-black.png" />
              </div>
            </div>
            <div class="flex-1 text-align-end">
              <h3 class="">Purchase order<span></span></h3>
            </div>
          </div>
          <!-- Address -->
          <div class="d-flex align-items-center">
            <div class="flex-1">
              <div class="item-image-main">
                <p class="font-weight-bold uppercase divider">CUSTOMER</p>
                <p>${getUser.first_name} ${getUser.last_name}</p>

                <p class="capitalized">
                  ${getUser.address}
                </p>
                <p>${getUser.email}</p>
              </div>
            </div>
          </div>

          <!-- Item description -->
          <div>
            <div class="item-image-main">
              <p class="font-weight-bold divider uppercase">Purchase Item</p>
            </div>
          </div>
          <p class="font-weight-bold">
            Order:
            <span class="font-weight-lighter float-right"
              >${fetchedCar.name}</span
            >
          </p>
          <p class="font-weight-bold uppercase">Item Description</p>
          <p class="font-weight-bold divider pb">
            Seller ID:
            <span class="font-weight-lighter float-right"
              >${fetchedCar.owner}</span
            >
          </p>
          <p class="font-weight-bold divider pb">
            Model: <span class="font-weight-lighter float-right">${
  fetchedCar.model
}</span>
          </p>
          <p class="font-weight-bold divider pb">
            Manufacturer:
            <span class="font-weight-lighter float-right uppercase">${
  fetchedCar.manufacturer
}</span>
          </p>
          <p class="font-weight-bold divider pb">
            Car state:
            <span
              class="font-weight-lighter float-right uppercase font-style-oblique"
              >${fetchedCar.state}</span
            >
          </p>
          <p class="font-weight-bold  divider pb">
            Body type: <span class="font-weight-lighter float-right">${
  fetchedCar.body_type
}</span>
          </p>
          <p class="font-weight-bold uppercase  divider pb">
            Seller's Price:
            <span class=" float-right uppercase"><span>₦</span>${
  fetchedCar.price
}</span>
          </p>
          <p class="font-weight-bold uppercase  divider pb">
            Price offered:
            <span class=" float-right uppercase" id="price-offered-container">
            </span>
          </p>
  `;
  const purchaseOrderContainer = document.querySelector(
    '#purchase-order-container',
  );
  purchaseOrderContainer.innerHTML = orderElement;
};

/* Create purchase order */
const createPurchaseOrder = (payload) => {
  const endpoint = 'https://mthamayor-auto-mart.herokuapp.com/api/v1/order';
  const fetchRequest = {
    method: 'POST',
    body: payload,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getUser.token}`,
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
      Populator.showStickyNotification(
        'success',
        'Purchase order successfully created',
      );
      setTimeout(() => {
        window.location.replace(`car.html?car_id=${fetchedCar.id}`);
      }, 3000);
    })
    .catch((err) => {
      Populator.hideAsyncNotification();
      Populator.showNotification('Internet error occured. please try again');
      console.log(err);
    });
};

/* Fetch the car */
const fetchCar = async (carId) => {
  Populator.pageLoading(true);
  const endpoint = `https://mthamayor-auto-mart.herokuapp.com/api/v1/car/${carId}`;
  const fetchRequest = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  fetch(endpoint, fetchRequest)
    .then(res => res.json())
    .then((response) => {
      if (response.error) {
        Populator.showStickyNotification(response.error);
        return;
      }
      const { data } = response;

      if (data.status === 'sold') {
        Populator.showStickyNotification('error', 'Car has already been sold');
        return;
      }

      if (data.owner === getUser.id) {
        Populator.showStickyNotification(
          'error',
          'You cannot create order for ad you created',
        );
        return;
      }

      fetchedCar = data;
    })
    .catch((err) => {
      Populator.hideAsyncNotification();
      Populator.showNotification('Internet error occured. please try again');
      Populator.pageLoading(false);
    });
};

/* Fetch the car */
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
    const found = data.find(element => element.car_id === fetchedCar.id);
    if (found) {
      Populator.showStickyNotification(
        'error',
        'You already created a purchase order',
      );
      throw new Error('Order already created');
    }
  } catch (err) {
    Populator.hideAsyncNotification();
    throw new Error('Internet error occured');
  }
  await populateOrder();
  Populator.pageLoading(false);
};

// Handle form submission

const createOrderForm = document.querySelector('#create-order-form');
//  form-fields

createOrderForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const priceOffered = createOrderForm.new.value;
  if (!Helpers.isValidDigits(priceOffered) || priceOffered.length < 1) {
    Populator.showNotification('Price is not valid');
    return;
  }

  // Api calls
  let payload = {
    carId: fetchedCar.id,
    priceOffered,
  };
  payload = JSON.stringify(payload);

  Populator.showAsyncNotification();
  createPurchaseOrder(payload);
});

(async () => {
  await fetchCar(extractCarId);
  await fetchUserOrders();
  const priceOfferedContainer = document.querySelector(
    '#price-offered-container',
  );
  const priceOffered = document.querySelector('#price-offered');
  let price = '';

  priceOffered.addEventListener('input', (event) => {
    const regex = /,/g;
    price = event.target.value;

    price = price.replace(regex, '');
    if (price.length === 0) {
      priceOfferedContainer.textContent = '';
    } else {
      priceOfferedContainer.textContent = `₦${Helpers.formatMoney(price)}`;
    }
  });
})();
