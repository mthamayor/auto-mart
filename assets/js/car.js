/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

let getUser = localStorage.getItem('user');
let fetchedCar;
if (
  !(
    getUser === null
    || getUser === undefined
    || getUser === 'undefined'
    || getUser === 'null'
  )
) {
  const loggedElements = document.querySelectorAll('[loggedElement]');

  loggedElements.forEach((element) => {
    element.classList.remove('d-none');
  });
  getUser = JSON.parse(getUser);

  // const adminElements = document.querySelectorAll('[heirachy=admin]');
  // const sellerElements = document.querySelectorAll('[heirachy=seller]');
  // const buyerElements = document.querySelectorAll('[heirachy=buyer]');
  if (getUser.is_admin === true) {
    const adminElements = document.querySelectorAll('[heirachy=admin]');
    adminElements.forEach((element) => {
      element.classList.remove('d-none');
      element.classList.remove('v-none');
    });
  }
}

const flagButton = document.querySelector('#flag-button');
const flagContainer = document.querySelector('#flag-container');
const cancelButton = document.querySelector('#cancel-button');
const reportButton = document.querySelector('#report-button');

const flagsContainer = document.querySelector('#flags-container');
const showFlagsButton = document.querySelector('#show-flags-button');
const hideFlagsButton = document.querySelector('#close-flags-button');

const deleteAdButton = document.querySelector('#delete-ad');

const ordersContainer = document.querySelector('#orders-container');
const showOrdersButton = document.querySelector('#show-orders-button');
const hideOrdersButton = document.querySelector('#close-orders-button');

const fillCarDetails = ({ data }) => {
  const carDetailsContainer = document.querySelector('#car-details-container');

  const carDetailsElement = `
    <div>
      <h1 class="font-slabo capitalized">${data.name}</h1>
    </div>
    <p class="d-flex divider pb">
      <strong class="uppercase mr">Seller ID: </strong>
        <span class="capitalized flex-1 text-end">${data.id}</span>
      </p>
      <p class="d-flex divider pb">
        <strong class="uppercase mr"> Model: </strong>
        <span class="uppercase flex-1 text-end">${data.model}</span>
      </p>
      <p class="d-flex divider pb">
        <strong class="uppercase mr"> Manufacturer: </strong>
        <span class="uppercase flex-1 text-end">${data.manufacturer}</span>
      </p>
      <p class="d-flex divider pb">
        <strong class="uppercase mr"> Body: </strong>
        <span class="capitalized flex-1 text-end">${data.body_type}</span>
      </p>
      <p class="d-flex divider pb">
        <strong class="uppercase mr"> State: </strong>
        <span
              class="uppercase font-weight-bold font-style-oblique flex-1 text-end"
              >${data.state}</span>
      </p>
      <p class="d-flex divider pb">
        <strong class="uppercase mr">price:</strong>
        <span class="flex-1 text-end font-weight-bold ">
          ₦<span>${Helpers.formatMoney(data.price)}</span>
        </span>
      </p>
  `;
  carDetailsContainer.innerHTML = carDetailsElement;
};

const fillFlagElement = (flagItem) => {
  const flag = `
    <div class="d-flex mb">
          <div class="mr-medium align-self-center">
            <h3 class="font-slabo">${flagItem.id}</h3>
          </div>
          <div class="flex-1 d-flex divider pb">
            <div class="d-flex flex-1 flex-column justify-content-center">
              <div>
                <span class="font-weight-bold mb uppercase"
                  >User ID: ${flagItem.user_id}</span
                >
                <small class="float-right">${flagItem.created_on}</small>
              </div>
              <div class="d-flex flex-column justify-content-center mb">
                <small class="font-color-primary font-weight-bold uppercase"
                  >Reason</small
                >
                <small class="flex-1">${flagItem.reason}</small>
              </div>
              <div class="d-flex flex-column justify-content-center">
                <small class="font-color-primary font-weight-bold uppercase"
                  >Description</small
                >
                <small class="flex-1"
                  >${flagItem.description}
                </small>
              </div>
            </div>
          </div>
        </div>
  `;
  return flag;
};

