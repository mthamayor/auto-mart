/* eslint-disable no-useless-escape */
/* eslint-disable no-plusplus */
/* eslint-disable no-undef */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-unused-vars */
class Populator {
  static populateContainer(containerId, content) {
    const container = document.querySelector(`#${containerId}`);
    container.innerHTML = content;
  }

  static replaceImage(newImageUrl) {
    try {
      const newImageContainer = document.querySelector('.item-image-main');
      const imgElement = `
      <img class="img-responsive" src="${newImageUrl}"/>
    `;
      newImageContainer.innerHTML = imgElement;
    } catch (ex) {
      console.log('the image with id was not found');
    }
  }

  static showNotification(word) {
    try {
      const notificationContainer = document.querySelector('#notification');
      notificationContainer.textContent = word;

      notificationContainer.className = 'show';

      setTimeout(() => {
        notificationContainer.className = notificationContainer.className.replace(
          'show',
          '',
        );
        notificationContainer.textContent = '';
      }, 3000);
    } catch (ex) {
      console.log('the image with id was not found');
    }
  }

  static showAsyncNotification() {
    try {
      const asyncNotificationContainer = document.querySelector(
        '#async-loading',
      );

      asyncNotificationContainer.className = 'show';
    } catch (ex) {
      console.log('the image with id was not found');
    }
  }

  static hideAsyncNotification() {
    try {
      const asyncNotificationContainer = document.querySelector(
        '#async-loading',
      );
      asyncNotificationContainer.className = 'hide';
      setTimeout(() => {
        asyncNotificationContainer.className = '';
      }, 300);
    } catch (ex) {
      console.log('Error removing async notification');
    }
  }

  static showStickyNotification(
    type = 'normal',
    message = 'no message specified',
  ) {
    try {
      const stickyNotificationContainer = document.querySelector(
        '#sticky-loading',
      );
      let spanColor;
      switch (type) {
        case 'error':
          spanColor = 'color-red';
          break;
        case 'success':
          spanColor = 'color-green';
          break;
        default:
          spanColor = 'color-black';
      }
      stickyNotificationContainer.innerHTML = `
        <span class=${spanColor}>${message}</span>
        <i id="close" class="lni-close ${spanColor}"></i>
      `;
      stickyNotificationContainer.classList.add('show');

      const closeBtn = document.querySelector('#close');

      closeBtn.addEventListener('click', () => {
        this.hideStickyNotification();
      });
    } catch (ex) {
      console.log(ex);
    }
  }

  static hideStickyNotification() {
    try {
      const stickyNotificationContainer = document.querySelector(
        '#sticky-loading',
      );
      stickyNotificationContainer.classList.remove('show');
      stickyNotificationContainer.classList.add('hide');
      setTimeout(() => {
        stickyNotificationContainer.classList.remove('hide');
        stickyNotificationContainer.classList.remove('show');
      }, 300);
    } catch (ex) {
      console.log('Error removing sticky notification');
    }
  }

  static pageLoading(loading) {
    try {
      const pageLoadingContainer = document.querySelector('#page-loading');
      if (loading === true) {
        pageLoadingContainer.className = '';
      } else {
        pageLoadingContainer.className = 'hide';
      }
    } catch (ex) {
      console.log('Error removing async notification');
    }
  }
}


class Helpers {
  static formatMoney(money) {
    let newWord = '';

    let prefix = '';
    for (let i = money.length - 1; i >= 0; i--) {
      prefix = `${money.charAt(i)}${prefix}`;
      if (prefix.length === 3) {
        newWord = `,${prefix}${newWord}`;
        prefix = '';
      }
    }
    newWord = `${prefix}${newWord}`;

    if (newWord.charAt(0) === ',') {
      newWord = newWord.substring(1, newWord.length);
    }
    return newWord;
  }

  static isEmail(email) {
    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(email.toLowerCase());
  }

  /*
  https://www.w3resource.com/javascript-exercises/javascript-string-exercise-9.php
  */
  static capitalizeWords(word) {
    return word.replace(
      /\w\S*/g,
      txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(),
    );
  }
}


window.addEventListener('scroll', () => {
  const navBar = document.querySelector('.nav');
  if (pageYOffset > 200) {
    navBar.classList.remove('absolute');
    navBar.classList.remove('fixed');
    navBar.classList.add('fixed');
  } else {
    navBar.classList.remove('absolute');
    navBar.classList.remove('fixed');
    navBar.classList.add('absolute');
  }
});
window.addEventListener('load', () => {
  const menuToggle = document.querySelector('.menu-toggle');

  const navListContainer = document.querySelector('.links');
  menuToggle.addEventListener('click', () => {
    if (navListContainer.classList.contains('d-sm-none')) {
      navListContainer.classList.remove('d-sm-none');
    } else {
      navListContainer.classList.add('d-sm-none');
    }
  });
});

try {
  Populator.populateContainer('footer-container', footer);
} catch (ex) {
  console.log('footer-container not found');
}
