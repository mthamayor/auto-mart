const signUpForm = document.querySelector("#sign-up-form");

signUpForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const email = signUpForm['email'].value;
  const firstName = signUpForm['first-name'].value;
  const lastName = signUpForm['last-name'].value;
  const address = signUpForm['address'].value;
  const password = signUpForm['password'].value;

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
  if (address.length <= 0) {
    Populator.showNotification('Please enter a valid address');
    return;
  }
  if (password.length <= 4) {
    Populator.showNotification('The password length is too short. please enter at least 5 characters');
    return;
  }
  // Validation ends here


  //Api calls
  Populator.showAsyncNotification();

  setTimeout(() => { Populator.hideAsyncNotification() }, 3000);

});