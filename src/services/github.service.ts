export async function searchAndScoreGithubRepos(
  createdAt: string,
  language: string,
  query: string = ""
) {
  return { createdAt, language, query };
}
