/* eslint-disable no-useless-escape */
/* eslint-disable no-undef */
const signUpForm = document.querySelector('#sign-up-form');

const getUser = localStorage.getItem('user');

if (
  !(
    getUser === null
    || getUser === undefined
    || getUser === 'undefined'
    || getUser === 'null'
  )
) {
  window.location.replace('dashboard.html');
}

const createAccount = (payload) => {
  const endpoint = 'https://mthamayor-auto-mart.herokuapp.com/api/v1/auth/signup';
  const fetchRequest = {
    method: 'POST',
    body: payload,
    headers: { 'Content-Type': 'application/json' },
  };

  fetch(endpoint, fetchRequest)
    .then(res => res.json())
    .then((response) => {
      Populator.hideAsyncNotification();
      if (response.error) {
        Populator.showStickyNotification('error', response.error);
        return;
      }
      Populator.showNotification('Sign up successful, logging in');
      localStorage.setItem('user', JSON.stringify(response.data));
      window.location.replace('dashboard.html');
    })
    .catch((err) => {
      Populator.hideAsyncNotification();
      Populator.showNotification('Internet error occured. please try again');
      console.log(err);
    });
};

signUpForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const email = signUpForm.email.value;
  const firstName = signUpForm['first-name'].value;
  const lastName = signUpForm['last-name'].value;
  const address = signUpForm.address.value;
  const password = signUpForm.password.value;

  // Validation starts here
  if (!Helpers.isEmail(String(email).toLowerCase())) {
    Populator.showStickyNotification('error', 'Please enter a valid email');
    return;
  }
  if (firstName.length <= 0) {
    Populator.showStickyNotification(
      'error',
      'Please enter a valid first name',
    );
    return;
  }
  if (lastName.length <= 0) {
    Populator.showStickyNotification('error', 'Please enter a valid last name');
    return;
  }
  if (address.length <= 0 || address.length >= 350) {
    Populator.showStickyNotification(
      'error',
      'Not more than 350 characters allowed for address',
    );
    return;
  }
  if (password.length <= 8) {
    Populator.showStickyNotification(
      'error',
      'The password length is too short. please enter at least 8 characters',
    );
    return;
  }
  const pattern = /^[\w._]+$/;
  if (!pattern.test(password)) {
    Populator.showStickyNotification(
      'error',
      'Invalid password characters detected',
    );
    return;
  }

  Populator.hideStickyNotification();
  // Validation ends here

  // Api calls
  let payload = {
    first_name: Helpers.capitalizeWords(firstName),
    last_name: Helpers.capitalizeWords(lastName),
    email: String(email).toLowerCase(),
    address: Helpers.capitalizeWords(address),
    password,
  };
  payload = JSON.stringify(payload);

  Populator.showAsyncNotification();

  createAccount(payload);
});
