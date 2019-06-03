import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  filename: (req, file, callback) => {
    callback(null, Date.now() + file.originalname);
  },
});
const fileFilter = (req, file, callback) => {
  const ext = path.extname(file.originalname);
  if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
    callback(new Error('Only images are allowed'));
    return;
  }
  callback(null, true);
};
const upload = multer({ storage, fileFilter }).array('imageArray', 10);

export default upload;
