# AWS Lambda Container

FROM node:20-alpine AS deps

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml* ./

RUN pnpm install --frozen-lockfile



FROM deps AS builder

COPY . .

RUN pnpm build

RUN pnpm prune --prod




FROM public.ecr.aws/lambda/nodejs:20 AS runner

ENV NODE_ENV=production

COPY --from=builder /app/dist ${LAMBDA_TASK_ROOT}/dist
COPY --from=builder /app/node_modules ${LAMBDA_TASK_ROOT}/node_modules
COPY --from=builder /app/package.json ${LAMBDA_TASK_ROOT}/

CMD ["dist/lambda.handler"]
