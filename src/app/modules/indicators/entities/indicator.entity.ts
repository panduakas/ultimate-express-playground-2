/**
 * Indicator entity (Sequelize Model)
 */
import { DataTypes, Model, Optional } from 'sequelize';

import { sequelize } from '../../../config/database.config.js';

export interface IndicatorAttributes {
  id: number;
  symbol: string;
  timeframeMin: number;
  time: Date;
  name: string;
  value: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export type IndicatorCreationAttributes = Optional<
  IndicatorAttributes,
  'id' | 'createdAt' | 'updatedAt'
>;

export class Indicator
  extends Model<IndicatorAttributes, IndicatorCreationAttributes>
  implements IndicatorAttributes
{
  declare id: number;
  declare symbol: string;
  declare timeframeMin: number;
  declare time: Date;
  declare name: string;
  declare value: number;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Indicator.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    symbol: { type: DataTypes.STRING(32), allowNull: false },
    timeframeMin: { type: DataTypes.INTEGER, allowNull: false },
    time: { type: DataTypes.DATE, allowNull: false },
    name: { type: DataTypes.STRING(64), allowNull: false },
    value: { type: DataTypes.DOUBLE, allowNull: false }
  },
  {
    sequelize,
    tableName: 'indicators',
    indexes: [{ fields: ['symbol', 'timeframeMin', 'time', 'name'], unique: true }]
  }
);
