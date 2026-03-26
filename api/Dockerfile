# AWS Lambda Container - workspace-aware

FROM node:20-alpine AS deps

RUN corepack enable && corepack prepare pnpm@10.4.1 --activate

WORKDIR /app

# Workspace root files (lockfile, workspace config, root package.json)
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./

COPY api/package.json ./api/

RUN pnpm install --frozen-lockfile --filter api



FROM deps AS builder

COPY api/ ./api/

WORKDIR /app/api

RUN pnpm build

WORKDIR /app
RUN pnpm deploy --filter api --prod --legacy /app/deployed



FROM public.ecr.aws/lambda/nodejs:20 AS runner

ENV NODE_ENV=production

COPY --from=builder /app/api/dist ${LAMBDA_TASK_ROOT}/dist
COPY --from=builder /app/deployed/node_modules ${LAMBDA_TASK_ROOT}/node_modules
COPY --from=builder /app/deployed/package.json ${LAMBDA_TASK_ROOT}/

CMD ["dist/lambda.handler"]
