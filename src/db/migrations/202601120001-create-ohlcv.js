'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ohlcv', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      symbol: {
        type: Sequelize.STRING(32),
        allowNull: false
      },
      timeframeMin: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      time: {
        type: Sequelize.DATE,
        allowNull: false
      },
      open: {
        type: Sequelize.DOUBLE,
        allowNull: false
      },
      high: {
        type: Sequelize.DOUBLE,
        allowNull: false
      },
      low: {
        type: Sequelize.DOUBLE,
        allowNull: false
      },
      close: {
        type: Sequelize.DOUBLE,
        allowNull: false
      },
      volume: {
        type: Sequelize.DOUBLE,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      }
    });
    await queryInterface.addIndex('ohlcv', ['symbol', 'timeframeMin', 'time'], {
      unique: true,
      name: 'ohlcv_symbol_timeframe_time'
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('ohlcv');
  }
};
