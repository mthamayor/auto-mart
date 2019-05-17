try {
  Populator.populateContainer('navigation', loggedNav);
}
catch (ex) {
  console.log('Navigation container not found');
}