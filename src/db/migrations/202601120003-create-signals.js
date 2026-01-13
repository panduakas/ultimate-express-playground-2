'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('signals', {
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
      signal: {
        type: Sequelize.STRING(8),
        allowNull: false
      },
      predictedPrice: {
        type: Sequelize.DOUBLE,
        allowNull: false
      },
      strategyScores: {
        type: Sequelize.TEXT,
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
    await queryInterface.addIndex('signals', ['symbol', 'timeframeMin', 'time'], {
      unique: true,
      name: 'signals_symbol_timeframe_time'
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('signals');
  }
};
