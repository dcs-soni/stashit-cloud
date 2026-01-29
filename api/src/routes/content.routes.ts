import type { FastifyInstance, FastifyRequest } from "fastify";
import {
  createContent,
  getUserContent,
  deleteContent,
  createShareLink,
  deleteShareLink,
  getSharedContent,
} from "../services/content.service.js";

interface AuthenticatedRequest extends FastifyRequest {
  user: { id: string };
}

const contentSchema = {
  body: {
    type: "object",
    required: ["title", "link", "type"],
    properties: {
      title: { type: "string" },
      link: { type: "string" },
      type: { type: "string" },
    },
  },
};

export const contentRoutes = async (app: FastifyInstance) => {
  app.addHook("onRequest", async (request, reply) => {
    try {
      await request.jwtVerify();
    } catch {
      return reply.status(401).send({ message: "Unauthorized" });
    }
  });

  app.post(
    "/api/v1/content",
    { schema: contentSchema },
    async (request, reply) => {
      const { title, link, type } = request.body as {
        title: string;
        link: string;
        type: string;
      };
      const userId = (request as AuthenticatedRequest).user.id;

      await createContent(title, link, type, userId);
      return { message: "Content added successfully" };
    },
  );

  app.get("/api/v1/content", async (request) => {
    const userId = (request as AuthenticatedRequest).user.id;
    const content = await getUserContent(userId);
    return { content };
  });

  app.delete("/api/v1/delete/:contentId", async (request, reply) => {
    const { contentId } = request.params as { contentId: string };
    const userId = (request as AuthenticatedRequest).user.id;

    const deleted = await deleteContent(contentId, userId);
    if (!deleted) {
      return reply
        .status(404)
        .send({ message: "Content not found or not authorized" });
    }
    return { message: "Content deleted successfully" };
  });

  app.post("/api/v1/stash", async (request, reply) => {
    const { share } = request.body as { share: boolean };
    const userId = (request as AuthenticatedRequest).user.id;

    if (share) {
      const hash = await createShareLink(userId);
      return { hash };
    }

    await deleteShareLink(userId);
    return { message: "Removed link" };
  });
};

export const publicContentRoutes = async (app: FastifyInstance) => {
  app.get("/api/v1/stash/:shareLink", async (request, reply) => {
    const { shareLink } = request.params as { shareLink: string };

    const result = await getSharedContent(shareLink);
    if (!result) {
      return reply.status(404).send({ message: "Invalid share link" });
    }

    return result;
  });
};
