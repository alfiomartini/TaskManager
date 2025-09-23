# ==============================================================================
# Makefile for the TaskManager Project
#
# This Makefile centralizes common commands for Docker Compose and Kubernetes,
# simplifying development, deployment, and cleanup.
#
# Style Guide:
# - Use .PHONY for all targets that are actions, not files.
# - Use @ to hide the command being executed for a cleaner output.
# - Use variables for consistency (e.g., compose file names, image names).
# ==============================================================================

.DEFAULT_GOAL := help

# ==============================================================================
# Variables
# ==============================================================================

# Define Compose file names for clarity and easy modification.
COMPOSE_DEV_FILE := compose.dev.yaml
COMPOSE_PROD_FILE := compose.prod.yaml

# Define your Docker Hub username and image names.
# Update DOCKER_USER if it's different.
DOCKER_USER := armartini
LOCAL_API_IMG := taskmanager-api
LOCAL_FRONTEND_IMG := taskmanager-frontend
REMOTE_API_IMG := $(DOCKER_USER)/$(LOCAL_API_IMG)
REMOTE_FRONTEND_IMG := $(DOCKER_USER)/$(LOCAL_FRONTEND_IMG)

# Define the directory where Kubernetes manifests are stored.
K8S_DIR := kubernetes

# ==============================================================================
# Help Target
# ==============================================================================

.PHONY: help
help:
	@echo "Usage: make <target>"
	@echo ""
	@echo "Docker Compose (Development):"
	@echo "  dev                 - Build and start dev services (with hot-reloading)."
	@echo "  dev-start           - Start existing dev services without rebuilding."
	@echo "  dev-down            - Stop dev services."
	@echo "  dev-down-v          - Stop dev services and remove volumes (clears all data)."
	@echo "  dev-logs            - View logs from all dev services."
	@echo "  dev-logs-api        - View logs for the dev api service."
	@echo "  dev-logs-frontend   - View logs for the dev frontend service."
	@echo ""
	@echo "Docker Compose (Production Simulation):"
	@echo "  prod                - Pull latest images and start prod services."
	@echo "  prod-start          - Start existing prod services without pulling."
	@echo "  prod-down           - Stop prod services."
	@echo "  prod-down-v         - Stop prod services and remove volumes."
	@echo "  prod-logs           - View logs from prod services."
	@echo ""
	@echo "Docker Image Management (for Kubernetes):"
	@echo "  build               - Build api and frontend images with dev config."
	@echo "  tag                 - Tag locally built images for pushing to Docker Hub (e.g., :v2)."
	@echo "  push                - Push tagged images to Docker Hub."
	@echo ""
	@echo "Kubernetes (Minikube):"
	@echo "  kube-start          - Start the Minikube cluster."
	@echo "  kube-deploy         - Deploy app to Minikube (pulls images from Docker Hub)."
	@echo "  kube-down           - Delete all application resources from Minikube."
	@echo "  kube-logs-api       - View logs for the API pods."
	@echo "  kube-stop           - Stop the Minikube cluster."
	@echo "  kube-delete         - Delete the Minikube cluster entirely."
	@echo ""
	@echo "Cleanup (Docker Compose):"
	@echo "  clean-app-images    - Stop Compose services and remove only app images."
	@echo "  clean-app-images-v  - Stop Compose services, remove app images and their volumes."
	@echo "  clean               - Stop Compose services and prune unused Docker resources."
	@echo "  clean-v             - Stop Compose services and prune all unused Docker resources, including volumes."

# ==============================================================================
# Docker Compose Targets (Development)
# ==============================================================================

.PHONY: dev
dev:
	@echo "🚀 Building and starting Docker Compose services in development mode..."
	docker compose -f $(COMPOSE_DEV_FILE) up --build -d

.PHONY: dev-start
dev-start:
	@echo "🚀 Starting existing Docker Compose services in development mode..."
	docker compose -f $(COMPOSE_DEV_FILE) up -d

.PHONY: dev-down
dev-down:
	@echo "🔥 Stopping dev Docker Compose services..."
	-docker compose -f $(COMPOSE_DEV_FILE) down

.PHONY: dev-down-v
dev-down-v:
	@echo "💣 Stopping dev services and removing all volumes (data will be lost)..."
	-docker compose -f $(COMPOSE_DEV_FILE) down --volumes

.PHONY: dev-logs
dev-logs:
	@echo "📜 Following logs for all dev services... (Press Ctrl+C to stop)"
	docker compose -f $(COMPOSE_DEV_FILE) logs -f

