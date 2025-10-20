import { serve } from '@hono/node-server';
import app from './app.js';
import { setupOpenAPI } from './utils/openAPI.util.js';

setupOpenAPI(app);

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
