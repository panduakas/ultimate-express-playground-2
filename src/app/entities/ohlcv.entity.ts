/**
 * OHLCV entity (Sequelize Model)
 */
import { DataTypes, Model, Optional } from 'sequelize';

import { sequelize } from '../config/database.config.js';

export interface OhlcvAttributes {
  id: number;
  symbol: string;
  timeframeMin: number;
  time: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export type OhlcvCreationAttributes = Optional<OhlcvAttributes, 'id' | 'createdAt' | 'updatedAt'>;

export class Ohlcv
  extends Model<OhlcvAttributes, OhlcvCreationAttributes>
  implements OhlcvAttributes
{
  declare id: number;
  declare symbol: string;
  declare timeframeMin: number;
  declare time: Date;
  declare open: number;
  declare high: number;
  declare low: number;
  declare close: number;
  declare volume: number;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Ohlcv.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    symbol: { type: DataTypes.STRING(32), allowNull: false },
    timeframeMin: { type: DataTypes.INTEGER, allowNull: false },
    time: { type: DataTypes.DATE, allowNull: false },
    open: { type: DataTypes.DOUBLE, allowNull: false },
    high: { type: DataTypes.DOUBLE, allowNull: false },
    low: { type: DataTypes.DOUBLE, allowNull: false },
    close: { type: DataTypes.DOUBLE, allowNull: false },
    volume: { type: DataTypes.DOUBLE, allowNull: false }
  },
  {
    sequelize,
    tableName: 'ohlcv',
    indexes: [{ fields: ['symbol', 'timeframeMin', 'time'], unique: true }]
  }
);
