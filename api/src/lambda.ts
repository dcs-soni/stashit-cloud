// Entry point for serverless execution

import awsLambdaFastify from "@fastify/aws-lambda";
import type { APIGatewayProxyEventV2, Context } from "aws-lambda";
import { app, init } from "./app.js";

// Create the proxy handler outside the main handler for Lambda container reuse
const proxy = awsLambdaFastify(app, {
  decorateRequest: true,
  decorationPropertyName: "awsLambda",
});

let isInitialized = false;

export const handler = async (
  event: APIGatewayProxyEventV2,
  context: Context,
) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    if (!isInitialized) {
      console.log("Cold start - initializing...");
      const startTime = Date.now();

      await init();
      isInitialized = true;

      console.log(`Cold start complete in ${Date.now() - startTime}ms`);
    }

    return proxy(event, context);
  } catch (error) {
    console.error("Lambda error:", error);

    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      isBase64Encoded: false,
      body: JSON.stringify({
        error: "Internal Server Error",
        message:
          process.env.NODE_ENV === "production"
            ? "An unexpected error occurred"
            : String(error),
      }),
    };
  }
};

// Type extension for Lambda context in Fastify
declare module "fastify" {
  interface FastifyRequest {
    awsLambda?: {
      event: APIGatewayProxyEventV2;
      context: Context;
    };
  }
}
