/**
 * Cron configuration (node-cron)
 */
import cron from 'node-cron';

export const everyHour = (task: () => Promise<void>): void => {
  cron.schedule('0 * * * *', () => {
    task().catch(() => undefined);
  });
};
