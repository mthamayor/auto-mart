/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

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

const createAdForm = document.querySelector('#create-ad-form');
const previewContainer = document.querySelector('#preview');
const fileUpload = document.querySelector('#file-upload');

const populatePreviewContainer = (files) => {
  let fileReader;
  previewContainer.innerHTML = '';
  for (let i = 0; i < files.length; i += 1) {
    const file = files[i];
    fileReader = new FileReader();
    fileReader.onload = (e) => {
      const imgContainer = document.createElement('div');
      imgContainer.classList.add(
        'img-preview',
        'd-flex',
        'm-small',
        'align-items-center',
        'justify-content-center',
      );
      imgContainer.innerHTML = `
            <img class="img-responsive m-small" src="${
  e.target.result
}" alt="" />
        `;
      previewContainer.appendChild(imgContainer);
    };

    fileReader.readAsDataURL(file);
  }
};
let files = [];
fileUpload.addEventListener('change', (event) => {
  const extractFiles = event.target.files;
  files = extractFiles;
  if (files.length > 0) {
    populatePreviewContainer(files);
  }
});

const createAd = (formData) => {
  Populator.showAsyncNotification();
  Populator.pageLoading(true);
  const endpoint = 'https://mthamayor-auto-mart.herokuapp.com/api/v1/car';
  const fetchRequest = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getUser.token}`,
    },
    body: formData,
  };

  fetch(endpoint, fetchRequest)
    .then(res => res.json())
    .then((response) => {
      if (response.error) {
        Populator.hideAsyncNotification();
        Populator.showStickyNotification('error', response.error);
        return;
      }
      const { data } = response;

      Populator.showStickyNotification('success', 'Ad created successfully');
      Populator.hideAsyncNotification();
      Populator.pageLoading(false);
    })
    .catch((err) => {
      console.log(err);
      Populator.hideAsyncNotification();
      Populator.pageLoading(false);
      throw new Error();
    });
};
createAdForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = createAdForm.name.value;
  const manufacturer = createAdForm.manufacturer.value;
  const model = createAdForm.model.value;
  const state = createAdForm.state.value;
  const bodyType = createAdForm.bodyType.value;
  const price = createAdForm.price.value;

  // Validation starts here
  if (files.length <= 0) {
    Populator.showNotification('Please upload at least one image');
    return;
  }

  if (name.length <= 0) {
    Populator.showNotification('Please enter a valid vehicle name');
    return;
  }
  if (manufacturer.length <= 0) {
    Populator.showNotification('Please enter a valid manufacturer');
    return;
  }
  if (model.length <= 0) {
    Populator.showNotification('Please enter a valid model');
    return;
  }
  if (state.length <= 0) {
    Populator.showNotification('Please enter a valid vehicle state');
    return;
  }
  if (bodyType.length <= 0) {
    Populator.showNotification('Please enter a valid body type');
    return;
  }
  if (!Helpers.isValidDigits(price)) {
    Populator.showNotification('Please enter a valid price');
    return;
  }
  // Validation ends here

  // Api calls
  const formData = new FormData(createAdForm);

  createAd(formData);
});
