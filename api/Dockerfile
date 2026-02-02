FROM node:20-alpine AS deps

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml* ./

RUN pnpm install --frozen-lockfile




FROM deps AS builder

COPY . .

RUN pnpm build

RUN pnpm prune --prod




FROM node:20-alpine AS runner

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 fastify

WORKDIR /app

ENV NODE_ENV=production

ENV PORT=3000

COPY --from=builder --chown=fastify:nodejs /app/dist ./dist

COPY --from=builder --chown=fastify:nodejs /app/node_modules ./node_modules

COPY --from=builder --chown=fastify:nodejs /app/package.json ./

USER fastify

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

CMD ["node", "dist/index.js"]

