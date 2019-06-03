/**
 *  Dummy db for purchase orders
 * @param {String} email the user email
 * @param {String} token token
 * @param {Date} expiresOn date the token expires
 */
const passwordReset = [];
export default passwordReset;

export const getRequest = email => passwordReset.find(reset => reset.email === email) || -1;
export const addRequest = request => passwordReset.push(request);
export const removeRequest = (email) => {
  for (let i = 0; i < passwordReset.length; i += 1) {
    if (passwordReset[i].email === email) {
      passwordReset.splice(i, 1);
      return 0;
    }
  }
  return -1;
};
// eslint-disable-next-line max-len
export const getRequestWithToken = token => passwordReset.find(reset => reset.token === token) || -1;
