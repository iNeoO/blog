import { AsyncLocalStorage } from 'node:async_hooks';
import type { PinoLogger } from 'hono-pino';

export const loggerStorage = new AsyncLocalStorage<PinoLogger>();

export const getLoggerStore = () => {
  const logger = loggerStorage.getStore();
  if (!logger) {
    throw new Error('Logger not found in AsyncLocalStorage');
  }
  return logger;
};
