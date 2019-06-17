import debug from 'debug';
import uploader from '../config/cloudinary';

const log = debug('automart');

/**
 * @function imageUploader
 * @description - uploads images to cloudinary
 * @param {object} image - image to be uploaded
 * @exports imageUploader
 */
const imageUploader = async (image) => {
  let imageUrl = '';

  const imageFilePath = image.path;

  await uploader.upload(imageFilePath, (err, result) => {
    if (err) {
      imageUrl = -1;
    }
    imageUrl = result.secure_url;
  });

  if (process.env.NODE_ENV !== 'production') {
    uploader.destroy(imageUrl, (result) => {
      log(result);
    });
  }

  return imageUrl;
};
export default imageUploader;
