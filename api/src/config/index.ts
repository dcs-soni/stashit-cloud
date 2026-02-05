import "dotenv/config";
import { getSecrets, type AppSecrets } from "../lib/secrets.js";

const staticConfig = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: parseInt(process.env.PORT ?? "3000", 10),
  isProduction: process.env.NODE_ENV === "production",
  cors: {
    origin: process.env.CORS_ORIGIN ?? "http://localhost:5173",
  },
};

// (loaded from Secrets Manager in Lambda, env vars locally)
let secretsConfig: {
  database: { url: string };
  jwt: { secret: string; expiresIn: string };
  chroma: { tenant: string; database: string; apiKey: string };
  openai: { apiKey: string };
} | null = null;

// Initialize secrets - must be called before accessing config.database, config.jwt, etc.
// Safe to call multiple times (returns cached value).

export async function initializeConfig(): Promise<void> {
  if (secretsConfig) return;

  const secrets = await getSecrets();

  secretsConfig = {
    database: { url: secrets.DATABASE_URL },
    jwt: { secret: secrets.JWT_SECRET, expiresIn: "7d" },
    chroma: {
      tenant: secrets.CHROMA_TENANT,
      database: secrets.CHROMA_DATABASE,
      apiKey: secrets.CHROMA_API_KEY,
    },
    openai: { apiKey: secrets.OPENAI_API_KEY },
  };
}

// Helper to ensure secrets are loaded
function requireSecrets() {
  if (!secretsConfig) {
    throw new Error("Config not initialized. Call initializeConfig() first.");
  }
  return secretsConfig;
}

// Unified config object
export const config = {
  ...staticConfig,

  get database() {
    return requireSecrets().database;
  },

  get jwt() {
    return requireSecrets().jwt;
  },

  get chroma() {
    return requireSecrets().chroma;
  },

  get openai() {
    return requireSecrets().openai;
  },
} as const;
