# Gemini Project

This is the Gemini Project, which includes both the frontend and backend services. The frontend is built with React and Vite, while the backend is built with Node.js and Express. The project uses MongoDB as the database.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Docker Commands](#docker-commands)
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

3. Open the new `.env` file and add your secret values for `JWT_SECRET`, `MONGO_USER`, and `MONGO_PASSWORD`. The `.env` file is ignored by Git, so your secrets will not be committed.

## Usage

- To start the project: `docker compose up [--build]`
- To stop the project (keeps data): `docker compose down`
- To stop the project and remove all data: `docker compose down --volumes`
- To view logs for all services: `docker compose logs -f`
- To access the Mongo Express UI, open your browser and go to `http://localhost:8081`.

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
