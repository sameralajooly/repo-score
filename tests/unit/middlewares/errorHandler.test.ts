import { describe, it, expect } from "vitest";
import request from "supertest";
import express from "express";
import { errorHandler } from "../../../src/middlewares/errorHandler";
import { ZodError } from "zod";

function makeApp(failingHandler: express.RequestHandler) {
  const app = express();
  app.get("/test", failingHandler);
  app.use(errorHandler);
  return app;
}

describe("errorHandler", () => {
  it("handles ZodError with 400", async () => {
    const app = makeApp((_req, _res, next) => {
      next(
        new ZodError([{ path: ["field"], message: "Invalid", code: "custom" }])
      );
    });

    const res = await request(app).get("/test");
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("handles regular Error with custom statusCode", async () => {
    const app = makeApp((_req, _res, next) => {
      const err = new Error("Test Error") as Error & { statusCode?: number };
      err.statusCode = 418;
      next(err);
    });

    const res = await request(app).get("/test");
    expect(res.status).toBe(418);
    expect(res.body.message).toMatch("Test Error");
  });

  it("handles unknown error with 500", async () => {
    const app = makeApp((_req, _res, next) => next("something wrong" as any));
    const res = await request(app).get("/test");
    expect(res.status).toBe(500);
    expect(res.body.message).toMatch("Internal server error");
  });
});
