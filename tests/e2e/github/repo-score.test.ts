import { describe, it, beforeAll, afterAll, expect } from "vitest";
import request from "supertest";
import { buildApp } from "../../../src/app";
import http from "node:http";

describe("E2E GitHub repo score against live GitHub", () => {
  let server: http.Server;

  beforeAll(async () => {
    const app = buildApp();
    await new Promise<void>((resolve) => {
      server = app.listen(0, resolve as any);
    });
  });

  afterAll(async () => {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  });

  it("returns 200 and a reasonable payload", async () => {
    const agent = request(server);
    const res = await agent.get("/github/score").query({
      createdAt: "2024-10-01",
      language: "TypeScript",
      perPage: "5",
      page: "1",
    });

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    if (res.body.length > 0) {
      const r = res.body[0];
      expect(r).toHaveProperty("id");
      expect(r).toHaveProperty("full_name");
      expect(typeof r.popularityScore).toBe("number");
    }
  });

  it("validation failure returns 400", async () => {
    const agent = request(server);
    const res = await agent
      .get("/github/score")
      .query({ language: "TypeScript" });
    expect(res.status).toBe(400);
  });
});
