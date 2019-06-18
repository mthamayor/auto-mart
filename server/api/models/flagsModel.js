import { query } from '../config/pool';

export const clearFlags = async () => {
  const queryText = 'DELETE FROM flags';
  const queryResult = await query(queryText);
  return queryResult;
};

export default clearFlags;
