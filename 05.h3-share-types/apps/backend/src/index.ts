import express from 'express';
import { z } from 'zod';
import { type RequestRoute, validateRequest } from './types.js';

const app = express();
const PORT = process.env.PORT || 3000;

const helloSchemas = {
  method: 'GET' as const,
  path: '/hello/:paramsId' as const,
  query: z.object({ greeting: z.string().optional(), name: z.string().optional() }),
  body: z.object({ hello: z.string() }),
  response: z.object({ message: z.string() }),
};

export type HelloRequest = RequestRoute<typeof helloSchemas>;

app.get(helloSchemas.path, (req, res) => {
  const r = validateRequest(helloSchemas, req);
  res.send(`Hello, ${r.query?.name || 'World'}!`);
});

app
  .listen(PORT, () => {
    console.log('Server running at PORT: ', PORT);
  })
  .on('error', (error) => {
    throw new Error(error.message);
  });
