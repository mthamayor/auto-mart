import { query, transaction } from '../config/pool';

export const getUser = async (id) => {
  const queryText = {
    name: 'fetch-user',
    text: 'SELECT * FROM users WHERE id = $1',
    values: [id],
  };
  const queryResult = await query(queryText);
  return queryResult.rows[0] || -1;
};

export const getUserByEmail = async (email) => {
  const queryText = {
    name: 'fetch-user-with-email',
    text: 'SELECT * FROM users WHERE email = $1',
    values: [email],
  };
  const queryResult = await query(queryText);
  return queryResult.rows[0] || -1;
};

export const removeAllUsers = async () => {
  const queryText = 'DELETE FROM users';
  const queryResult = await query(queryText);
  return queryResult;
};

export const setAdmin = async (id) => {
  const queryText = {
    name: 'set-admin',
    text: 'UPDATE users SET is_admin = $1 WHERE id = $2',
    values: [true, id],
  };
  const queryResult = await query(queryText);

  return queryResult;
};

export const changePassword = async (email, password) => {
  const queryText = {
    name: 'change-password',
    text: 'UPDATE users SET password = $1 WHERE email = $2',
    values: [password, email],
  };
  await transaction(queryText);
};
