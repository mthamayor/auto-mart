/* eslint-disable no-undef */
const signUpForm = document.querySelector('#sign-up-form');

signUpForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const email = signUpForm.email.value;
  const firstName = signUpForm['first-name'].value;
  const lastName = signUpForm['last-name'].value;
  const address = signUpForm.address.value;
  const password = signUpForm.password.value;

  // Validation starts here
  if (email.length <= 0) {
    Populator.showNotification('Please enter a valid email');
    return;
  }
  if (firstName.length <= 0) {
    Populator.showNotification('Please enter a valid first name');
    return;
  }
  if (lastName.length <= 0) {
    Populator.showNotification('Please enter a valid last name');
    return;
  }
  if (address.length <= 0 || address.length >= 350) {
    Populator.showNotification('Not more than 350 characters allowed for address');
    return;
  }
  if (password.length <= 8) {
    Populator.showNotification('The password length is too short. please enter at least 8 characters');
    return;
  }
  const pattern = /^[\w._]+$/;
  if (!pattern.test(password)) {
    Populator.showNotification('Invalid password characters detected');
    return;
  }
  // Validation ends here


  // Api calls
  Populator.showAsyncNotification();

  setTimeout(() => { Populator.hideAsyncNotification(); }, 3000);
});
