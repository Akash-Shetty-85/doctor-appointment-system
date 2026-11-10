import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { pinoHttp } from "pino-http";
import mongoose from "mongoose";

import { env } from "./config/env.js";

const app = express();

app.disable("x-powered-by");

app.use(helmet());

app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  }),
);

app.use(
  express.json({
    limit: "1mb",
  }),
);

app.use(
  express.urlencoded({
    extended: false,
    limit: "1mb",
  }),
);

app.use(pinoHttp());

app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 200,
    standardHeaders: "draft-8",
    legacyHeaders: false,
  }),
);

app.get("/api/v1/health", (_req, res) => {
  const databaseConnected = mongoose.connection.readyState === 1;

  res.status(databaseConnected ? 200 : 503).json({
    success: databaseConnected,
    message: databaseConnected
      ? "API and database are operational"
      : "API is running but the database is unavailable",
    data: {
      api: "ok",
      database: databaseConnected ? "connected" : "disconnected",
      environment: env.NODE_ENV,
    },
  });
});

export default app;