/* Populate the control button */
const populatePageControls = ({ data }) => {
  const tempImage = document.querySelector('#image-preview-list');
  const mainImage = document.querySelector('#main-image');
  const makeOrderButton = document.querySelector('#make-order-button');
  const buyerOrderButton = document.querySelector('#buyer-order-button');


  buyerOrderButton.href = `./edit-purchase-order.html?car_id=${data.id}`;
  try {
    if (data.owner === getUser.id) {
      const sellerElements = document.querySelectorAll('[heirachy=seller]');
      sellerElements.forEach((element) => {
        element.classList.remove('d-none');
        element.classList.remove('v-none');
      });
    }
  } catch (err) {
    console.log(err);
  }

  if (data.status === 'sold') {
    makeOrderButton.disabled = true;
    makeOrderButton.textContent = 'Sold';
    flagButton.classList.add('d-none');
  } else {
    makeOrderButton.addEventListener('click', () => {
      window.location.href = `create-purchase-order.html?car_id=${data.id}`;
    });
  }

  let previewList = '';
  const imageUrls = data.image_urls;

  imageUrls.forEach((image) => {
    previewList += `
      <div
        class="img-preview d-flex m-small align-items-center justify-content-center"
        >
        <img
          class="img-responsive cursor-pointer"
          src="${image}"
          alt="image"
        />
      </div>
    `;
  });
  tempImage.innerHTML = previewList;
  mainImage.innerHTML = `
    <img
      class="img-responsive"
      src="${imageUrls[0]}"
      />
  `;
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

  await fetch(endpoint, fetchRequest)
    .then(res => res.json())
    .then((response) => {
      if (response.error) {
        Populator.showStickyNotification('error', response.error);
        return;
      }
      fetchedCar = response.data;
      populatePageControls(response);
      fillCarDetails(response);
      Populator.pageLoading(false);
    })
    .catch((err) => {
      Populator.hideAsyncNotification();
      Populator.showNotification('Internet error occured. please try again');
      console.log(err);
    });
};

/* Handles Acceptance of purchase orders */
const acceptOffer = (orderId) => {
  Populator.showAsyncNotification();
  const { token } = getUser;
  const endpoint = `https://mthamayor-auto-mart.herokuapp.com/api/v1/order/${orderId}/accept`;
  const fetchRequest = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
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
      Populator.showStickyNotification('success', 'Purchase order accepted. reloading...');
      setTimeout(() => window.location.reload(), 3000);
    })
    .catch((err) => {
      Populator.hideAsyncNotification();
      Populator.showNotification('Internet error occured. please try again');
      console.log(err);
    });
};

/* Handles rejection of purchase orders */
const rejectOffer = (orderId) => {
  Populator.showAsyncNotification();
  const { token } = getUser;
  const endpoint = `https://mthamayor-auto-mart.herokuapp.com/api/v1/order/${orderId}/reject`;
  const fetchRequest = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
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
        'Purchase order rejected. reloading...',
      );
      setTimeout(() => window.location.reload(), 3000);
    })
    .catch((err) => {
      Populator.hideAsyncNotification();
      Populator.showNotification('Internet error occured. please try again');
      console.log(err);
    });
};

const fillOrderElement = (orderItem) => {
  const carStatus = fetchedCar.status;
  let actionDiv = '';
  switch (orderItem.status) {
    case 'accepted':
      actionDiv = '<small class="badge badge-success mb cursor-pointer uppercase">Accepted</small>';
      break;
    case 'rejected':
      actionDiv = '<small class="badge badge-danger mb cursor-pointer uppercase">Rejected</small>';
      break;
    default:
      if (carStatus === 'available') {
        actionDiv = `<small
                id="accept-order"
                class="badge badge-gold mb cursor-pointer uppercase"
                onClick = acceptOffer(${orderItem.id})
                >Accept</small
              >
              <small
                id="reject-order"
                class="badge badge-danger mb cursor-pointer uppercase"
                onClick = rejectOffer(${orderItem.id})
                >Reject</small
              >
      `;
      }
  }
  const order = `
        <div class="d-flex mb">
          <div class="mr-medium">
            <h3 class="font-slabo">
              ${orderItem.id}
            </h3>
          </div>
          <div class="flex-1 d-flex divider">
            <div
              class="d-flex flex-1 flex-column justify-content-center"
            >
            <div>
                <span class="font-weight-bold mb uppercase"
                  >Buyer ID: ${orderItem.buyer}</span
                >
              </div>
              <div class="d-flex align-items-center">
                <small class="font-color-primary">Price offered:</small>
                <div class="flex-1 text-center font-weight-bold">
                ₦${Helpers.formatMoney(orderItem.price_offered)}
                </div>
              </div>
            </div>
            <div class="d-flex flex-column">
              ${actionDiv}
            </div>
          </div>
        </div>
  `;
  return order;
};

