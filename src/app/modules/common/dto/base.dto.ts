import { ZodSchema } from 'zod';

export class BaseDto {
  static schema: ZodSchema;

  constructor(data?: any) {
    if (data) {
      Object.assign(this, data);
    }
  }

  static sanitize<T>(this: { new (...args: any[]): T; schema: ZodSchema }, data: unknown): T {
    const schema = this.schema;
    if (!schema) {
      throw new Error('Schema not defined for this DTO');
    }
    return schema.parse(data);
  }
}
