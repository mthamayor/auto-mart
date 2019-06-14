/**
 * @class ResponseHandler
 * @description Returns the success or Error response with designated response code
 * @exports ResponseHandler
 */
class ResponseHandler {
  /**
   * @method success
   * @description - Sends success response to client
   * @param {object} res - Response object
   * @param {integer} status - Response status code
   * @param {object} data - Data to be passed to client
   */
  static success(res, status, data) {
    res.status(status).json({
      status,
      data,
    });
  }

  /**
   * @method error
   * @description - Sends error response to client
   * @param {object} res - Response object
   * @param {integer} status - Response status code
   * @param {object} data - Data to be passed to client
   */
  static error(res, status, error) {
    res.status(status).json({
      status,
      error,
    });
  }
}
export default ResponseHandler;
