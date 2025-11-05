import type { Octokit } from "@octokit/core";
import { octokit } from "../clients/octokit.client";
import type {
  GithubOrder,
  GithubSort,
  ScoredRepoItem,
} from "../types/github.types";

const SCORE_WEIGHTS = {
  stars: Number(process.env.SCORE_W_STARS ?? 0.3),
  forks: Number(process.env.SCORE_W_FORKS ?? 0.6),
  recency: Number(process.env.SCORE_W_RECENCY ?? 0.1),
} as const;
const HALF_LIFE_DAYS = Number(process.env.SCORE_HALF_LIFE_DAYS ?? 30);

const getGithubRepos = async (
  client: Octokit,
  createdAt: string,
  language: string,
  query: string,
  sort: GithubSort | undefined,
  order: GithubOrder | undefined,
  perPage: number,
  page: number
) => {
  const sanitize = (s: string) =>
    s.replace(/\s+/g, " ").replace(/[^\w\s:\-"'\/.]/g, "");
  const additionalQuery =
    query.trim().length > 0 ? `+${sanitize(query.trim())}` : "";

  try {
    return await client.request("GET /search/repositories", {
      q: `language:${language}+created:>=${createdAt}${additionalQuery}`,
      ...(sort ? { sort } : {}),
      ...(order ? { order } : {}),
      ...(perPage ? { per_page: perPage } : {}),
      ...(page ? { page } : {}),
      headers: { "X-GitHub-Api-Version": "2022-11-28" },
    });
  } catch (e: any) {
    if (e.status === 403) {
      throw new Error(
        e.response.data.message ||
          "GitHub Validation failed, or the endpoint has been spammed"
      );
    }
    if (e.status === 503) throw new Error("GitHub Service Unavailable");
    throw e;
  }
};

export const calculatePopularityScore = (
  starsCount: number,
  forksCount: number,
  pushedAt: string,
  now: Date,
  halfLifeDays = HALF_LIFE_DAYS
): number => {
  const pushedSinceDays =
    (now.getTime() - new Date(pushedAt).getTime()) / (1000 * 60 * 60 * 24);
  const stars = Math.log1p(starsCount);
  const forks = Math.log1p(forksCount);
  const recency = Math.exp(-pushedSinceDays / halfLifeDays) * 10;

  const score =
    SCORE_WEIGHTS.stars * stars +
    SCORE_WEIGHTS.forks * forks +
    SCORE_WEIGHTS.recency * recency;

  return Number(score.toFixed(4));
};

export const searchAndScoreGithubRepos = async function (
  createdAt: string,
  language: string,
  query: string = "",
  sort: GithubSort | undefined,
  order: GithubOrder | undefined,
  perPage: number = 10,
  page: number = 1
): Promise<ScoredRepoItem[]> {
  const res = await getGithubRepos(
    octokit,
    createdAt,
    language,
    query,
    sort,
    order,
    perPage,
    page
  );

  const now = new Date();

  const repos = res.data.items.map((repo) => {
    return {
      ...repo,
      popularityScore: calculatePopularityScore(
        repo.stargazers_count,
        repo.forks_count,
        repo.pushed_at,
        now
      ),
    };
  });

  return sort
    ? repos
    : repos.sort((a, b) => b.popularityScore - a.popularityScore);
};
