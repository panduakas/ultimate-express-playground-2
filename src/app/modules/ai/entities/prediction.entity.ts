/**
 * Prediction entity (Sequelize Model)
 */
import { DataTypes, Model, Optional } from 'sequelize';

import { sequelize } from '../../../config/database.config.js';

export interface PredictionAttributes {
  id: number;
  symbol: string;
  timeframeMin: number;
  time: Date;
  predictedPrice: number;
  modelName: string;
  confidence: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export type PredictionCreationAttributes = Optional<
  PredictionAttributes,
  'id' | 'createdAt' | 'updatedAt'
>;

export class Prediction
  extends Model<PredictionAttributes, PredictionCreationAttributes>
  implements PredictionAttributes
{
  declare id: number;
  declare symbol: string;
  declare timeframeMin: number;
  declare time: Date;
  declare predictedPrice: number;
  declare modelName: string;
  declare confidence: number;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Prediction.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    symbol: { type: DataTypes.STRING(32), allowNull: false },
    timeframeMin: { type: DataTypes.INTEGER, allowNull: false },
    time: { type: DataTypes.DATE, allowNull: false },
    predictedPrice: { type: DataTypes.DOUBLE, allowNull: false },
    modelName: { type: DataTypes.STRING(64), allowNull: false },
    confidence: { type: DataTypes.DOUBLE, allowNull: false }
  },
  {
    sequelize,
    tableName: 'predictions',
    indexes: [{ fields: ['symbol', 'timeframeMin', 'time'], unique: true }]
  }
);
