/* eslint-disable no-undef */
const navigationMount = () => {
  const getUser = localStorage.getItem('user');
  if (
    (
      getUser === null
    || getUser === undefined
    || getUser === 'undefined'
    || getUser === 'null'
    )
  ) {
    try {
      Populator.populateContainer('navigation', mainNav);
    } catch (ex) {
      console.warn('Navigation container not found');
    }
  } else {
    try {
      Populator.populateContainer('navigation', loggedNav);
    } catch (ex) {
      console.warn('Navigation container not found');
    }
  }
};


navigationMount();

try {
  const signOutButton = document.querySelector('#sign-out-button');
  signOutButton.addEventListener('click', () => {
    Helpers.logout();
  });
} catch (ex) {
  console.warn('sign out button not found');
}