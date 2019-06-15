import debug from 'debug';
import { transaction } from '../config/pool';
import {
  users, cars, orders, flags,
} from './tables';

const log = debug('database');

(async () => {
  try {
    log('migrating tables...');
    await transaction(users, cars, orders, flags);
    log('tables migrated successfully...');
  } catch (err) {
    log(err);
  }
})();
