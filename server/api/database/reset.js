import debug from 'debug';
import { transaction } from '../config/pool';
import dropTable from './helper';

const log = debug('database');

(async () => {
  try {
    log('dropping');
    await transaction(
      dropTable('users'),
      dropTable('cars'),
      dropTable('flags'),
      dropTable('orders'),
    );
    log('dropped all tables');
  } catch (err) {
    log(err);
  }
})();
