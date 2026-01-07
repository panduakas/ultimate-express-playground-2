/**
 * Database configuration for Sequelize (MariaDB)
 */
import { Sequelize } from 'sequelize';

import { ENV } from '../../variables.js';

export const sequelize =
  ENV.NODE_ENV === 'test'
    ? new Sequelize({
        dialect: 'sqlite',
        storage: ':memory:',
        logging: false
      })
    : new Sequelize(ENV.DB_NAME, ENV.DB_USER, ENV.DB_PASSWORD, {
        host: ENV.DB_HOST,
        port: ENV.DB_PORT,
        dialect: 'mariadb',
        logging: false
      });

export const connectDatabase = async (): Promise<void> => {
  await sequelize.authenticate();
  await sequelize.sync();
};
