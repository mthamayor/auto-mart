/* eslint-disable no-undef */
const forgotPasswordForm = document.querySelector('#forgot-password-form');

forgotPasswordForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const password = forgotPasswordForm.password.value;

  if (password.length < 8) {
    Populator.showNotification(
      'The password length is too short. please enter at least 8 characters',
    );
    return;
  }
  const pattern = /^[\w._]+$/;
  if (!pattern.test(password)) {
    Populator.showNotification('Invalid password characters detected');
    return;
  }
  // Form validation ends here

  // Api calls
  Populator.showAsyncNotification();

  setTimeout(() => {
    Populator.hideAsyncNotification();
  }, 3000);
});
