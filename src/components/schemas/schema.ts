// src/lib/schemas/approval-schema.ts (ឬ file ណាដែលសមស្រប)
import { z } from "zod";
export const schema = z.object({
  id: z.number(),
  header: z.string(),
  type: z.string(),
  status: z.string(),
  target: z.string(),
  limit: z.string(),
  reviewer: z.string(),
});

export type SchemaType = z.infer<typeof schema>;