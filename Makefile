#   make dev      - Start development environment (hybrid)
#   make up       - Start full containerized environment
#   make down     - Stop all containers
#   make logs     - View logs
#   make clean    - Remove all containers and volumes

.PHONY: help dev up down logs clean build prod shell-api shell-web status restart

.DEFAULT_GOAL := help

YELLOW := \033[1;33m
GREEN := \033[1;32m
RED := \033[1;31m
NC := \033[0m # No Color

help:
	@echo ""
	@echo "$(GREEN)StashIt Cloud - Docker Commands$(NC)"
	@echo ""
	@echo "$(YELLOW)Development:$(NC)"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'
	@echo ""

dev: ## Start dev environment (API + MongoDB in Docker, run web natively)
	@echo "$(GREEN)Starting development services...$(NC)"
	@echo "$(YELLOW)Note: Run 'cd web && npm run dev' in another terminal for frontend$(NC)"
	docker compose -f docker-compose.dev.yml up --build

dev-d: ## Start dev environment in background
	@echo "$(GREEN)Starting development services in background...$(NC)"
	docker compose -f docker-compose.dev.yml up --build -d
	@echo "$(YELLOW)Run 'cd web && npm run dev' for frontend$(NC)"
	@echo "$(YELLOW)Run 'make logs-dev' to view logs$(NC)"

dev-tools: ## Start dev environment with MongoDB Express
	@echo "$(GREEN)Starting development services with tools...$(NC)"
	docker compose -f docker-compose.dev.yml --profile tools up --build

up: 
	@echo "$(GREEN)Starting all services...$(NC)"
	docker compose up --build

up-d: 
	@echo "$(GREEN)Starting all services in background...$(NC)"
	docker compose up --build -d

up-tools: ## Start full environment with MongoDB Express
	@echo "$(GREEN)Starting all services with tools...$(NC)"
	docker compose --profile tools up --build

prod: ## Start production environment (requires .env with production values)
	@echo "$(GREEN)Starting production services...$(NC)"
	docker compose -f docker-compose.prod.yml up -d

prod-build:
	@echo "$(GREEN)Building and starting production services...$(NC)"
	docker compose -f docker-compose.prod.yml up -d --build

prod-logs:
	docker compose -f docker-compose.prod.yml logs -f

prod-down:
	docker compose -f docker-compose.prod.yml down


logs: ## View all logs (follow mode)
	docker compose logs -f

logs-dev: 
	docker compose -f docker-compose.dev.yml logs -f

logs-api:
	docker compose logs -f api

logs-web:
	docker compose logs -f web

logs-db: 
	docker compose logs -f mongodb

build: ## Build all images
	@echo "$(GREEN)Building images...$(NC)"
	docker compose build

build-api: 
	docker compose build api

build-web:
	docker compose build web

build-no-cache:
	@echo "$(GREEN)Building images (no cache)...$(NC)"
	docker compose build --no-cache

down:
	@echo "$(YELLOW)Stopping containers...$(NC)"
	docker compose down
	docker compose -f docker-compose.dev.yml down 2>/dev/null || true

stop: ## Stop containers without removing them
	docker compose stop

clean: ## Remove all containers, volumes, and images
	@echo "$(RED)Removing all containers, volumes, and images...$(NC)"
	docker compose down -v --rmi local
	docker compose -f docker-compose.dev.yml down -v --rmi local 2>/dev/null || true

clean-volumes: ## Remove only volumes (keeps images)
	@echo "$(RED)Removing volumes...$(NC)"
	docker compose down -v
	docker compose -f docker-compose.dev.yml down -v 2>/dev/null || true

prune: ## Remove all unused Docker resources
	@echo "$(RED)Pruning Docker system...$(NC)"
	docker system prune -af --volumes

shell-api: 
	docker compose exec api sh

shell-web: 
	docker compose exec web sh

shell-db:
	docker compose exec mongodb mongosh -u $${MONGO_ROOT_USER:-root} -p $${MONGO_ROOT_PASSWORD:-password}


status:
	@echo "$(GREEN)Container Status:$(NC)"
	docker compose ps

health: 
	@echo "$(GREEN)Checking service health...$(NC)"
	@echo "\n$(YELLOW)API:$(NC)"
	@curl -s http://localhost:3000/health || echo "$(RED)API not responding$(NC)"
	@echo "\n$(YELLOW)Web:$(NC)"
	@curl -s http://localhost:80/health || echo "$(RED)Web not responding$(NC)"

restart:
	@echo "$(YELLOW)Restarting containers...$(NC)"
	docker compose restart

restart-api: 
	docker compose restart api

restart-web:
	docker compose restart web

db-seed: 
	docker compose exec api pnpm run db:seed

db-migrate: 
	docker compose exec api pnpm run db:migrate

db-backup:
	@echo "$(GREEN)Creating database backup...$(NC)"
	@mkdir -p ./backups
	docker compose exec mongodb mongodump -u $${MONGO_ROOT_USER:-root} -p $${MONGO_ROOT_PASSWORD:-password} --authenticationDatabase admin --out /tmp/backup
	docker compose cp mongodb:/tmp/backup ./backups/$(shell date +%Y%m%d_%H%M%S)
	@echo "$(GREEN)Backup saved to ./backups/$(NC)"

test: ## Run tests in Docker
	docker compose exec api pnpm test

test-watch: 
	docker compose exec api pnpm test:watch

lint:
	docker compose exec api pnpm lint
	docker compose exec web pnpm lint
