# Task Manager

This is the Task Manager, a full-stack application featuring a React frontend and a Node.js/Express backend, with MongoDB as the database. The project is fully containerized and includes configurations to run the entire stack on both Docker Compose for local development and Kubernetes (via Minikube) for a more robust deployment simulation.

<!-- TOC -->

- [Task Manager](#task-manager)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
    - [Option 1: Docker Compose (for Local Development)](#option-1-docker-compose-for-local-development)
    - [Option 2: Kubernetes with Minikube](#option-2-kubernetes-with-minikube)
    - [Option 3: Kubernetes with Helm](#option-3-kubernetes-with-helm)
      - [Helm Chart Configuration](#helm-chart-configuration)
  - [Helm Commands Reference](#helm-commands-reference)
    - [Installation and Deployment](#installation-and-deployment)
    - [Management and Updates](#management-and-updates)
    - [Debugging and Development](#debugging-and-development)
    - [Cleanup](#cleanup)
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

### Option 1: Docker Compose

You can run the application in either development or production mode using Docker Compose.

#### Development Mode (Recommended for Local Development)

This mode provides hot-reloading for code changes.

1.  **Start the services:**
    ```bash
    docker compose -f compose.dev.yaml up --build -d
    ```

2.  **View logs:**
    ```bash
    # All services
    docker compose -f compose.dev.yaml logs [-f]
    
    # Specific service
    docker compose -f compose.dev.yaml logs [-f] api
    ```

#### Production Mode

This mode uses optimized production images.

1.  **Start the services:**
    ```bash
    docker compose -f compose.prod.yaml up --build -d
    ```

2.  **View logs:**
    ```bash
    # All services
    docker compose -f compose.prod.yaml logs [-f]
    
    # Specific service
    docker compose -f compose.prod.yaml logs [-f] api
    ```

#### Common Operations (Both Modes)

3.  **Access the application:**
    - Frontend: http://localhost:5173
    - Backend API: http://localhost:3000
    - Mongo Express: http://localhost:8081

4.  **Stop the services:**
    ```bash
    # Development mode
    docker compose -f compose.dev.yaml down
    
    # Production mode
    docker compose -f compose.prod.yaml down
    
    # Remove all data (destructive)
    docker compose -f compose.dev.yaml down --volumes
    ```

5.  **Updating Dependencies (Development Mode Only):**
    Because development mode isolates `node_modules` for hot-reloading, follow these steps when updating `package.json`:

    ```bash
    # 1. Stop the containers
    docker compose -f compose.dev.yaml down

    # 2. Remove dependency volumes
    docker volume rm taskmanager_api_node_modules taskmanager_frontend_node_modules

    # 3. Rebuild and restart
    docker compose -f compose.dev.yaml up --build -d
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
4.  **Build the application images (Optional):**
    
    **Option A: Build locally and tag for Kubernetes**
    ```bash
    # Build images
    docker compose -f compose.dev.yaml build
    
    # Tag with proper names to match Kubernetes manifests
    docker tag taskmanager-api:latest armartini/taskmanager-api:v2
    docker tag taskmanager-frontend:latest armartini/taskmanager-frontend:v2
    ```
    
    **Option B: Use existing images from Docker Hub**
    ```bash
    # Skip this step - Kubernetes will pull armartini/taskmanager-api:v2 
    # and armartini/taskmanager-frontend:v2 from Docker Hub automatically
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

### Option 3: Kubernetes with Helm

This workflow uses Helm, the package manager for Kubernetes, to deploy the application. This is a more advanced and scalable method for managing Kubernetes applications.

1.  **Start Minikube:**

    ```bash
    minikube start
    ```

2.  **Point your Docker client to Minikube's daemon:** This ensures that when you build images, they are available inside the Minikube cluster.

    ```bash
    eval $(minikube docker-env)
    ```

3.  **Build the application images (Optional):**
    
    **Option A: Build locally and tag for Kubernetes**
    ```bash
    # Build images
    docker compose -f compose.dev.yaml build
    
    # Tag with proper names to match Kubernetes manifests
    docker tag taskmanager-api:latest armartini/taskmanager-api:v2
    docker tag taskmanager-frontend:latest armartini/taskmanager-frontend:v2
    ```
    
    **Option B: Use existing images from Docker Hub**
    ```bash
    # Skip this step - Kubernetes will pull armartini/taskmanager-api:v2 
    # and armartini/taskmanager-frontend:v2 from Docker Hub automatically
    ```

4.  **Install the Helm Chart:**
    This command installs the Task Manager chart into your Kubernetes cluster. It creates a new "release" named `taskmanager-dev`.

    ```bash
    # Install with default values
    helm install taskmanager-dev ./charts/taskmanager

    # Or install with custom values from your .env file
    helm install taskmanager-dev ./charts/taskmanager \
      -f ./charts/taskmanager/values-dev.yaml \
      --set secrets.mongoUser="$(grep MONGO_USER .env | cut -d '=' -f2)" \
      --set secrets.mongoPassword="$(grep MONGO_PASSWORD .env | cut -d '=' -f2)" \
      --set secrets.jwtSecret="$(grep JWT_SECRET .env | cut -d '=' -f2)" \
      --set secrets.expressUser="$(grep EXPRESS_USER .env | cut -d '=' -f2)" \
      --set secrets.expressPassword="$(grep EXPRESS_PASSWORD .env | cut -d '=' -f2)"
    ```

5.  **Check the deployment status:**

    ```bash
    # View all resources created by the Helm release
    helm status taskmanager-dev

    # Watch pods until they're running
    kubectl get pods -w
    ```

6.  **Access the application:**
    The application will be accessible the same way as in Option 2 (Kubernetes with Minikube):

    - **Frontend**: `http://<MINIKUBE_IP>:30100` (where MINIKUBE_IP is from `minikube ip`)
    - **Mongo Express**: `http://<MINIKUBE_IP>:30081`
    - **API**: Available internally at `<release-name>-taskmanager-api:3000`

7.  **Upgrade the application:**

    ```bash
    # Upgrade with new image tags
    helm upgrade taskmanager-dev ./charts/taskmanager --set api.image.tag=v3 --set frontend.image.tag=v3
    ```

8.  **Uninstall the application:**
    ```bash
    # Remove all resources created by this Helm release
    helm uninstall taskmanager-dev
    ```

#### Helm Chart Configuration

The Helm chart supports extensive customization through the `values.yaml` file. Key configuration options include:

- **Image settings**: Repository, tags, and pull policies
- **Replica counts**: Scale individual components
- **Service types**: Change from NodePort to LoadBalancer or ClusterIP
- **Persistence**: Enable/disable MongoDB data persistence
- **Secrets**: Configure authentication credentials
- **Mongo Express**: Enable/disable the database UI

To customize the deployment, either:

1. Edit `charts/taskmanager/values.yaml` directly
2. Create a custom values file: `helm install task-manager ./charts/taskmanager -f my-values.yaml`
3. Use `--set` flags: `helm install task-manager ./charts/taskmanager --set frontend.replicaCount=3`

## Helm Commands Reference

Here are the essential Helm commands for managing your Task Manager deployment:

### Installation and Deployment

```bash
# Install the chart
helm install <release-name> ./charts/taskmanager

# Install with custom values
helm install <release-name> ./charts/taskmanager -f custom-values.yaml

# Install with inline value overrides
helm install <release-name> ./charts/taskmanager --set api.replicaCount=2
```

### Management and Updates

```bash
# List all releases
helm list

# Get release status and resources
helm status <release-name>

# Upgrade a release
helm upgrade <release-name> ./charts/taskmanager

# Rollback to previous version
helm rollback <release-name> <revision-number>

# View release history
helm history <release-name>
```

### Debugging and Development

```bash
# Dry run - see what would be installed without actually installing
helm install <release-name> ./charts/taskmanager -f ./charts/taskmanager/values-dev.yaml --dry-run --debug

# Dry run with custom values from .env file (saves output to file)
helm install taskmanager-dev ./charts/taskmanager \
  -f ./charts/taskmanager/values-dev.yaml \
  --set secrets.mongoUser="$(grep MONGO_USER .env | cut -d '=' -f2)" \
  --set secrets.mongoPassword="$(grep MONGO_PASSWORD .env | cut -d '=' -f2)" \
  --set secrets.jwtSecret="$(grep JWT_SECRET .env | cut -d '=' -f2)" \
  --set secrets.expressUser="$(grep EXPRESS_USER .env | cut -d '=' -f2)" \
  --set secrets.expressPassword="$(grep EXPRESS_PASSWORD .env | cut -d '=' -f2)" \
  --dry-run > helm-dry-run.txt

# Template - render templates locally
helm template <release-name> ./charts/taskmanager

# Get values for a release
helm get values <release-name>

# Get all information about a release
helm get all <release-name>
```

### Cleanup

```bash
# Uninstall a release
helm uninstall <release-name>

# Uninstall and keep history
helm uninstall <release-name> --keep-history
```

## Project Structure

```bash
.
├── backend
│   ├── Dockerfile      # Backend service Docker image definition
│   └── src             # Node.js/Express source code
├── charts
│   └── taskmanager     # Helm chart for the application
│       ├── Chart.yaml  # Chart metadata
│       ├── values.yaml # Default configuration values
│       └── templates   # Kubernetes manifest templates
│           ├── _helpers.tpl
│           ├── api-deployment.yaml
│           ├── api-service.yaml
│           ├── frontend-deployment.yaml
│           ├── frontend-service.yaml
│           ├── mongodb-deployment.yaml
│           ├── mongodb-service.yaml
│           ├── mongodb-pvc.yaml
│           ├── mongo-express-deployment.yaml
│           ├── mongo-express-service.yaml
│           └── secrets.yaml
├── compose.yaml
├── frontend
│   ├── Dockerfile      # Frontend service Docker image definition
│   └── src             # React/Vite source code
├── kubernetes          # Raw Kubernetes manifests
│   ├── api-deployment.yaml
│   ├── api-service.yaml
│   ├── frontend-deployment.yaml
│   ├── frontend-service.yaml
│   ├── mongodb-data-persistentvolumeclaim.yaml
│   ├── mongo-deployment.yaml
│   ├── mongo-express-deployment.yaml
│   ├── mongo-express-service.yaml
│   ├── mongo-service.yaml
│   └── taskmanager-secrets.yaml
├── .env.example        # Example environment variables
└── Readme.md
```
