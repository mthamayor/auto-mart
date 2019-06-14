import { flagsHelper } from '../models';
import { HelperFunctions, ResponseHandler } from '../utils';

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
  static createFlag(req, res) {
    const { carId, reason, description } = req.body;

    const authData = req.authToken.data;
    const reporter = authData.id;

    const fetchFlags = flagsHelper.getAllFlags();

    let id;
    if (fetchFlags.length === 0) {
      id = 1;
    } else {
      id = flagsHelper.getLastFlag().id + 1;
    }

    flagsHelper.addFlag({
      id,
      userId: reporter,
      carId: parseInt(carId, 10),
      reason: HelperFunctions.replaceAllWhitespace(reason),
      description: HelperFunctions.replaceAllWhitespace(description),
      createdOn: Date.now(),
    });

    const flag = flagsHelper.getFlag(id);

    const data = {
      id: flag.id,
      user_id: flag.userId,
      car_id: flag.carId,
      reason: flag.reason,
      description: flag.description,
    };

    ResponseHandler.success(res, 201, data);
  }
}
export default Flags;
