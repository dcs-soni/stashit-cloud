import "dotenv/config";

const requiredEnvVars = [
  "DATABASE_URL",
  "JWT_SECRET",
  "CHROMA_TENANT",
  "CHROMA_DATABASE",
  "CHROMA_API_KEY",
  "OPENAI_API_KEY",
] as const;

const validateEnv = (): void => {
  const missing = requiredEnvVars.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`,
    );
  }
};

validateEnv();

export const config = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: parseInt(process.env.PORT ?? "3000", 10),
  isProduction: process.env.NODE_ENV === "production",

  database: {
    url: process.env.DATABASE_URL!,
  },

  jwt: {
    secret: process.env.JWT_SECRET!,
    expiresIn: "7d",
  },

  chroma: {
    tenant: process.env.CHROMA_TENANT!,
    database: process.env.CHROMA_DATABASE!,
    apiKey: process.env.CHROMA_API_KEY!,
  },

  cors: {
    origin: process.env.CORS_ORIGIN ?? "http://localhost:5173",
  },

  openai: {
    apiKey: process.env.OPENAI_API_KEY!,
  },
} as const;
