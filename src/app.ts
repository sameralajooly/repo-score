import express from "express";
import helmet from "helmet";
import { apiLimiter } from "./middlewares/rateLimit";
import githubRouter from "./routes/github.routes";
import { errorHandler } from "./middlewares/errorHandler";

export function buildApp() {
  const app = express();
  app.set("query parser", "simple");
  app.disable("x-powered-by");
  app.use(apiLimiter);
  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginResourcePolicy: { policy: "same-site" },
    })
  );
  app.use(express.json());
  app.use("/github", githubRouter);
  app.get("/health", (_req, res) => res.json({ ok: true }));
  app.use(errorHandler);
  return app;
}
