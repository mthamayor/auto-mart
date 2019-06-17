import faker from 'faker';
import uploader from '../config/cloudinary';

/**
 * @function imageUploader
 * @description - uploads images to cloudinary
 * @param {object} image - image to be uploaded
 * @exports imageUploader
 */
const imageUploader = async (image) => {
  let imageUrl = '';

  const imageFilePath = image.path;
  let imagePublicId = '';

  try {
    await uploader.upload(imageFilePath, (err, result) => {
      imageUrl = result.secure_url;
      imagePublicId = result.public_id;
    });

    // delete images after upload if test environment
    if (process.env.NODE_ENV === 'test') {
      await uploader.destroy(imagePublicId);
    }
  } catch (err) {
    ({ imageUrl } = faker.image.imageUrl());
  }

  return imageUrl;
};
export default imageUploader;
