# ==============================================================================
# Makefile for the TaskManager Project
#
# This Makefile centralizes common commands for both Docker Compose and
# Kubernetes workflows, simplifying development and deployment.
# ==============================================================================

# Variables
# Define the directory where Kubernetes manifests are stored.
K8S_DIR := kubernetes
# Define your Docker Hub username and image names for pushing/pulling.
# Update DOCKER_USER if it's different.
DOCKER_USER := armartini
API_IMG := $(DOCKER_USER)/taskmanager-api
FRONTEND_IMG := $(DOCKER_USER)/taskmanager-frontend

# Define Compose file names
COMPOSE_DEV_FILE := compose.dev.yaml
COMPOSE_PROD_FILE := compose.prod.yaml

# Default target to display help.
.PHONY: help
help:
	@echo "Usage: make <target>"
	@echo ""
	@echo "Docker Compose Targets (Development):"
	@echo "  dev                 - Build and start dev services (with hot-reloading)."
	@echo "  dev-start           - Start existing dev services without rebuilding."
	@echo "  dev-down            - Stop dev services."
	@echo "  dev-down-v          - Stop dev services and remove volumes (clears all data)."
	@echo "  dev-logs            - View logs from dev services."
	@echo "  dev-logs-api        - View logs for the dev api service."
	@echo "  dev-logs-frontend   - View logs for the dev frontend service."
	@echo "  dev-logs-mongo      - View logs for the dev mongo service."
	@echo ""
	@echo "Docker Compose Targets (Production Simulation):"
	@echo "  prod                - Build and start prod services."
	@echo "  prod-start          - Start existing prod services without rebuilding."
	@echo "  prod-down           - Stop prod services."
	@echo "  prod-down-v         - Stop prod services and remove volumes."
	@echo "  prod-logs           - View logs from prod services."
	@echo ""
	@echo "Docker Image Management (for remote deployments):"
	@echo "  build               - Build the api and frontend images using dev config."
	@echo "  push                - Push the api and frontend images to Docker Hub."
	@echo ""
	@echo "Kubernetes (Minikube) Targets:"
	@echo "  kube-up             - Build images locally and deploy the application to Minikube."
	@echo "  kube-deploy         - Deploy to Minikube using pre-built images from Docker Hub."
	@echo "  kube-down           - Delete all application resources from Minikube."
	@echo "  kube-logs-api       - View logs for the API pods."
	@echo "  kube-logs-frontend  - View logs for the frontend pods."
	@echo ""
	@echo "Minikube Management:"
	@echo "  kube-start          - Start the Minikube cluster."
	@echo "  kube-stop           - Stop the Minikube cluster."
	@echo "  kube-delete         - Delete the Minikube cluster entirely."
	@echo ""
	@echo "Cleanup:"
	@echo "  clean               - A more aggressive cleanup, stops services and prunes Docker."

# ==============================================================================
# Docker Compose Targets (Development)
# ==============================================================================

# Start all services in detached mode with hot-reloading for development.
.PHONY: dev
dev:
	@echo "🚀 Starting Docker Compose services in development mode..."
	docker compose -f $(COMPOSE_DEV_FILE) up --build -d

.PHONY: dev-start
dev-start:
	@echo "🚀 Starting existing Docker Compose services in development mode..."
	docker compose -f $(COMPOSE_DEV_FILE) up -d

# Stop and remove containers, networks defined in compose.yaml.
.PHONY: dev-down
dev-down:
	@echo "🔥 Stopping dev Docker Compose services..."
	docker compose -f $(COMPOSE_DEV_FILE) down

# Stop services and remove named volumes. This is a destructive action.
.PHONY: dev-down-v
dev-down-v:
	@echo "💣 Stopping dev services and removing all volumes (data will be lost)..."
	docker compose -f $(COMPOSE_DEV_FILE) down --volumes

# Follow logs for all running services.
.PHONY: dev-logs
dev-logs:
	@echo "📜 Following logs for dev services... (Press Ctrl+C to stop)"
	docker compose -f $(COMPOSE_DEV_FILE) logs -f

.PHONY: dev-logs-api
dev-logs-api:
	@echo "📜 Following logs for dev api service... (Press Ctrl+C to stop)"
	docker compose -f $(COMPOSE_DEV_FILE) logs -f api

.PHONY: dev-logs-frontend
dev-logs-frontend:
	@echo "📜 Following logs for dev frontend service... (Press Ctrl+C to stop)"
	docker compose -f $(COMPOSE_DEV_FILE) logs -f frontend

