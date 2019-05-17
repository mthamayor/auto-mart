const forgotPasswordForm = document.querySelector('#forgot-password-form');

forgotPasswordForm.addEventListener('submit', event => {
  event.preventDefault();
  const email = forgotPasswordForm['email'].value;

  // Form validation
  if (email.length <= 0) {
    Populator.showNotification('Please enter a valid email');
    return;
  }
  // Form validation ends here

  //Api calls
  Populator.showAsyncNotification();

  setTimeout(() => {
    Populator.hideAsyncNotification();
  }, 3000);
});
