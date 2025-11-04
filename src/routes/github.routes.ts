import { Router } from "express";
import { scoreRepos } from "../controllers/github.controller";
import { validateQuery } from "../middlewares/zod";
import { githubQuerySchema } from "../validations/github.queries";

const router = Router();

router.get("/score", validateQuery(githubQuerySchema), scoreRepos);

export default router;
