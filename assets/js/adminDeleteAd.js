/* eslint-disable no-undef */
const imageTemplates = document.querySelectorAll('.temp-image');

const replaceImages = (image) => {
  image.addEventListener('click', (event) => {
    if (event.target.src === undefined) {
      return;
    }
    const url = event.target.src;
    Populator.replaceImage(url);
  });
};

for (let i = 0; i < imageTemplates.length; i += 1) {
  replaceImages(imageTemplates[i]);
}
