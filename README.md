# StashIt Cloud

Save, search, and share your content intelligently — with AI-powered semantic search and shareable links.

## Why This Exists

This is the cloud-native evolution of [stash-it](https://github.com/dcs-soni/stash-it), which used a self-hosted ChromaDB instance running in Docker on EC2. While that worked, it meant managing infrastructure for the vector database yourself.

**StashIt Cloud** replaces that with [Chroma Cloud](https://trychroma.com) — a managed vector database — so there's nothing to self-host. The UI has also been redesigned from scratch with a modern, polished interface.

|            | stash-it                      | stashit-cloud                        |
| ---------- | ----------------------------- | ------------------------------------ |
| Vector DB  | ChromaDB (self-hosted Docker) | Chroma Cloud (managed)               |
| Backend    | Express                       | Fastify                              |
| Frontend   | Basic React UI                | Redesigned React UI                  |
| Deployment | EC2 + Nginx + PM2             | AWS Lambda + CloudFront (serverless) |

## Tech Stack

**Backend** — Fastify, TypeScript, MongoDB, Chroma Cloud, JWT auth  
**Frontend** — React 18, Vite, TypeScript, TailwindCSS  
**Infrastructure** — Terraform, AWS Lambda, API Gateway, S3, CloudFront

## Getting Started

**Prerequisites:** Node.js 18+, pnpm, MongoDB instance, [Chroma Cloud](https://trychroma.com) account

```bash
pnpm install

# API environment (local development)
cp api/.env.example api/.env
# Fill in your credentials in api/.env

# Docker Compose environment (only if using Docker)
cp .env.example .env
```

### Environment Variables

The API loads `api/.env` via `dotenv` at runtime:

```env
DATABASE_URL=your-mongodb-connection-string
JWT_SECRET=your-jwt-secret
CHROMA_TENANT=your-chroma-tenant
CHROMA_DATABASE=your-chroma-database
CHROMA_API_KEY=your-chroma-api-key
OPENAI_API_KEY=your-openai-api-key
```

The root `.env` is only used by Docker Compose for MongoDB and Mongo Express credentials.

### Development

```bash
pnpm dev        # Run both frontend and backend
pnpm dev:api    # Backend only  → http://localhost:3000
pnpm dev:web    # Frontend only → http://localhost:5173
```

## API Endpoints

| Method | Endpoint              | Description        |
| ------ | --------------------- | ------------------ |
| POST   | `/api/v1/signup`      | User registration  |
| POST   | `/api/v1/signin`      | User login         |
| GET    | `/api/v1/content`     | Get user content   |
| POST   | `/api/v1/content`     | Add content        |
| DELETE | `/api/v1/delete/:id`  | Delete content     |
| POST   | `/api/v1/stash`       | Toggle share link  |
| GET    | `/api/v1/stash/:hash` | Get shared content |
| POST   | `/api/v1/search`      | Semantic search    |
