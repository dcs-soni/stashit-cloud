// Shared between Lambda and local development

import Fastify, { FastifyInstance } from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import jwt from "@fastify/jwt";
import rateLimit from "@fastify/rate-limit";
import { config, initializeConfig } from "./config/index.js";
import { connectDatabase } from "./db/connection.js";
import { initializeChroma } from "./services/chroma.service.js";
import { authRoutes } from "./routes/auth.routes.js";
import { contentRoutes, publicContentRoutes } from "./routes/content.routes.js";
import { searchRoutes } from "./routes/search.routes.js";

export const createApp = (): FastifyInstance => {
  return Fastify({
    logger: {
      transport: config.isProduction ? undefined : { target: "pino-pretty" },
    },
    disableRequestLogging: config.isProduction,
  });
};

export const app = createApp();

const setupPlugins = async (): Promise<void> => {
  await app.register(helmet, { contentSecurityPolicy: false });

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

const setupRoutes = async (): Promise<void> => {
  app.get("/health", async () => ({
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: config.isProduction ? "production" : "development",
  }));

  await app.register(authRoutes);
  await app.register(publicContentRoutes);
  await app.register(contentRoutes);
  await app.register(searchRoutes);
};

// Initialization state
let isInitialized = false;

// Initialize application (safe to call multiple times)
export const init = async (): Promise<void> => {
  if (isInitialized) return;

  try {
    // Load secrets from AWS Secrets Manager (or env vars locally)
    await initializeConfig();
    console.log("Config initialized");

    await connectDatabase();
    console.log("MongoDB connected");

    await initializeChroma();
    console.log("Chroma initialized");

    await setupPlugins();
    await setupRoutes();

    isInitialized = true;
    console.log("Application initialized");
  } catch (error) {
    console.error("Failed to initialize:", error);
    throw error;
  }
};
