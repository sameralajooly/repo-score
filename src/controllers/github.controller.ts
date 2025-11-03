import type { Request, Response } from "express";
import { searchAndScoreGithubRepos } from "../services/github.service.js";

export async function scoreRepos(
  req: Request<{}, {}, {}, { createdAt: string; language: string; q?: string }>,
  res: Response
) {
  const createdAt = req.query.createdAt;
  const language = req.query.language;
  const query = req.query.q;

  if (!createdAt || !language)
    return res
      .status(400)
      .json({ error: "createdAt and language are required" });

  const data = await searchAndScoreGithubRepos(createdAt, language, query);
  res.status(200).json(data);
}
