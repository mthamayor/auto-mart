import { flagsHelper } from '../models';


const flags = {
  createFlag(req, res) {
    const {
      carId, reason, description,
    } = req.body;

    const authData = req.authToken.data;
    const reporter = authData.id;

    const fetchFlags = flagsHelper.getAllFlags();

    let id;
    if (fetchFlags.length === 0) {
      id = 1;
    } else {
      id = fetchFlags[fetchFlags.length - 1].id + 1;
    }

    flagsHelper.addFlag({
      id,
      userId: reporter,
      carId: parseInt(carId, 10),
      reason,
      description,
      createdOn: Date.now(),
    });

    const flag = flagsHelper.getFlag(id);

    res.status(201).send({
      status: 201,
      data: {
        id: flag.id,
        user_id: flag.userId,
        car_id: flag.carId,
        reason: flag.reason,
        description: flag.description,
      },
    });
  },
};
export default flags;
