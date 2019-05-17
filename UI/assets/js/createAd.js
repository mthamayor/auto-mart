const createAdForm = document.querySelector('#create-ad-form');
const previewContainer = document.querySelector('#preview');
const fileUpload = document.querySelector('#file-upload');

let files = [];
fileUpload.addEventListener('change', event => {
  files = event.target.files;

  if (files.length > 0) {
    populatePreviewContainer(files);
  }
});

const populatePreviewContainer = files => {
  let fileReader;
  previewContainer.innerHTML = '';
  for (let i = 0; i < files.length; i++) {
    let file = files[i];
    fileReader = new FileReader();
    fileReader.onload = e => {
      const imgContainer = document.createElement('div');
      imgContainer.classList.add(
        'img-preview',
        'd-flex',
        'm-small',
        'align-items-center',
        'justify-content-center'
      );
      imgContainer.innerHTML = `
            <img class="img-responsive m-small" src="${
              e.target.result
            }" alt="" />
        `;
      console.log(e.target.result);
      previewContainer.appendChild(imgContainer);
    };
    fileReader.readAsDataURL(file);
  }
};

createAdForm.addEventListener('submit', event => {
  event.preventDefault();
  const vehicleName = createAdForm['vehicle-name'].value;
  const manufacturer = createAdForm['manufacturer'].value;
  const model = createAdForm['model'].value;
  const vehicleState = createAdForm['state'].value;
  const bodyType = createAdForm['body-type'].value;
  const price = createAdForm['price'].value;

  // Validation starts here
  if (files.length <= 0) {
    Populator.showNotification('Please upload at least one image');
    return;
  }

  if (vehicleName.length <= 0) {
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
  if (vehicleState.length <= 0) {
    Populator.showNotification('Please enter a valid vehicle state');
    return;
  }
  if (bodyType.length <= 0) {
    Populator.showNotification('Please enter a valid body type');
    return;
  }
  if (price.length <= 0 || isNaN(price)) {
    Populator.showNotification('Please enter a valid price');
    return;
  }
  // Validation ends here

  //Api calls
  Populator.showAsyncNotification();

  setTimeout(() => {
    Populator.hideAsyncNotification();
  }, 3000);
});
