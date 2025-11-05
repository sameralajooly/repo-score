import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import express from "express";
import { validateQuery } from "../../../src/middlewares/zod";
import { githubQuerySchema } from "../../../src/validations/github.queries";
import { errorHandler } from "../../../src/middlewares/errorHandler";

describe("validateQuery middleware", () => {
  let app: express.Express;

  beforeAll(() => {
    app = express();
    app.get("/score", validateQuery(githubQuerySchema), (req, res) =>
      res.json({ query: req.query })
    );
    app.use(errorHandler);
  });
  it("passes valid query and coerces types", async () => {
    const res = await request(app).get(
      "/score?createdAt=2024-01-01&language=TypeScript&perPage=10&page=2"
    );
    expect(res.status).toBe(200);
  });

  it("rejects invalid date format", async () => {
    const res = await request(app).get(
      "/score?createdAt=01-01-2024&language=TS"
    );
    expect(res.status).toBe(400);
  });

  it("rejects unexpected query keys", async () => {
    const res = await request(app).get(
      "/score?createdAt=2024-01-01&language=TS&extra=value"
    );
    expect(res.status).toBe(400);
  });
});
