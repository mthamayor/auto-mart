/* eslint-disable no-undef */
const priceOffered = document.querySelector('#price-offered');
let price = '';

priceOffered.addEventListener('input', (event) => {
  const regex = /,/g;
  price = event.target.value;

  price = price.replace(regex, '');
});

// Handle form submission

const updatePriceForm = document.querySelector('#update-price-form');
//  form-fields


updatePriceForm.addEventListener('submit', (event) => {
  event.preventDefault();

  if (Number.isNaN(price) || price.length < 1) {
    Populator.showNotification('Price is not valid');
  }
  // Api calls
});
