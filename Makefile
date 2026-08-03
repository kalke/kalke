SHELL := bash
.SHELLFLAGS := -eu -o pipefail -c

.DEFAULT_GOAL := help

AUTH_DIR ?= ../kalke-auth
PDE_DIR  ?= ../personal-document-extractor
COMPOSE  ?= docker compose
SITE_URL ?= http://localhost:5173

.PHONY: help setup up down destroy logs ps site auth-up pde-up

help: ## Show targets
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make <target>\n\nTargets:\n"} \
		/^[a-zA-Z0-9_-]+:.*?##/ { printf "  %-14s %s\n", $$1, $$2 }' $(MAKEFILE_LIST)

setup: ## Create local env files (auth, PDE, site) if missing
	@test -d "$(AUTH_DIR)" || { echo "Missing $(AUTH_DIR)"; exit 1; }
	@test -d "$(PDE_DIR)" || { echo "Missing $(PDE_DIR)"; exit 1; }
	@$(MAKE) -C "$(AUTH_DIR)" setup
	@$(MAKE) -C "$(PDE_DIR)" setup
	@if [ ! -f .env.local ]; then \
		cp .env.example .env.local; \
		echo "Created .env.local (local auth + PDE URLs; overrides .env)"; \
	else \
		echo ".env.local already exists"; \
	fi
	@npm install

auth-up: ## Start Keycloak + Auth BFF (:8443 / :8090)
	@$(MAKE) -C "$(AUTH_DIR)" up

pde-up: ## Start PDE API + Postgres + Redis (:8080)
	@$(MAKE) -C "$(PDE_DIR)" up

up: setup auth-up pde-up ## Start auth + PDE + Vite site (foreground)
	@echo ""
	@echo "Backends ready."
	@echo "  Auth BFF:  http://localhost:8090"
	@echo "  OIDC:      http://localhost:8443/realms/kalke"
	@echo "  PDE API:   http://localhost:8080"
	@echo "  Demo user: demo@kalke.local / DemoPass123!"
	@echo ""
	@echo "Starting site → $(SITE_URL)"
	@echo "  (Ctrl+C stops Vite only; backends keep running — make down to stop them)"
	@echo ""
	npm run dev

site: ## Start only the Vite site (backends must already be up)
	npm run dev

down: ## Stop auth + PDE stacks (keeps volumes)
	-@$(MAKE) -C "$(PDE_DIR)" down
	-@$(MAKE) -C "$(AUTH_DIR)" down

destroy: ## Stop stacks and delete Docker volumes
	-@$(MAKE) -C "$(PDE_DIR)" destroy
	-@$(MAKE) -C "$(AUTH_DIR)" destroy

logs: ## Follow auth + PDE logs
	@$(MAKE) -C "$(AUTH_DIR)" logs &
	@$(MAKE) -C "$(PDE_DIR)" logs

ps: ## Show container status
	@$(MAKE) -C "$(AUTH_DIR)" ps
	@$(MAKE) -C "$(PDE_DIR)" ps
