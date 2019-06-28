import { HelperFunctions, ResponseHandler } from '../utils';
import { query } from '../config/pool';

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
        HelperFunctions.replaceAllWhitespace(description),
      ],
    };

    const queryResult = await query(queryText);

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

  /**
   * @method getCarFlags
   * @description - Flags advert
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @returns {object} - JSON Response
   */
  static async getCarFlags(req, res) {
    const carId = parseInt(req.params.car_id, 10);


    const queryText = {
      name: 'select-car-flags',
      text:
        'SELECT * FROM flags WHERE car_id = $1 ',
      values: [
        carId,
      ],
    };

    const queryResult = await query(queryText);

    const data = queryResult.rows;

    ResponseHandler.success(res, 200, data);
  }
}
export default Flags;
