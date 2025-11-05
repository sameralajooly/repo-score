import { buildApp } from "./app";
import { config } from "./config";

const app = buildApp();
const port = config.port;
app.listen(port, () => {
  console.log(`Listening to Port ${port}`);
});
