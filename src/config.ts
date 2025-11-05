import "dotenv/config";

export const config = {
  port: Number(process.env.PORT ?? 3000),
  scoreWeights: {
    stars: Number(process.env.SCORE_W_STARS ?? 0.3),
    forks: Number(process.env.SCORE_W_FORKS ?? 0.6),
    recency: Number(process.env.SCORE_W_RECENCY ?? 0.1),
  },
  halfLifeDays: Number(process.env.SCORE_HALF_LIFE_DAYS ?? 30),
  githubToken: process.env.GITHUB_TOKEN,
};
