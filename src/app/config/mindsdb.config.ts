/**
 * MindsDB MySQL API client using mysql2
 */
import mysql from 'mysql2/promise';

import { ENV } from '../../variables.js';

export const connectMindsDB = async (): Promise<mysql.Connection> => {
  const conn = await mysql.createConnection({
    host: ENV.MINDSDB_HOST,
    port: ENV.MINDSDB_PORT,
    user: ENV.MINDSDB_USER,
    password: ENV.MINDSDB_PASSWORD,
    multipleStatements: true
  });
  return conn;
};
