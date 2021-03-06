/* eslint-disable no-await-in-loop */
import { Pool } from 'pg';
import debug from 'debug';
import db from './db';

const env = process.env.NODE_ENV || 'development';
const log = debug('database');
const connectionString = db[env];
const ssl = env === 'production';

const pool = new Pool({
  connectionString,
  ssl,
});

pool.on('connect', () => {
  log('connected to database...');
});

/**
   * @function query
   * @description - Queries a database
   * @param {string} req - Query string
   * @returns {object}
   */
export const query = async (queryText) => {
  try {
    const res = await pool.query(queryText);
    return res;
  } catch (err) {
    throw new Error(`error occured while quering database \n error details: \n ${err.stack}`);
  }
};

/**
   * @function transaction
   * @description - Performs a set of transactions on a database
   * @param {array} queries - Array of query strings
   */
export const transaction = async (...queries) => {
  // update to return values from all query
  const returnQueries = [];
  try {
    await pool.query('BEGIN');
    for (let i = 0; i < queries.length; i += 1) {
      const res = await pool.query(queries[i]);
      returnQueries.push(res);
    }
    await pool.query('COMMIT');
  } catch (err) {
    log('rolling back transaction...');
    await pool.query('ROLLBACK');
    log('transaction rolled back');
    throw new Error(
      `error occured performing db transaction \n error details: \n ${err.stack}`,
    );
  }
  return returnQueries;
};
export default pool;
