'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('predictions', {
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
      predictedPrice: {
        type: Sequelize.DOUBLE,
        allowNull: false
      },
      modelName: {
        type: Sequelize.STRING(64),
        allowNull: false
      },
      confidence: {
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
    await queryInterface.addIndex('predictions', ['symbol', 'timeframeMin', 'time'], {
      unique: true,
      name: 'predictions_symbol_timeframe_time'
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('predictions');
  }
};
