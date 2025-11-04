import { z } from "zod";

export const githubQuerySchema = z
  .object({
    createdAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "use YYYY-MM-DD"),
    language: z.string(),
    q: z.string().optional(),
    sort: z
      .enum(["updated", "stars", "forks", "help-wanted-issues"])
      .optional(),
    order: z.enum(["asc", "desc"]).optional(),
    perPage: z.coerce.number().int().min(1).max(100).optional(),
    page: z.coerce.number().int().min(1).optional(),
  })
  .strict();
