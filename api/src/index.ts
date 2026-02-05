// Entry point for running locally (not Lambda)

import { app, init } from "./app.js";
import { config } from "./config/index.js";
import { mongoose } from "./db/connection.js";

const shutdown = async (signal: string): Promise<void> => {
  console.log(`\n${signal} received. Shutting down gracefully...`);

  try {
    await app.close();
    await mongoose.connection.close();
    console.log("Shutdown complete");
    process.exit(0);
  } catch (error) {
    console.error("Error during shutdown:", error);
    process.exit(1);
  }
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

const start = async (): Promise<void> => {
  try {
    await init();

    await app.listen({ port: config.port, host: "0.0.0.0" });
    console.log(`Server running on http://localhost:${config.port}`);
    console.log(` Health: http://localhost:${config.port}/health`);
  } catch (error) {
    console.error("Failed to start:", error);
    process.exit(1);
  }
};

start();
