import type { z } from "zod";
import type { UserSchema } from "./users.schema.js";

export type User = z.infer<typeof UserSchema>;
