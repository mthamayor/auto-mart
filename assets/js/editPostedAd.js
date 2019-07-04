/* eslint-disable no-undef */
// Handle form submission

const editAdButton = document.querySelector('#edit-ad-button');
const editAdContainer = document.querySelector('#edit-ad-container');
const cancelEditAdButton = document.querySelector('#cancel-edit-ad-button');
const editAdForm = document.querySelector('#edit-ad-form');

const toggleEditAdContainer = () => {
  if (editAdContainer.classList.contains('d-none')) {
    editAdContainer.classList.remove('d-none');
  } else {
    editAdContainer.classList.add('d-none');
  }
};

const editAd = (payload) => {
  Populator.showAsyncNotification();

  const endpoint = `https://mthamayor-auto-mart.herokuapp.com/api/v1/car/${
    fetchedCar.id
  }/price`;
  const fetchRequest = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getUser.token}`,
    },
    body: payload,
  };

  fetch(endpoint, fetchRequest)
    .then(res => res.json())
    .then((response) => {
      if (response.error) {
        Populator.hideAsyncNotification();
        Populator.showStickyNotification('error', response.error);
        return;
      }

      Populator.hideAsyncNotification();
      Populator.showStickyNotification(
        'success',
        'Ad edited successfully. Reloading page',
      );
      setTimeout(() => window.location.reload(), 3000);
    })
    .catch((err) => {
      console.log(err);
      Populator.hideAsyncNotification();
      throw new Error();
    });
};

editAdButton.addEventListener('click', toggleEditAdContainer);
cancelEditAdButton.addEventListener('click', toggleEditAdContainer);

editAdForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const newPrice = editAdForm['new-price'].value;

  if (!Helpers.isValidDigits(newPrice)) {
    Populator.showNotification('Please enter a valid price');
    return;
  }

  const payload = JSON.stringify({
    newPrice,
  });

  editAd(payload);
});