.PHONY: dev-logs-api
dev-logs-api:
	@echo "📜 Following logs for dev api service... (Press Ctrl+C to stop)"
	docker compose -f $(COMPOSE_DEV_FILE) logs -f api

.PHONY: dev-logs-frontend
dev-logs-frontend:
	@echo "📜 Following logs for dev frontend service... (Press Ctrl+C to stop)"
	docker compose -f $(COMPOSE_DEV_FILE) logs -f frontend

# ==============================================================================
# Docker Compose Targets (Production Simulation)
# ==============================================================================

.PHONY: prod
prod:
	@echo "🚀 Starting Docker Compose services in production mode..."
	@echo "Pulling latest images for production..."
	docker compose -f $(COMPOSE_PROD_FILE) pull
	docker compose -f $(COMPOSE_PROD_FILE) up -d

.PHONY: prod-start
prod-start:
	@echo "🚀 Starting existing Docker Compose services in production mode..."
	docker compose -f $(COMPOSE_PROD_FILE) up -d

.PHONY: prod-down
prod-down:
	@echo "🔥 Stopping prod Docker Compose services..."
	-docker compose -f $(COMPOSE_PROD_FILE) down

.PHONY: prod-down-v
prod-down-v:
	@echo "💣 Stopping prod services and removing all volumes (data will be lost)..."
	-docker compose -f $(COMPOSE_PROD_FILE) down --volumes

.PHONY: prod-logs
prod-logs:
	@echo "📜 Following logs for prod services... (Press Ctrl+C to stop)"
	docker compose -f $(COMPOSE_PROD_FILE) logs -f

# ==============================================================================
# Docker Image Management (for Kubernetes workflow)
# ==============================================================================

.PHONY: build
build:
	@echo "🛠️  Building local Docker images from dev config..."
	docker compose -f $(COMPOSE_DEV_FILE) build

.PHONY: tag
tag: build
	@echo "🏷️  Tagging images for Docker Hub..."
	docker tag $(LOCAL_API_IMG):latest $(REMOTE_API_IMG):v2
	docker tag $(LOCAL_FRONTEND_IMG):latest $(REMOTE_FRONTEND_IMG):v2
	@echo "Images tagged as $(REMOTE_API_IMG):v2 and $(REMOTE_FRONTEND_IMG):v2"

.PHONY: push
push: tag
	@echo "⬆️  Pushing images to Docker Hub..."
	docker push $(REMOTE_API_IMG):v2
	docker push $(REMOTE_FRONTEND_IMG):v2
	@echo "To use these images, ensure your Kubernetes deployments point to the ':v2' tag."

# ==============================================================================
# Kubernetes (Minikube) Targets
# ==============================================================================

.PHONY: kube-start
kube-start:
	@if ! minikube status > /dev/null 2>&1; then \
		echo "🏁 Starting Minikube cluster..."; \
		minikube start; \
	else \
		echo "✅ Minikube is already running."; \
	fi

.PHONY: kube-deploy
kube-deploy: kube-start
	@echo "🚀 Deploying application to Minikube..."
	@echo "NOTE: This will pull images specified in the YAML files from Docker Hub."
	kubectl apply -f $(K8S_DIR)/

.PHONY: kube-down
kube-down:
	@echo "🔥 Deleting application resources from Minikube..."
	-kubectl delete -f $(K8S_DIR)/ --ignore-not-found=true

.PHONY: kube-logs-api
kube-logs-api:
	@echo "📜 Following logs for the API service... (Press Ctrl+C to stop)"
	kubectl logs -f -l service=api

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

.PHONY: clean
clean: dev-down prod-down
	@echo "🧹 Pruning unused Docker resources (containers, networks, images)..."
	docker system prune -a -f

.PHONY: clean-v
clean-v: dev-down-v prod-down-v
	@echo "💣 Pruning all unused Docker resources including volumes..."
	docker system prune -a -f --volumes

.PHONY: clean-app-images
clean-app-images: dev-down prod-down
	@echo "🧹 Removing application-specific Docker images..."
	-docker images | grep 'taskmanager' | awk '{print $$3}' | xargs -r docker rmi -f

.PHONY: clean-app-images-v
clean-app-images-v: dev-down-v prod-down-v
	@echo "💣 Removing application-specific Docker images and their associated volumes..."
	-docker images | grep 'taskmanager' | awk '{print $$3}' | xargs -r docker rmi -f