import debug from 'debug';
import { HelperFunctions, ResponseHandler } from '../utils';
import { query } from '../config/pool';

const log = debug('automart');

/**
 * @class Flags
 * @description - Performs every flag related tasks
 * @exports Flags
 */
class Flags {
  /**
   * @method createFlag
   * @description - Flags advert
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @returns {object} - JSON Response
   */
  static async createFlag(req, res) {
    const { carId, reason, description } = req.body;

    const authData = req.authToken.data;
    const reporter = authData.id;

    const queryText = {
      name: 'insert-flag',
      text:
        'INSERT INTO flags(user_id, car_id, reason, description) '
        + 'VALUES($1, $2, $3, $4) '
        + 'RETURNING *',
      values: [
        reporter,
        parseInt(carId, 10),
        HelperFunctions.replaceAllWhitespace(reason),
        HelperFunctions.replaceAllWhitespace(description)],
    };
    let queryResult;
    try {
      queryResult = await query(queryText);
    } catch (err) {
      log(err.stack);
      ResponseHandler.error(res, 500, 'internal server error');
      return;
    }
    const flag = queryResult.rows[0];

    const data = {
      id: flag.id,
      user_id: flag.user_id,
      car_id: flag.car_id,
      reason: flag.reason,
      description: flag.description,
    };

    ResponseHandler.success(res, 201, data);
  }
}
export default Flags;
