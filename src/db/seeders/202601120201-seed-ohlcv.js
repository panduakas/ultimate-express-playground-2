'use strict';

module.exports = {
  async up(queryInterface) {
    const now = new Date();
    const base = 10000;
    const rows = Array.from({ length: 10 }, (_, i) => ({
      symbol: 'BTCIDR',
      timeframeMin: 60,
      time: new Date(now.getTime() - (10 - i) * 60 * 1000),
      open: base + i,
      high: base + i + 10,
      low: base + i - 10,
      close: base + i + (i % 3),
      volume: 1 + i,
      createdAt: new Date(),
      updatedAt: new Date()
    }));
    await queryInterface.bulkInsert('ohlcv', rows);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('ohlcv', { symbol: 'BTCIDR', timeframeMin: 60 }, {});
  }
};
