import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

/**
 * @class HelperFunctions
 * @description Performs various operations on different data types
 * @exports HelperFunctions
 */
class HelperFunctions {
  /**
   * @method replaceAllWhitespace
   * @description - Replaces multiple whitespace of a string with a single space
   * @param {string} word - Data to be formatted
   * @return {boolean}
   */
  static replaceAllWhitespace(word) {
    return word.replace(/\s+/g, ' ');
  }

  /**
   * @method removeAllWhitespace
   * @description - Removes all whitespace of a string
   * @param {string} word - Data to be formatted
   */
  static removeAllWhitespace(word) {
    return word.replace(/\s+/g, '');
  }

  /**
   * @method validPassword
   * @description - Checks if a password is valid
   * @param {string} password - password to be checked
   * @returns {boolean}
   */
  static validPassword(password) {
    /* Password must not contain spaces
     Password length must be greater than 0
     */
    if (
      password.length <= 0
      || password.indexOf(' ') >= 0
    ) {
      return false;
    }

    return true;
  }

  /**
   * @method signToken
   * @description - uses JWT to sign tokens
   * @param {object} data - the token payload
   * @param {string} secret - Your JWT sectet
   * @param {object} options - the token additional options
   * @returns {string} - the token
   */
  static signToken(data, secret, options) {
    const token = jwt.sign(
      {
        data,
      },
      secret,
      options,
    );
    return token;
  }

  /**
   * @method hashPassword
   * @description - salts and encrypts password
   * @param {string} password - password to be encrypted
   * @returns {string} - the hashed password
   */
  static hashPassword(password) {
    // Hash and encrypt password
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);
    return hash;
  }
}

export default HelperFunctions;
