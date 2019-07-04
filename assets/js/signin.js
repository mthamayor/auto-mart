/* eslint-disable no-undef */
const signInForm = document.querySelector('#sign-in-form');

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

const logIn = (payload) => {
  const endpoint = 'https://mthamayor-auto-mart.herokuapp.com/api/v1/auth/signin';
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
      Populator.showNotification('Sign in successful, logging in');
      localStorage.setItem('user', JSON.stringify(response.data));
      setTimeout(() => {
        window.location.replace('dashboard.html');
      }, 3000);
    })
    .catch((err) => {
      Populator.hideAsyncNotification();
      Populator.showNotification('Internet error occured. please try again');
      console.log(err);
    });
};

signInForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const email = signInForm.email.value;
  const password = signInForm.password.value;

  // Form validation
  if (!Helpers.isEmail(String(email).toLowerCase())) {
    Populator.showStickyNotification('error', 'Please enter a valid email');
    return;
  }

  if (password.length <= 0) {
    Populator.showStickyNotification('error', 'Please enter a password');
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
    email: String(email).toLowerCase(),
    password,
  };
  payload = JSON.stringify(payload);

  Populator.showAsyncNotification();

  logIn(payload);
});
