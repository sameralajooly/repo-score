import { Router } from "express";
import { scoreRepos } from "../controllers/github.controller.js";

const router = Router();

router.get("/score", scoreRepos);

export default router;
