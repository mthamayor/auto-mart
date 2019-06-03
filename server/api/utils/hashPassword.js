import bcrypt from 'bcryptjs';

const hashPassword = (password) => {
  // Hash and encrypt password
  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(
    saltRounds,
  );
  const hash = bcrypt.hashSync(
    password,
    salt,
  );
  return hash;
};

export default hashPassword;
