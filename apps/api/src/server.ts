import cors from "cors";
import express from "express";
import { fileURLToPath } from "node:url";
import ingestRouter from "./routes/ingest.js";
import reviewRouter from "./routes/review.js";
import startupsRouter from "./routes/startups.js";

export function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true });
  });

  app.use("/api", startupsRouter);
  app.use("/api", ingestRouter);
  app.use("/api", reviewRouter);
  return app;
}

const port = Number(process.env.API_PORT ?? process.env.PORT ?? 3001);
const isEntrypoint = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isEntrypoint) {
  createApp().listen(port, () => {
    console.log(`API listening on http://localhost:${port}`);
  });
}
