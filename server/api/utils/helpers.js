const helpers = {
  replaceAllWhitespace(word) {
    return word.replace(/\s+/g, ' ');
  },
  validPassword(password) {
    if (password.indexOf(' ') >= 0) {
      return false;
    }
    if (password.length < 8) {
      return false;
    }
    const pattern = /^[\w._]+$/;
    if (!pattern.test(password)) {
      return false;
    }
    return true;
  },
};

export default helpers;
