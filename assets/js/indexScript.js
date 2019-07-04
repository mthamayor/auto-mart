/* eslint-disable no-undef */
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
