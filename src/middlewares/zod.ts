import type { RequestHandler } from "express";
import type { ZodType } from "zod";

export const validateQuery =
  <Q>(schema: ZodType<Q>): RequestHandler<any, any, any, Q> =>
  (req, _res, next) => {
    const parsed = schema.safeParse(req.query);
    if (!parsed.success) return next(parsed.error);
    next();
  };
