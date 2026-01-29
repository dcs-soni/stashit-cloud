import Fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import rateLimit from "@fastify/rate-limit";
import { config } from "./config/index.js";
import { connectDatabase } from "./db/connection.js";
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
  await app.register(cors, {
    origin: [config.cors.origin, "http://localhost:5173"],
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
  await app.register(authRoutes);
  await app.register(publicContentRoutes);
  await app.register(contentRoutes);
  await app.register(searchRoutes);
};

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
