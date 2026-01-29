import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import jwt from "@fastify/jwt";
import rateLimit from "@fastify/rate-limit";
import { config } from "./config/index.js";
import { connectDatabase, mongoose } from "./db/connection.js";
import { initializeChroma } from "./services/chroma.service.js";
import { authRoutes } from "./routes/auth.routes.js";
import { contentRoutes, publicContentRoutes } from "./routes/content.routes.js";
import { searchRoutes } from "./routes/search.routes.js";

const app = Fastify({
  logger: {
    transport: config.isProduction ? undefined : { target: "pino-pretty" },
  },
});

const setupPlugins = async () => {
  // Security headers
  await app.register(helmet);

  await app.register(cors, {
    origin: config.isProduction
      ? config.cors.origin
      : [config.cors.origin, "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  });

  await app.register(jwt, { secret: config.jwt.secret });

  await app.register(rateLimit, {
    max: 25,
    timeWindow: "1 hour",
    errorResponseBuilder: () => ({
      statusCode: 429,
      message: "Too many requests, please try again later",
    }),
  });
};

const setupRoutes = async () => {
  // Health check endpoint for load balancers
  app.get("/health", async () => ({
    status: "ok",
    timestamp: new Date().toISOString(),
  }));

  await app.register(authRoutes);
  await app.register(publicContentRoutes);
  await app.register(contentRoutes);
  await app.register(searchRoutes);
};

// Graceful shutdown handler
const shutdown = async (signal: string) => {
  console.log(`\n${signal} received. Shutting down gracefully...`);
  try {
    await app.close();
    await mongoose.connection.close();
    console.log("✅ Shutdown complete");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error during shutdown:", error);
    process.exit(1);
  }
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

const start = async () => {
  try {
    await connectDatabase();
    console.log("✅ MongoDB connected");

    await initializeChroma();

    await setupPlugins();
    await setupRoutes();

    await app.listen({ port: config.port, host: "0.0.0.0" });
    console.log(`🚀 Server running on port ${config.port}`);
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
};

start();
