import rateLimit, { ipKeyGenerator } from "express-rate-limit";

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests" },
  statusCode: 429,
  keyGenerator: (req) => ipKeyGenerator(String(req.ip)),
});
