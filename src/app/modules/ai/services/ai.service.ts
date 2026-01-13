import { ENV } from '../../../../variables.js';
import { connectMindsDB } from '../../../config/mindsdb.config.js';
export { connectMindsDB } from '../../../config/mindsdb.config.js';
import { MindsDbRepository } from '../repositories/mindsdb.repository.js';

export class AiService {
  constructor(private readonly mindsRepo: MindsDbRepository = new MindsDbRepository()) {}

  async trainMindsDbModel(
    params: { connection?: import('mysql2/promise').Connection } = {}
  ): Promise<void> {
    const connection = params.connection ?? (await connectMindsDB());
    await this.mindsRepo.ensureIntegration(connection);
    await this.mindsRepo.createOrRetrainModel(connection);
    if (!params.connection) {
      await connection.end();
    }
  }

  async predictNextPrice(
    params: { connection?: import('mysql2/promise').Connection; symbol?: string } = {}
  ): Promise<{ predicted: number; confidence: number }> {
    const connection = params.connection ?? (await connectMindsDB());
    await this.mindsRepo.ensureIntegration(connection);
    const symbol = params.symbol ?? ENV.INDODAX_PAIR;
    const result = await this.mindsRepo.predictNextPrice(connection, symbol);
    if (!params.connection) {
      await connection.end();
    }
    return result;
  }
}

export const trainMindsDbModel = async (
  params: { connection?: import('mysql2/promise').Connection } = {}
): Promise<void> => {
  const svc = new AiService();
  return svc.trainMindsDbModel(params);
};

export const predictNextPrice = async (
  params: { connection?: import('mysql2/promise').Connection; symbol?: string } = {}
): Promise<{ predicted: number; confidence: number }> => {
  const svc = new AiService();
  return svc.predictNextPrice(params);
};