Populator.pageLoading(true);
/* Extract car id from url */
const urlString = window.location.href;
const currentUrl = new URL(urlString);
const extractCarId = currentUrl.searchParams.get('car_id');

if (!Helpers.isValidDigits(extractCarId)) {
  Populator.showStickyNotification('error', 'Invalid car id provided');
  throw new Error('Invalid car id provided');
}

fetchCar(extractCarId);

const processFlags = ({ data }) => {
  let parsedHtml = '';
  data.forEach((item) => {
    parsedHtml += fillFlagElement(item);
  });

  return parsedHtml;
};

const processOrders = ({ data }) => {
  let parsedHtml = '';
  data.forEach((item) => {
    parsedHtml += fillOrderElement(item);
  });

  return parsedHtml;
};

/*
  Fetch flags from database
*/
const fetchFlags = () => {
  Populator.showAsyncNotification();
  const { token } = getUser;
  const endpoint = `https://mthamayor-auto-mart.herokuapp.com/api/v1/car/${extractCarId}/flags`;
  const fetchRequest = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
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
      const flagsFill = document.querySelector('#flags-fill');
      flagsFill.innerHTML = response.data.length > 0
        ? processFlags(response)
        : '<p>No flags found</p>';
    })
    .catch((err) => {
      Populator.hideAsyncNotification();
      Populator.showNotification('Internet error occured. please try again');
      console.log(err);
    });
};

/*
  Fetch flags from database
*/
const fetchOrders = () => {
  Populator.showAsyncNotification();
  const { token } = getUser;
  const endpoint = `https://mthamayor-auto-mart.herokuapp.com/api/v1/car/${extractCarId}/orders`;
  const fetchRequest = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
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
      const ordersFill = document.querySelector('#orders-fill');

      ordersFill.innerHTML = response.data.length > 0
        ? processOrders(response)
        : '<p>No orders found</p>';
    })
    .catch((err) => {
      Populator.hideAsyncNotification();
      Populator.showNotification('Internet error occured. please try again');
      console.log(err);
    });
};

const toggleFlag = () => {
  if (flagContainer.classList.contains('d-none')) {
    flagContainer.classList.remove('d-none');
  } else {
    flagContainer.classList.add('d-none');
  }
};

const toggleOrdersList = () => {
  if (ordersContainer.classList.contains('d-none')) {
    ordersContainer.classList.remove('d-none');
    fetchOrders();
  } else {
    ordersContainer.classList.add('d-none');
  }
};

const toggleFlagsList = () => {
  if (flagsContainer.classList.contains('d-none')) {
    flagsContainer.classList.remove('d-none');
    fetchFlags();
  } else {
    flagsContainer.classList.add('d-none');
  }
};

const replaceImages = (image) => {
  image.addEventListener('click', (event) => {
    if (event.target.src === undefined) {
      return;
    }
    const url = event.target.src;
    Populator.replaceImage(url);
  });
};

flagButton.addEventListener('click', toggleFlag);
cancelButton.addEventListener('click', toggleFlag);

showFlagsButton.addEventListener('click', toggleFlagsList);
hideFlagsButton.addEventListener('click', toggleFlagsList);

showOrdersButton.addEventListener('click', toggleOrdersList);
hideOrdersButton.addEventListener('click', toggleOrdersList);

const imageTemplates = document.querySelectorAll('.temp-image');
for (let i = 0; i < imageTemplates.length; i += 1) {
  replaceImages(imageTemplates[i]);
}
