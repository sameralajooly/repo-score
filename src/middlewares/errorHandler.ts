import type { NextFunction, Request, Response } from "express";
import { ZodError, z } from "zod";

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof ZodError) {
    res.status(400).json({
      error: z.treeifyError(err),
    });
    return;
  } else if (err instanceof Error) {
    const error = err as Error & { statusCode?: number };
    console.error({
      message: error.message,
      stack: error.stack,
    });
    res.status(error.statusCode ?? 400).json({
      message: error.message,
    });
    return;
  }
  console.error({
    message: "Internal server error",
    error: err,
  });
  res.status(500).json({
    message: "Internal server error",
  });
};
