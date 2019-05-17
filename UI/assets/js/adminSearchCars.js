//Handle form submission

const searchForm = document.querySelector('#search-form');
//  form-fields

searchForm.addEventListener('submit', event => {
  event.preventDefault();
  const manufacturer = searchForm['manufacturer-filter'].value;
  const lowerPrice = searchForm['lower-price'].value;
  const higherPrice = searchForm['higher-price'].value;
  const vehicleState = searchForm['vehicle-state'].value;
  const vehicleStatus = searchForm['vehicle-status'].value;

  // Form validation

  if (isNaN(lowerPrice)) {
    Populator.showNotification('Please enter a valid lower price');
    return;
  }

  if (isNaN(higherPrice)) {
    Populator.showNotification('Please enter a valid higherPrice');
    return;
  }
  if (parseInt(lowerPrice) > parseInt(higherPrice)) {
    Populator.showNotification(
      'Lower price cannot be greater than higher price'
    );
    return;
  }

  if (lowerPrice.length > 0 && higherPrice.length <= 0) {
    Populator.showNotification('Please enter a valid higher price');
    return;
  }
  if (lowerPrice.length <= 0 && higherPrice.length > 0) {
    Populator.showNotification('Please enter a valid lower price');
    return;
  }

  // Form validation ends here
  //Api calls
  Populator.showAsyncNotification();

  setTimeout(() => {
    Populator.hideAsyncNotification();
  }, 3000);
});
