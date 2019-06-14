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
  if (process.env.NODE_ENV !== 'production') {
    imageUrl = faker.image.imageUrl();
    return imageUrl;
  }
  const imageFilePath = image.path;

  await uploader.upload(imageFilePath, (err, result) => {
    if (err) {
      imageUrl = -1;
    }
    imageUrl = result.secure_url;
  });

  return imageUrl;
};
export default imageUploader;
