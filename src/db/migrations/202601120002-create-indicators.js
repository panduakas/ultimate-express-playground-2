'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('indicators', {
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
      name: {
        type: Sequelize.STRING(64),
        allowNull: false
      },
      value: {
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
    await queryInterface.addIndex('indicators', ['symbol', 'timeframeMin', 'time', 'name'], {
      unique: true,
      name: 'indicators_symbol_timeframe_time_name'
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('indicators');
  }
};
