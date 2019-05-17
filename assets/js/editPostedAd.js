//Handle form submission

const changePriceForm = document.querySelector("#change-price-form");
//  form-fields


changePriceForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const priceInput = changePriceForm['new'];
  let newPrice = priceInput.value;
  if (isNaN(newPrice) || newPrice.length < 1) {
    Populator.showNotification('Price is not valid');
    return;
  }
  //Api calls
  Populator.showAsyncNotification();

  setTimeout(() => { Populator.hideAsyncNotification() }, 3000);


});

const imageTemplates = document.querySelectorAll('.temp-image');
for (let i = 0; i < imageTemplates.length; i++) {
  imageTemplates[i].addEventListener('click', event => {
    if (event.target.src === undefined) {
      return;
    }
    const url = event.target.src;
    Populator.replaceImage(url);
  });
}