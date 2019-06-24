/* eslint-disable no-undef */
const forgotPasswordForm = document.querySelector('#forgot-password-form');

forgotPasswordForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const email = forgotPasswordForm.email.value;

  // Form validation
  if (!Helpers.isEmail(email)) {
    Populator.showNotification('Please enter a valid email');
    return;
  }
  // Form validation ends here

  // Api calls
  Populator.showAsyncNotification();

  setTimeout(() => {
    Populator.hideAsyncNotification();
  }, 3000);
});
