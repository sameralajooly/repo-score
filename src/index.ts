import { buildApp } from "./app";
const app = buildApp();
const port = process.env.PORT ?? 3000;
app.listen(port, () => {
  console.log(`Listening to Port ${port}`);
});
