import type { Endpoints } from "@octokit/types";
import type { z } from "zod";
import type { githubQuerySchema } from "../validations/github.queries";

export type GithubSort = "updated" | "stars" | "forks" | "help-wanted-issues";
export type GithubOrder = "asc" | "desc";

export type GithubRequestQuery = z.infer<typeof githubQuerySchema>;

type RepoItem =
  Endpoints["GET /search/repositories"]["response"]["data"]["items"][number];

export type ScoredRepoItem = RepoItem & { popularityScore: number };

export type GithubApiResponse = Pick<
  ScoredRepoItem,
  | "id"
  | "full_name"
  | "html_url"
  | "stargazers_count"
  | "forks_count"
  | "pushed_at"
  | "popularityScore"
>;
