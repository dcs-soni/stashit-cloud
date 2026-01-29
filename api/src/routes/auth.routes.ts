import type { FastifyInstance } from "fastify";
import {
  findUserByUsername,
  createUser,
  validateCredentials,
} from "../services/auth.service.js";

const signupSchema = {
  body: {
    type: "object",
    required: ["username", "password"],
    properties: {
      username: { type: "string", minLength: 4, maxLength: 25 },
      password: { type: "string", minLength: 6, maxLength: 25 },
    },
  },
};

const signinSchema = {
  body: {
    type: "object",
    required: ["username", "password"],
    properties: {
      username: { type: "string", minLength: 4, maxLength: 25 },
      password: { type: "string", minLength: 6, maxLength: 25 },
    },
  },
};

export const authRoutes = async (app: FastifyInstance) => {
  app.post(
    "/api/v1/signup",
    { schema: signupSchema },
    async (request, reply) => {
      const { username, password } = request.body as {
        username: string;
        password: string;
      };

      const existingUser = await findUserByUsername(username);
      if (existingUser) {
        return reply.status(411).send({ message: "Username already exists" });
      }

      await createUser(username, password);
      return reply.status(201).send({ message: "User successfully created" });
    },
  );

  app.post(
    "/api/v1/signin",
    { schema: signinSchema },
    async (request, reply) => {
      const { username, password } = request.body as {
        username: string;
        password: string;
      };

      const user = await validateCredentials(username, password);
      if (!user) {
        return reply.status(403).send({ message: "Incorrect credentials" });
      }

      const token = app.jwt.sign({ id: user._id.toString() });
      return { token };
    },
  );
};
