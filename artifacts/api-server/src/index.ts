import app from "./app";
import { logger } from "./lib/logger";

if (!process.env.GROQ_API_KEY) {
  logger.error("FATAL: GROQ_API_KEY is missing from environment. Exiting.");
  process.exit(1);
}

const rawPort = process.env["PORT"] ?? "3000";
const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

const host = process.env.HOST ?? "0.0.0.0";

app.listen(port, host, () => {
  logger.info({ host, port }, "Server listening");
});
