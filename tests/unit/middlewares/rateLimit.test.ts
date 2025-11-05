import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import express from "express";
import { apiLimiter } from "../../../src/middlewares/rateLimit";

describe("apiLimiter", () => {
  let app: express.Express;

  beforeEach(() => {
    app = express();
    app.use(apiLimiter);
    app.get("/test", (_req, res) => res.json({ ok: true }));
  });

  it("allows requests under the limit", async () => {
    const res = await request(app).get("/test");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true });
  });

  it("blocks when exceeding the limit", async () => {
    for (let i = 0; i < 101; i++) {
      await request(app).get("/test");
    }
    const blocked = await request(app).get("/test");
    expect(blocked.status).toBe(429);
    expect(blocked.body.message).toBe("Too many requests");
  });
});
