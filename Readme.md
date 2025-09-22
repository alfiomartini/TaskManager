# Task Manager

This is the Task Manager, a full-stack application featuring a React frontend and a Node.js/Express backend, with MongoDB as the database. The project is fully containerized and includes configurations to run the entire stack on both Docker Compose for local development and Kubernetes (via Minikube) for a more robust deployment simulation.

<!-- TOC -->

- [Task Manager](#task-manager)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
    - [Option 1: Docker Compose (for Local Development)](#option-1-docker-compose-for-local-development)
    - [Option 2: Kubernetes with Minikube](#option-2-kubernetes-with-minikube)
  - [Project Structure](#project-structure)

<!-- /TOC -->

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
    This command builds the images if they don't exist and starts all services in the background.

    ```bash
    docker compose up --build -d
    ```

2.  **View logs:**
    To see the logs from all running services, use:

    ```bash
    docker compose logs [-f]
    ```

3.  **Access the application:**

    - Frontend: The React application is available at http://localhost:5173.
    - Backend API: The Node.js/Express API is available at http://localhost:3000.
    - Mongo Express: The database UI is available at http://localhost:8081.

4.  **View Logs for a Specific Service:**
    If you need to debug a specific part of the application, you can view the logs for an individual service:

    ```bash
    # View backend API logs
    docker compose logs [-f] api

    # View frontend logs
    docker compose logs [-f] frontend

    # View database logs
    docker compose logs [-f] mongo
    ```

5.  **Stop the services:**

    - **To stop the containers (preserving data):**
      This is the standard way to stop the application. Your database data and `node_modules` volumes will be kept.
      ```bash
      docker compose down
      ```
    - **To stop and remove all data (destructive):**
      Use this command if you want a completely fresh start. It will remove the containers, networks, and **all** volumes for this project, including your database.
      ```bash
      docker compose down --volumes
      ```

6.  **Updating Dependencies (Important):**
    Because this project isolates the container's `node_modules` for performance and stability, you must follow these steps whenever you add or remove a package in `package.json`:

    ```bash
    # 1. Stop the running containers
    docker compose down

    # 2. Remove only the dependency volumes to force a fresh `npm install`.
    # Note: The volume names are prefixed with your project directory name (e.g., taskmanager_...).
    docker volume rm taskmanager_api_node_modules taskmanager_frontend_node_modules

    # 3. Rebuild and restart the application
    docker compose up --build -d
    ```

### Option 2: Kubernetes with Minikube

This workflow demonstrates how to deploy the application to a local Kubernetes cluster.

1.  **Start Minikube:**
    ```bash
    minikube start
    ```
2.  **Create Kubernetes Secrets:**
    The Kubernetes deployment requires secrets to be stored in a `Secret` object, defined in `kubernetes/taskmanager-secrets.yaml`. Unlike Docker Compose which can read a `.env` file directly, Kubernetes requires all values in the `data` field of a secret to be Base64 encoded.

    First, open `kubernetes/taskmanager-secrets.yaml` to see the structure. You will need to generate a Base64 string for each of your secret values from your `.env` file.

    To encode a value, use the following command. The `-n` flag is important as it prevents `echo` from adding a newline character.

    ```bash
    # Example for encoding the mongo user 'admin'
    echo -n 'admin' | base64
    # Output: YWRtaW4=
    ```

    To decode and verify a value, use this command:

    ```bash
    # Example for decoding the string
    echo 'YWRtaW4=' | base64 --decode
    # Output: admin
    ```

    Run the encoding command for each of your secrets and paste the resulting strings into the appropriate fields in `kubernetes/taskmanager-secrets.yaml`.

3.  **Point your Docker client to Minikube's daemon:** This crucial step ensures that when you build images, they are available inside the Minikube cluster.
    ```bash
    eval $(minikube docker-env)
    ```
4.  **Build the application images:** Use Docker Compose to build the `api` and `frontend` images. They will be built inside Minikube's environment.
    ```bash
    docker compose build
    ```
5.  **Apply the Kubernetes manifests:** This creates all the necessary Deployments, Services, Secrets, and the PersistentVolumeClaim in your cluster.
    ```bash
    kubectl apply -f kubernetes/
    ```
6.  **Check pod status (optional):** Wait for all pods to be in the `Running` state.
    ```bash
    kubectl get pods -w
    ```
7.  **Access the application:**

    There are two ways to access the frontend service running in Minikube.

    **a) Via NodePort (Recommended for a stable URL)**

    This method exposes the service on a fixed port on the Minikube node's IP, providing a stable URL that doesn't require a command to be running in the foreground.

    1.  **Get the Minikube IP:**

        ```bash
        minikube ip
        ```

        This will return an IP address (e.g., `192.168.49.2`).

    2.  **Find the NodePort:** While the port is explicitly defined as **30100** in `kubernetes/frontend-service.yaml`, you can also find it by inspecting the running service. This is useful if you don't have the file handy or if the port were assigned automatically.

        Run the following command:

        ```bash
        kubectl get service frontend
        ```

        The output will show the port mapping. Look for the high-numbered port in the `PORT(S)` column:

        ```
        NAME       TYPE       CLUSTER-IP       EXTERNAL-IP   PORT(S)          AGE
        frontend   NodePort   10.107.180.124   <none>        5173:30100/TCP   ...
        ```

        In this example, `5173:30100/TCP` shows that the service is exposed on port **30100** on the node.

    3.  **Access the URL:** Combine the IP and port in your browser: `http://<MINIKUBE_IP>:30100`. For example: `http://192.168.49.2:30100`.

    **b) Via `minikube service` command (Development Tunnel)**

    This command is a convenient utility that tunnels traffic from your local machine directly to the service's internal `ClusterIP`. It runs as a foreground process in your terminal and automatically opens the correct URL in your browser. Because it's a temporary tunnel, the connection will close if you stop the command (e.g., with `Ctrl+C`).

    ```bash
    minikube service frontend
    ```

8.  **Open the Kubernetes Dashboard (optional):** This provides a web-based UI for your cluster.
    ```bash
    minikube dashboard
    ```

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
