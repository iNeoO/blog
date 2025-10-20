import type { NextFunction, Request, RequestHandler, Response } from 'express';
import type { ZodType, z } from 'zod';

type Route = {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  query?: ZodType;
  body?: ZodType;
  response: ZodType;
};

type RouteParams<RoutePath extends string> = string extends RoutePath
  ? Record<string, string>
  : RoutePath extends `${string}:${infer P}/${infer Rest}`
    ? { [K in P | keyof RouteParams<`/${Rest}`>]: string }
    : RoutePath extends `${string}:${infer P}`
      ? { [K in P]: string }
      : Record<string, never>;

export type RequestRoute<R extends Route> = Request<
  RouteParams<R['path']>,
  unknown,
  R['body'] extends ZodType ? z.input<R['body']> : unknown,
  R['query'] extends ZodType ? z.input<R['query']> : Record<string, unknown>
> & {
  validatedParams: RouteParams<R['path']>;
  validatedQuery?: z.output<Extract<R['query'], ZodType>>;
  validatedBody?: z.output<Extract<R['body'], ZodType>>;
};

type ValidatedRequest = Request & {
  validatedParams?: Record<string, string>;
  validatedQuery?: unknown;
  validatedBody?: unknown;
};

export function validationMiddleware(route: Route): RequestHandler {
  return (req: Request, _res: Response, next: NextFunction) => {
    const r = req as ValidatedRequest;

    try {
      if (route.query) r.validatedQuery = route.query.parse(req.query);
      if (route.body) r.validatedBody = route.body.parse(req.body);
      r.validatedParams = req.params as Record<string, string>;
      next();
    } catch (err) {
      next(err);
    }
  };
}

type Validated<R extends Route> = {
  params: RouteParams<R['path']>;
  query: R['query'] extends ZodType ? z.output<R['query']> : undefined;
  body: R['body'] extends ZodType ? z.output<R['body']> : undefined;
};

export function validateRequest<R extends Route>(route: R, req: Request<RouteParams<R['path']>>) {
  return {
    params: req.params as RouteParams<R['path']>,
    query: route.query ? route.query.parse(req.query) : undefined,
    body: route.body ? route.body.parse(req.body) : undefined,
  } as Validated<R>;
}
