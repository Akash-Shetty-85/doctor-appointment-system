import app from "./app.js";
import { env } from "./config/env.js";
import { connectDatabase } from "./config/database.js";

async function startServer(): Promise<void> {
  try {
    await connectDatabase();

    const server = app.listen(env.PORT, () => {
      console.log(
        `API running at http://localhost:${env.PORT}`,
      );
    });

    const shutdown = (signal: string) => {
      console.log(`${signal} received. Shutting down...`);

      server.close(() => {
        void import("mongoose").then(async ({ default: mongoose }) => {
          await mongoose.disconnect();
          process.exit(0);
        });
      });
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
  } catch (error) {
    console.error("Failed to start the server:", error);
    process.exit(1);
  }
}

void startServer();