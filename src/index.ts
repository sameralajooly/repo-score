import express from "express";
import githubRouter from "./routes/github.routes";

const app = express();

app.use(express.json());

app.use("/github", githubRouter);

app.get("/health", (_req, res) => res.json({ ok: true }));

const port = 3000;
app.listen(port, () => {
  console.log(`Listening to Port ${port}`);
});
