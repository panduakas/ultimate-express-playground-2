/**
 * MindsDB AI service
 */
import mysql, { type RowDataPacket } from 'mysql2/promise';

import { ENV } from '../../../variables.js';
import { connectMindsDB } from '../../config/mindsdb.config.js';
export { connectMindsDB } from '../../config/mindsdb.config.js';

const _integrationName = 'trading_db';
const _modelName = 'btc_price_model';

const _dbUrl = (): string => {
  const url = `mysql://${ENV.DB_USER}:${encodeURIComponent(ENV.DB_PASSWORD)}@${ENV.DB_HOST}:${ENV.DB_PORT}/${ENV.DB_NAME}`;
  return url;
};

const _ensureIntegration = async (conn: mysql.Connection): Promise<void> => {
  const url = _dbUrl();
  await conn.execute(
    `CREATE DATABASE IF NOT EXISTS ${_integrationName}
     WITH ENGINE = "mysql",
     PARAMETERS = { "url": "${url}" }`
  );
};

const _createOrRetrainModel = async (conn: mysql.Connection): Promise<void> => {
  await conn.execute(
    `CREATE MODEL IF NOT EXISTS mindsdb.${_modelName}
     FROM ${_integrationName}
       (SELECT symbol, time, open, high, low, close, volume
               FROM ${ENV.DB_NAME}.ohlcv)
     PREDICT close
     ORDER BY time
     GROUP BY symbol
     WINDOW 50
     USING engine = 'lightwood'`
  );
  await conn.execute(
    `ALTER MODEL mindsdb.${_modelName}
     RETRAIN FROM ${_integrationName}
       (SELECT symbol, time, open, high, low, close, volume
               FROM ${ENV.DB_NAME}.ohlcv)`
  );
};

export const trainMindsDbModel = async (conn?: mysql.Connection): Promise<void> => {
  const connection = conn ?? (await connectMindsDB());
  await _ensureIntegration(connection);
  await _createOrRetrainModel(connection);
  if (!conn) {
    await connection.end();
  }
};

export const predictNextPrice = async (
  conn?: mysql.Connection
): Promise<{ predicted: number; confidence: number }> => {
  const connection = conn ?? (await connectMindsDB());
  await _ensureIntegration(connection);
  const [rows] = await connection.execute<RowDataPacket[]>(
    `SELECT m.close as predicted, m.close_confidence as confidence
     FROM mindsdb.${_modelName} as m
     JOIN ${_integrationName}.${ENV.DB_NAME}.ohlcv as t
     WHERE t.time > LATEST AND t.symbol = '${ENV.INDODAX_PAIR}'
     LIMIT 1`
  );
  if (!conn) {
    await connection.end();
  }
  const row =
    Array.isArray(rows) && rows.length > 0
      ? (rows[0] as RowDataPacket & { predicted: number; confidence: number })
      : null;
  return {
    predicted: row?.predicted ?? NaN,
    confidence: row?.confidence ?? 0
  };
};
