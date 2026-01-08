import mysql, { type RowDataPacket } from 'mysql2/promise';

import { ENV } from '../../../../variables.js';

export class MindsDbRepository {
  private readonly integrationName = 'trading_db';
  private readonly modelName = 'btc_price_model';

  private dbUrl(): string {
    const url = `mysql://${ENV.DB_USER}:${encodeURIComponent(ENV.DB_PASSWORD)}@${ENV.DB_HOST}:${ENV.DB_PORT}/${ENV.DB_NAME}`;
    return url;
  }

  async ensureIntegration(conn: mysql.Connection): Promise<void> {
    const url = this.dbUrl();
    await conn.execute(
      `CREATE DATABASE IF NOT EXISTS ${this.integrationName}
       WITH ENGINE = "mysql",
       PARAMETERS = { "url": "${url}" }`
    );
  }

  async createOrRetrainModel(conn: mysql.Connection): Promise<void> {
    await conn.execute(
      `CREATE MODEL IF NOT EXISTS mindsdb.${this.modelName}
       FROM ${this.integrationName}
         (SELECT symbol, time, open, high, low, close, volume
                 FROM ${ENV.DB_NAME}.ohlcv)
       PREDICT close
       ORDER BY time
       GROUP BY symbol
       WINDOW 50
       USING engine = 'lightwood'`
    );
    await conn.execute(
      `ALTER MODEL mindsdb.${this.modelName}
       RETRAIN FROM ${this.integrationName}
         (SELECT symbol, time, open, high, low, close, volume
                 FROM ${ENV.DB_NAME}.ohlcv)`
    );
  }

  async predictNextPrice(
    conn: mysql.Connection,
    symbol: string
  ): Promise<{ predicted: number; confidence: number }> {
    const [rows] = await conn.execute<RowDataPacket[]>(
      `SELECT m.close as predicted, m.close_confidence as confidence
       FROM mindsdb.${this.modelName} as m
       JOIN ${this.integrationName}.${ENV.DB_NAME}.ohlcv as t
       WHERE t.time > LATEST AND t.symbol = ?
       LIMIT 1`,
      [symbol]
    );
    const row =
      Array.isArray(rows) && rows.length > 0
        ? (rows[0] as RowDataPacket & { predicted: number; confidence: number })
        : null;
    return {
      predicted: row?.predicted ?? NaN,
      confidence: row?.confidence ?? 0
    };
  }
}
