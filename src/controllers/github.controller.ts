import type { Request, Response } from "express";
import { searchAndScoreGithubRepos } from "../services/github.service";
import type {
  GithubApiResponse,
  GithubRequestQuery,
} from "../types/github.types";

type ScoreReposResponse = GithubApiResponse[] | { error: string };

export async function scoreRepos(
  req: Request<{}, {}, {}, GithubRequestQuery>,
  res: Response<ScoreReposResponse>
) {
  const { createdAt, language, q, sort, order, perPage, page } = req.query;

  if (!createdAt || !language)
    return res
      .status(400)
      .json({ error: "createdAt and language are required" });

  const repos = await searchAndScoreGithubRepos(
    createdAt,
    language,
    q,
    sort,
    order,
    perPage,
    page
  );

  const data: GithubApiResponse[] = repos.map((r) => ({
    id: r.id,
    full_name: r.full_name,
    html_url: r.html_url,
    stargazers_count: r.stargazers_count,
    forks_count: r.forks_count,
    pushed_at: r.pushed_at,
    popularityScore: r.popularityScore,
  }));

  res.status(200).json(data);
}
