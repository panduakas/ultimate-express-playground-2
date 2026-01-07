/**
 * Signal entity (Sequelize Model)
 */
import { DataTypes, Model, Optional } from 'sequelize';

import { sequelize } from '../config/database.config.js';

export type SignalType = 'buy' | 'sell' | 'hold';

export interface SignalAttributes {
  id: number;
  symbol: string;
  timeframeMin: number;
  time: Date;
  signal: SignalType;
  predictedPrice: number;
  strategyScores: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type SignalCreationAttributes = Optional<SignalAttributes, 'id' | 'createdAt' | 'updatedAt'>;

export class Signal
  extends Model<SignalAttributes, SignalCreationAttributes>
  implements SignalAttributes
{
  declare id: number;
  declare symbol: string;
  declare timeframeMin: number;
  declare time: Date;
  declare signal: SignalType;
  declare predictedPrice: number;
  declare strategyScores: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Signal.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    symbol: { type: DataTypes.STRING(32), allowNull: false },
    timeframeMin: { type: DataTypes.INTEGER, allowNull: false },
    time: { type: DataTypes.DATE, allowNull: false },
    signal: { type: DataTypes.STRING(8), allowNull: false },
    predictedPrice: { type: DataTypes.DOUBLE, allowNull: false },
    strategyScores: { type: DataTypes.TEXT, allowNull: false }
  },
  {
    sequelize,
    tableName: 'signals',
    indexes: [{ fields: ['symbol', 'timeframeMin', 'time'], unique: true }]
  }
);
