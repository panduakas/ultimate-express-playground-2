import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

export const parseQuery = <T>(cls: new () => T, obj: unknown): T => {
  const inst = plainToInstance(cls, obj as Record<string, unknown>, {
    enableImplicitConversion: true
  });
  const errs = validateSync(inst as object, {
    whitelist: true,
    forbidUnknownValues: false
  });
  if (errs.length) {
    throw new Error('Validation error');
  }
  return inst;
};
