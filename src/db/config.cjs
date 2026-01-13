try {
  require('dotenv-safe').config();
} catch {}

const common = {
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || null,
  database: process.env.DB_NAME || 'ultimate_trading_service',
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 3306),
  dialect: 'mariadb',
  logging: false
};

module.exports = {
  development: common,
  test: {
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false
  },
  production: common
};
