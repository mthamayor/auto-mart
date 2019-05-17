const flagButton = document.querySelector('#flag-button');
const flagContainer = document.querySelector('#flag-container');
const cancelButton = document.querySelector('#cancel-button');
const reportButton = document.querySelector('#report-button');

const toggleFlag = () => {
  if (flagContainer.classList.contains('d-none')) {
    flagContainer.classList.remove('d-none');
  }
  else {
    flagContainer.classList.add('d-none');
  }
}

flagButton.addEventListener('click', toggleFlag);
cancelButton.addEventListener('click', toggleFlag);


const imageTemplates = document.querySelectorAll('.temp-image');
for (let i = 0; i < imageTemplates.length; i++) {
  imageTemplates[i].addEventListener('click', (event) => {
    if (event.target.src === undefined) {
      return;
    }
    const url = event.target.src;
    Populator.replaceImage(url);
  });
}