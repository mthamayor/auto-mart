/* eslint-disable no-undef */
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

// Handle form submission

const createOrderForm = document.querySelector('#create-order-form');
//  form-fields

createOrderForm.addEventListener('submit', (event) => {
  event.preventDefault();

  if (Number.isNaN(price) || price.length < 1) {
    Populator.showNotification('Price is not valid');
  }
  // Api calls
});
