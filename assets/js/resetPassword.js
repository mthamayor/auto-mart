/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

let getUser = localStorage.getItem('user');
if (
  !(getUser === null
  || getUser === undefined
  || getUser === 'undefined'
  || getUser === 'null'
  )
) {
  window.location.replace('dashboard.html');
}

getUser = JSON.parse(getUser);

const resetPassword = (email, payload) => {
  Populator.showAsyncNotification();

  const endpoint = `https://mthamayor-auto-mart.herokuapp.com/api/v1/users/${
    email
  }/reset_password`;
  const fetchRequest = payload === undefined ? {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  }
    : {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: payload,
    };

  fetch(endpoint, fetchRequest)
    .then(async (response) => {
      let res;
      if (response.status !== 204) {
        res = await response.json();
        if (res.error) {
          Populator.hideAsyncNotification();
          Populator.showStickyNotification('error', res.error);
          return;
        }
      }
      Populator.hideAsyncNotification();
      if (payload !== undefined) {
        Populator.showStickyNotification(
          'success',
          'Password changed successfully',
        );
      } else {
        Populator.showStickyNotification(
          'success',
          'Please check your email for your new password',
        );
      }
    })
    .catch((err) => {
      console.log(err);
      Populator.hideAsyncNotification();
      throw new Error();
    });
};

const forgotPasswordForm = document.querySelector('#forgot-password-form');

forgotPasswordForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const email = forgotPasswordForm.email.value;
  const presentPassword = forgotPasswordForm['present-password'].value;
  const newPassword = forgotPasswordForm['new-password'].value;
  let payload;

  if (!Helpers.isEmail(String(email).toLowerCase())) {
    Populator.showStickyNotification('error', 'Please enter a valid email');
    return;
  }

  if (presentPassword.length > 0 || newPassword.length > 0) {
    if (presentPassword.length < 8) {
      Populator.showNotification(
        'The present password length is too short. please enter at least 8 characters',
      );
      return;
    }
    if (newPassword.length < 8) {
      Populator.showNotification(
        'The new password length is too short. please enter at least 8 characters',
      );
      return;
    }
    const pattern = /^[\w._]+$/;
    if (!pattern.test(presentPassword)) {
      Populator.showNotification('Invalid password characters detected in your present password');
      return;
    }

    if (!pattern.test(newPassword)) {
      Populator.showNotification('Invalid password characters detected in your new password');
      return;
    }
    if (String(presentPassword).trim() === String(newPassword).trim()) {
      Populator.showNotification(
        'New password cannot be changed to old password',
      );
      return;
    }
    payload = JSON.stringify({
      password: presentPassword,
      newPassword,
    });
  }
  // Form validation ends here

  // Api calls
  Populator.hideStickyNotification();

  resetPassword(email, payload);
});
