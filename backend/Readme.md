# Gemini Project Backend

This directory contains the backend code for the Gemini Project.

**Please note:** This README assumes you are already familiar with the overall Gemini Project and its goals. If not, please refer to the main project documentation.

## Getting Started

1. **Prerequisites:**

   - **Docker and Docker Compose:** Ensure you have Docker and Docker Compose installed. You can download them from [https://www.docker.com/](https://www.docker.com/).

2. **Installation:**

   - Navigate to the backend directory:

     ```bash
     cd backend
     ```

   - Install dependencies:
     ```bash
     npm install
     ```

## Environment Variables

Create a `.env` file in the root directory and add the following environment variables:

```env
PORT=3000
MONGODB_URI=mongodb://mongo:27017/your-database
JWT_SECRET=your_jwt_secret
```

To genereate the JWT_SECRET, run:

```bash
  npm run secret:jwt
```

## Usage

1. Start the development server using Docker:

   ```bash
   mpm run docker:start
   ```

   This command will start both the backend server and the database.

2. Stop the development server and the database:

   ```bash
   npm run docker:stop
   ```

3. Build the project for production:

   ```bash
   npm run build
   ```

4. Run the production server:
   ```bash
   npm start
   ```

## API Documentation

### Authentication

- **POST /api/auth/signup**: Register a new user.
- **POST /api/auth/signin**: Log in an existing user.

### Tasks

- **POST /api/tasks/create**: Create a new task.
- **GET /api/tasks/list**: Get all tasks.
- **GET /api/tasks/get/:id**: Get a task by ID.
- **PUT /api/tasks/update/:id**: Update a task by ID.
- **DELETE /api/tasks/delete/:id**: Delete a task by ID.

## Code Structure

```bash
.
├── Dockerfile
├── Readme.md
├── compose.yaml
├── generateJsonToken.ts
├── jest.config.ts
├── node_modules
├── notes.txt
├── package-lock.json
├── package.json
├── src
│   ├── app.ts # Express app setup
│   ├── config
│   │   └── database.ts # MongoDB connection setup
│   ├── controllers
│   │   ├── authController.ts # Handles sign-up, login, etc.
│   │   └── taskController.ts # Task-related CRUD operations
│   ├── middleware
│   │   └── authMiddleware.ts # Middleware to protect routes
│   ├── models
│   │   ├── userModel.ts # User schema and model
│   │   └── taskModel.ts # Task schema and model
│   ├── routes
│   │   ├── auth.ts # Authentication routes
│   │   └── tasks.ts # Task routes
│   ├── types
│   │   └── index.ts # Type definitions
│   ├── tests
│   │   ├── config
│   │   │   └── db.test.ts
│   │   ├── controllers
│   │   │   ├── authController.test.ts
│   │   │   └── taskController.test.ts
│   │   ├── middleware
│   │   │   └── index.test.ts
│   │   ├── routes
│   │   │   ├── authRoutes.test.ts
│   │   │   ├── index.test.ts
│   │   │   └── taskRoutes.test.ts
│   │   └── sample.test.ts
│   └── utils
├── start.sh
└── tsconfig.json
```

## Testing

Run tests using your preferred testing framework (e.g., Jest, Mocha):

```bash
npm test
```

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add new feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Open a pull request.

## License

This project is licensed under the MIT License.

### Summary

- **Usage Section**: Updated to include instructions for starting the project using Docker.
- **Environment Variables**: Updated the MongoDB URI to use the Docker service name `mongo`.
