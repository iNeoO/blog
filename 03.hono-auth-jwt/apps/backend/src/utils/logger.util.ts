import pino from 'pino';
import pretty from 'pino-pretty';

const createPinoConfig = (): pino.LoggerOptions => {
  return {
    level: 'info',
    serializers: {
      err: pino.stdSerializers.err,
      req() {
        return {
          reqId: crypto.randomUUID(),
        };
      },
    },
  };
};

export const createLogger = (): pino.Logger => {
  const options = createPinoConfig();
  if (process.env.NODE_ENV === 'production') return pino(options);
  return pino(options, pretty());
};
