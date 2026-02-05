// AWS Secrets Manager helper for Lambda
// This module loads secrets from AWS Secrets Manager at runtime

import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";

export interface AppSecrets {
  DATABASE_URL: string;
  JWT_SECRET: string;
  CHROMA_TENANT: string;
  CHROMA_DATABASE: string;
  CHROMA_API_KEY: string;
  OPENAI_API_KEY: string;
}

let cachedSecrets: AppSecrets | null = null;
const client = new SecretsManagerClient({});

/**
 * Loads secrets from AWS Secrets Manager.
 * Caches the result for the lifetime of the Lambda container.
 * Falls back to environment variables for local development.
 */
export async function getSecrets(): Promise<AppSecrets> {
  if (cachedSecrets) {
    return cachedSecrets;
  }

  const secretArn = process.env.AWS_SECRETS_ARN;

  if (!secretArn) {
    console.log("AWS_SECRETS_ARN not set - using environment variables");
    cachedSecrets = {
      DATABASE_URL: process.env.DATABASE_URL || "",
      JWT_SECRET: process.env.JWT_SECRET || "",
      CHROMA_TENANT: process.env.CHROMA_TENANT || "",
      CHROMA_DATABASE: process.env.CHROMA_DATABASE || "",
      CHROMA_API_KEY: process.env.CHROMA_API_KEY || "",
      OPENAI_API_KEY: process.env.OPENAI_API_KEY || "",
    };
    return cachedSecrets;
  }

  try {
    const command = new GetSecretValueCommand({ SecretId: secretArn });
    const response = await client.send(command);

    if (!response.SecretString) {
      throw new Error("Secret value is empty");
    }

    cachedSecrets = JSON.parse(response.SecretString) as AppSecrets;
    console.log("Secrets loaded from AWS Secrets Manager");
    return cachedSecrets;
  } catch (error) {
    console.error("Failed to load secrets from Secrets Manager:", error);
    throw new Error("Failed to load application secrets");
  }
}

export function clearSecretsCache(): void {
  cachedSecrets = null;
}
