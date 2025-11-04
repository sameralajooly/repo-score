import express from "express";
import { apiLimiter } from "./middlewares/rateLimit";
import githubRouter from "./routes/github.routes";
import { errorHandler } from "./middlewares/errorHandler";

export function buildApp() {
  const app = express();
  app.use(apiLimiter);
  app.use(express.json());
  app.use("/github", githubRouter);
  app.get("/health", (_req, res) => res.json({ ok: true }));
  app.use(errorHandler);
  return app;
}
