import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

export class BaseDto {
  constructor(data?: unknown) {
    if (data && typeof data === 'object') {
      Object.assign(this, data);
    }
  }

  static sanitize<T>(this: { new (...args: any[]): T }, data: unknown): T {
    const inst = plainToInstance(this as any, (data ?? {}) as object, {
      enableImplicitConversion: true
    }) as T;
    const errs = validateSync(inst as object, {
      whitelist: true,
      forbidUnknownValues: false
    });
    if (errs.length) {
      throw new Error('Validation error');
    }
    return inst;
  }
}
