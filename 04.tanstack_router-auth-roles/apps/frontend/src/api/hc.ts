import type { AppType } from "backend/hc";
import { hc } from "hono/client";

export const client = hc<AppType>("/api");
