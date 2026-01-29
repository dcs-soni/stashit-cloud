import type { FastifyInstance, FastifyRequest } from "fastify";
import { searchContent } from "../services/search.service.js";

interface AuthenticatedRequest extends FastifyRequest {
  user: { id: string };
}

const searchSchema = {
  body: {
    type: "object",
    required: ["query"],
    properties: {
      query: { type: "string", minLength: 1 },
    },
  },
};

export const searchRoutes = async (app: FastifyInstance) => {
  app.addHook("onRequest", async (request, reply) => {
    try {
      await request.jwtVerify();
    } catch {
      return reply.status(401).send({ message: "Unauthorized" });
    }
  });

  app.post(
    "/api/v1/search",
    { schema: searchSchema },
    async (request, reply) => {
      const { query } = request.body as { query: string };
      const userId = (request as AuthenticatedRequest).user.id;

      if (!userId) {
        return reply.status(400).send({ message: "User ID is required" });
      }

      const results = await searchContent(query, userId);
      return results;
    },
  );
};