.PHONY: dev-logs-mongo
dev-logs-mongo:
	@echo "📜 Following logs for dev mongo service... (Press Ctrl+C to stop)"
	docker compose -f $(COMPOSE_DEV_FILE) logs -f mongo

# ==============================================================================
# Docker Compose Targets (Production Simulation)
# ==============================================================================

.PHONY: prod
prod:
	@echo "🚀 Starting Docker Compose services in production mode..."
	docker compose -f $(COMPOSE_PROD_FILE) up --build -d

.PHONY: prod-start
prod-start:
	@echo "🚀 Starting existing Docker Compose services in production mode..."
	docker compose -f $(COMPOSE_PROD_FILE) up -d

.PHONY: prod-down
prod-down:
	@echo "🔥 Stopping prod Docker Compose services..."
	docker compose -f $(COMPOSE_PROD_FILE) down

.PHONY: prod-down-v
prod-down-v:
	@echo "💣 Stopping prod services and removing all volumes (data will be lost)..."
	docker compose -f $(COMPOSE_PROD_FILE) down --volumes

.PHONY: prod-logs
prod-logs:
	@echo "📜 Following logs for prod services... (Press Ctrl+C to stop)"
	docker compose -f $(COMPOSE_PROD_FILE) logs -f

# ==============================================================================
# Docker Image Management
# ==============================================================================

# Build local Docker images for the api and frontend.
.PHONY: build
build:
	@echo "🛠️  Building local Docker images from dev config..."
	docker compose -f $(COMPOSE_DEV_FILE) build

# Push the api and frontend images to Docker Hub.
.PHONY: push
push: build
	@echo "⬆️  Pushing images to Docker Hub..."
	docker push $(API_IMG):latest
	docker push $(FRONTEND_IMG):latest
	@echo "To use these images, update the image tags in your Kubernetes deployments."

# ==============================================================================
# Kubernetes (Minikube) Targets
# ==============================================================================

# Build images locally and deploy to Minikube. Ideal for local testing.
.PHONY: kube-up
kube-up: kube-start
	@echo "🎯 Pointing Docker client to Minikube's Docker daemon..."
	@eval $$(minikube -p minikube docker-env)
	@echo "🛠️  Building images directly inside Minikube (using dev config)..."
	docker compose -f $(COMPOSE_DEV_FILE) build
	@echo "🚀 Deploying application to Minikube from local build..."
	kubectl apply -f $(K8S_DIR)/

# Deploy to Minikube using images from a remote registry (e.g., Docker Hub).
.PHONY: kube-deploy
kube-deploy: kube-start
	@echo "🚀 Deploying application to Minikube from remote images..."
	@echo "Ensure your deployment YAMLs point to the correct remote image tags."
	kubectl apply -f $(K8S_DIR)/

# Delete all Kubernetes resources defined in the manifests.
.PHONY: kube-down
kube-down:
	@echo "🔥 Deleting application resources from Minikube..."
	kubectl delete -f $(K8S_DIR)/ --ignore-not-found=true

.PHONY: kube-logs-api
kube-logs-api:
	@echo "📜 Following logs for the API service... (Press Ctrl+C to stop)"
	kubectl logs -f -l service=api

.PHONY: kube-logs-frontend
kube-logs-frontend:
	@echo "📜 Following logs for the frontend service... (Press Ctrl+C to stop)"
	kubectl logs -f -l service=frontend

# ==============================================================================
# Minikube Management Targets
# ==============================================================================

# Start the Minikube cluster if it's not already running.
.PHONY: kube-start
kube-start:
	@if ! minikube status > /dev/null 2>&1; then \
		echo "🏁 Starting Minikube cluster..."; \
		minikube start; \
	else \
		echo "✅ Minikube is already running."; \
	fi

.PHONY: kube-stop
kube-stop:
	@echo "🛑 Stopping Minikube cluster..."
	minikube stop

.PHONY: kube-delete
kube-delete:
	@echo "💣 Deleting Minikube cluster entirely..."
	minikube delete

# ==============================================================================
# Cleanup Targets
# ==============================================================================

# A more aggressive cleanup: stops compose services and prunes unused Docker resources.
.PHONY: clean
clean: dev-down prod-down
	@echo "🧹 Pruning unused Docker resources (containers, networks, images)..."
	docker system prune -a -f
