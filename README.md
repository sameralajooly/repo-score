# Repo Score API

A lightweight Express + TypeScript service that fetches GitHub repositories and calculates a custom popularity score based on stars, forks, and recent activity.

---

## Popularity Formula

Each repository’s popularity is calculated as:

```
popularity_score = (0.3 × log(1 + stars)) + (0.6 × log(1 + forks)) + (0.1 × recency)
```

where
`recency = exp(-days_since_push / halfLifeDays) * 10`

Weights and half-life can be customized with environment variables.

---

## Setup

### 1. Clone and install

```
git clone https://github.com/sameralajooly/repo-score.git
cd repo-score
npm install
```

### 2. Environment variables

Rename the file `.env.sample` to `.env` and set the values as desired:

```
PORT=3000
SCORE_W_STARS=0.3
SCORE_W_FORKS=0.6
SCORE_W_RECENCY=0.1
SCORE_HALF_LIFE_DAYS=30
```

### 3. Development

```
npm run dev
```

Server runs on `http://localhost:3000`.

---

## API Endpoints

### GET /github/score

Fetch and score repositories from GitHub.

#### Query Parameters

| Name      | Type   | Required | Description                                                                                                                                    |
| --------- | ------ | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| createdAt | string | Yes      | Repositories created since this date (YYYY-MM-DD)                                                                                              |
| language  | string | Yes      | Language filter (e.g., typescript)                                                                                                             |
| q         | string | No       | Additional GitHub search query based on [GitHub docs](https://docs.github.com/en/rest/search/search?apiVersion=2022-11-28#search-repositories) |
| sort      | enum   | No       | One of updated, stars, forks, help-wanted-issues                                                                                               |
| order     | enum   | No       | asc or desc                                                                                                                                    |
| perPage   | number | No       | Results per page (1–100)                                                                                                                       |
| page      | number | No       | Page index                                                                                                                                     |

#### Example

Call the endpoint (CLI)

```bash
curl -X GET "http://localhost:3000/github/score?createdAt=2024-01-01&language=typescript&sort=stars" \
  -H "Accept: application/json"
```

#### Response

```
[
  {
    "id": 12345,
    "full_name": "octocat/awesome-project",
    "html_url": "https://github.com/octocat/awesome-project",
    "stargazers_count": 500,
    "forks_count": 40,
    "pushed_at": "2025-10-30T12:00:00Z",
    "popularityScore": 12.84
  }
]
```

---

## Development Scripts

| Command                  | Description                             |
| ------------------------ | --------------------------------------- |
| npm run dev              | Start development server with tsx watch |
| npm run build            | Build for production using tsup         |
| npm start                | Run compiled app from dist              |
| npm run test             | Run all the tests using Vitest          |
| npm run test:unit        | Run all unit tests using Vitest         |
| npm run test:integration | Run all integration tests using Vitest  |
| npm run test:e2e         | Run all e2e tests using Vitest          |

---

## Testing

Vitest handles unit, integration, and e2e tests.

```
npm run test
```

---

## Tech Stack

| Area        | Library            |
| ----------- | ------------------ |
| Framework   | Express 5          |
| Language    | TypeScript         |
| Validation  | Zod                |
| HTTP Client | Octokit            |
| Security    | Helmet, Rate Limit |
| Testing     | Vitest             |
| Bundling    | tsup               |
| Dev Runner  | tsx                |
