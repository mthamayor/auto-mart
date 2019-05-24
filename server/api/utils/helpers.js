import cloudinary from 'cloudinary';
import faker from 'faker';

const cloudinaryV2 = cloudinary.v2;

const helpers = {
  replaceAllWhitespace(word) {
    return word.replace(/\s+/g, ' ');
  },
  async uploadImage(image) {
    let imageUrl = '';
    if (process.env.NODE_ENV === 'test') {
      imageUrl = faker.image.imageUrl();
      return imageUrl;
    }
    cloudinaryV2.config({
      cloud_name: 'dservbsgp',
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const imageFilePath = image.path;

    await cloudinaryV2.uploader.upload(imageFilePath, (err, result) => {
      if (err) {
        imageUrl = -1;
      }
      imageUrl = result.secure_url;
    });

    return imageUrl;
  },
};

export default helpers;
