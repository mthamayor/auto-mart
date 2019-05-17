const signInForm = document.querySelector('#sign-in-form');

signInForm.addEventListener('submit', event => {
  event.preventDefault();
  const email = signInForm['email'].value;
  const password = signInForm['password'].value;

  // Form validation
  if (email.length <= 0) {
    Populator.showNotification('Please enter a valid email');
    return;
  }

  if (password.length <= 0) {
    Populator.showNotification('Please enter a password');
    return;
  }
  // Form validation ends here

  //Api calls
  Populator.showAsyncNotification();

  setTimeout(() => {
    Populator.hideAsyncNotification();
  }, 3000);
});
