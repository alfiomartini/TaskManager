# Task Manager

This is the Task Manager, which includes both the frontend and backend services. The frontend is built with React and Vite, while the backend is built with Node.js and Express. The project uses MongoDB as the database.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Application Access](#application-access)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Installation

1. Clone the repository:

   ```bash
   git clone git@github.com:alfiomartini/TaskManager.git
   ```

2. **Set up Environment Variables**

   This project uses a `.env` file to manage secrets like JWT keys. To get started, copy the example file:

   ```bash
   cp .env.example .env
   ```

3. Open the new `.env` file and add your secret values. The `.env` file is ignored by Git, so your secrets will not be committed.

   - `JWT_SECRET`: A long, random string for signing authentication tokens.
   - `MONGO_USER` / `MONGO_PASSWORD`: These are the credentials for the **MongoDB database itself**. They are used to create the root database user. Your backend API and Mongo Express will use these to connect to the database.
   - `EXPRESS_USER` / `EXPRESS_PASSWORD`: These are for the **Mongo Express web interface login page**. They are completely separate from the database credentials and only protect access to the Mongo Express UI.

## Running the Application

You can run the entire application stack using either Docker Compose or Kubernetes (with Minikube).

### Option 1: Docker Compose (for Local Development)

This is the recommended method for local development, as it provides hot-reloading for code changes.

1.  **Start the services:**
    ```bash
    docker compose up --build
    ```
2.  **To stop the services:**
    - To stop and keep data: `docker compose down`
    - To stop and remove all data: `docker compose down --volumes`

### Option 2: Kubernetes with Minikube

This workflow demonstrates how to deploy the application to a local Kubernetes cluster.

1.  **Start Minikube:**
    ```bash
    minikube start
    ```
2.  **Point your Docker client to Minikube's daemon:** This crucial step ensures that when you build images, they are available inside the Minikube cluster.
    ```bash
    eval $(minikube docker-env)
    ```
3.  **Build the application images:** Use Docker Compose to build the `api` and `frontend` images. They will be built inside Minikube's environment.
    ```bash
    docker compose build
    ```
4.  **Apply the Kubernetes manifests:** This creates all the necessary Deployments, Services, and the PersistentVolumeClaim in your cluster.
    ```bash
    kubectl apply -f kubernetes/
    ```
5.  **Check pod status (optional):** Wait for all pods to be in the `Running` state.
    ```bash
    kubectl get pods -w
    ```
6.  **Access the application:** This command creates a tunnel to the frontend service and opens it in your browser.
    ```bash
    minikube service frontend
    ```
7.  **Open the Kubernetes Dashboard (optional):**
    ```bash
    minikube dashboard
    ```

## Application Access

- Frontend: The React application is available at http://localhost:5173.
- Backend API: The Node.js Express API is running at http://localhost:3000.
- Mongo Express: The database UI is available at http://localhost:8081.

## Project Structure

```bash
.
├── backend
│   ├── Dockerfile      # Backend service Docker image definition
│   └── src             # Node.js/Express source code
├── compose.yaml
├── frontend
│   ├── Dockerfile      # Frontend service Docker image definition
│   └── src             # React/Vite source code
├── kubernetes
│   ├── api-deployment.yaml
│   ├── api-service.yaml
│   ├── frontend-deployment.yaml
│   ├── frontend-service.yaml
│   ├── mongodb-data-persistentvolumeclaim.yaml
│   ├── mongo-deployment.yaml
│   ├── mongo-express-deployment.yaml
│   ├── mongo-express-service.yaml
│   └── mongo-service.yaml
├── .env.example        # Example environment variables
└── Readme.md
```
