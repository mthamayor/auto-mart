/**
 *  Dummy db for flags
 * @param {number} id id of the reporter
 * @param {number} carId id of the advert
 * @param {string} reason reason the ad is being reported
 * @param {string} description detailed description
 *
 */
const dummyFlags = [];
export default dummyFlags;

export const addFlag = (flag) => {
  dummyFlags.push(flag);
};

export const getAllFlags = () => dummyFlags;

export const getFlag = id => dummyFlags.find(flag => flag.id === id) || -1;
