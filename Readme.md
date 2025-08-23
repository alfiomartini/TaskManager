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
   git clone https://github.com/your-username/your-repo.git

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

## Usage

- To start the project: `docker compose up [--build]`
- To stop the project (keeps data): `docker compose down`
- To stop the project and remove all data: `docker compose down --volumes`
- To view logs for all services: `docker compose logs -f`
- To run a subset of services (e.g., backend and database only):
  ```bash
  docker compose up api mongo mongo-express
  ```
- To access the Mongo Express UI, open your browser and go to `http://localhost:8081`.

### Application Access

- Frontend: The React application is available at http://localhost:5173.
- Backend API: The Node.js Express API is running at http://localhost:3000.

## Kubernets

### Running the application:

```bash
minikube start
eval $(minikube docker-env)
docker)compose build
kubectl apply -f kubernetes/
kubectl get pods -w
minikube service frontend
minikube dashboard
```

### Project Structure

```bash
.
├── README.md
├── backend
│   ├── Dockerfile
│   ├── ...
├── frontend
│   ├── Dockerfile
│   ├── ...
├── docker-compose.yml
├── ...
```
