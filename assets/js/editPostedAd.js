/* eslint-disable no-undef */
// Handle form submission

const changePriceForm = document.querySelector('#change-price-form');

const replaceImages = (image) => {
  image.addEventListener('click', (event) => {
    if (event.target.src === undefined) {
      return;
    }
    const url = event.target.src;
    Populator.replaceImage(url);
  });
};
//  form-fields


changePriceForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const priceInput = changePriceForm.new;
  const newPrice = priceInput.value;
  if (Number.isNaN(newPrice) || newPrice.length < 1) {
    Populator.showNotification('Price is not valid');
    return;
  }
  // Api calls
  Populator.showAsyncNotification();

  setTimeout(() => { Populator.hideAsyncNotification(); }, 3000);
});

const imageTemplates = document.querySelectorAll('.temp-image');
for (let i = 0; i < imageTemplates.length; i += 1) {
  replaceImages(imageTemplates[i]);
}
