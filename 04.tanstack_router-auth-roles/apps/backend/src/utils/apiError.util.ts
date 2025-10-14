import { HTTPException } from 'hono/http-exception';

type Cause = Record<string, unknown>;

type ErrorOptions = {
  cause?: Cause;
  res?: Response;
};

const MESSAGES = {
  BAD_REQUEST: 'Bad request',
  UNAUTHORIZED: 'Unauthorized',
  FORBIDDEN: 'Forbidden',
  NOT_FOUND: 'Not found',
  CONFLICT: 'Conflict',
  ZOD_ERROR: 'Zod error',
  SERVICE_NOT_AVAILABLE: 'Service not available',
};

const getParamsOptions = (status: number, message: string, options?: ErrorOptions) => {
  const params: { message: string; cause?: unknown } = { message };
  if (options?.cause) {
    params.cause = options.cause;
  }

  let res: Response;
  if (options?.res) {
    res = new Response(JSON.stringify({ ...params }), {
      status,
      headers: {
        ...Object.fromEntries(options.res.headers),
        'Content-Type': 'application/json',
      },
    });
  } else {
    res = new Response(JSON.stringify({ ...params }), {
      status: status,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  return { ...params, res };
};

export const HTTPException400BadRequest = (msg = MESSAGES.BAD_REQUEST, options?: ErrorOptions) => {
  const status = 400;
  const params = getParamsOptions(status, msg, options);
  return new HTTPException(status, params);
};

export const HTTPException401Unauthorized = (msg = MESSAGES.UNAUTHORIZED, options?: ErrorOptions) => {
  const status = 401;
  const params = getParamsOptions(status, msg, options);
  return new HTTPException(status, params);
};

export const HTTPException403Forbidden = (msg = MESSAGES.FORBIDDEN, options?: ErrorOptions) => {
  const status = 403;
  const params = getParamsOptions(status, msg, options);
  return new HTTPException(status, params);
};

export const HTTPException404NotFound = (msg = MESSAGES.NOT_FOUND, options?: ErrorOptions) => {
  const status = 404;
  const params = getParamsOptions(status, msg, options);
  return new HTTPException(status, params);
};

export const HTTPException500InternalServerError = (msg = MESSAGES.SERVICE_NOT_AVAILABLE, options?: ErrorOptions) => {
  const status = 500;
  const params = getParamsOptions(status, msg, options);
  return new HTTPException(status, params);
};
