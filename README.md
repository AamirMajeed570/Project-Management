# Project-Management
# Project Management App

A full-stack **Project Management Application** built with **MERN stack** (MongoDB, Express, React, Node.js), fully typed with **TypeScript**, and Dockerized for easy deployment. The app allows users to create, update, delete, and manage projects and their associated tasks.

---

## Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Backend Flow](#backend-flow)
4. [Frontend Flow](#frontend-flow)
5. [API Endpoints](#api-endpoints)
6. [Setup & Run](#setup--run)
7. [Docker Setup](#docker-setup)
8. [Screenshots / Demo](#screenshots--demo)

---

## Features

### Backend:

* User authentication (JWT)
* CRUD operations for **Projects** and **Tasks**
* Pagination, search, and status filters for projects and tasks
* MongoDB Atlas database integration
* Environment configuration via `.env` file

### Frontend:

* React + TypeScript + Bootstrap
* React Hook Form for form validation
* Responsive and modern dashboard UI
* Project and Task management pages
* Search, filters, and pagination
* Toast notifications for success/error
* Login/Logout flow

---

## Tech Stack

* **Frontend**: React, TypeScript, Bootstrap, Axios, React Hook Form, React Router DOM
* **Backend**: Node.js, Express, TypeScript, Mongoose, JWT, bcryptjs
* **Database**: MongoDB Atlas
* **Dev Tools**: Docker, Docker Compose, Nodemon, Jest (unit tests)

---

## Backend Flow

1. **Server Initialization**

   * `index.ts` imports `app.ts` and starts the Express server.
   * Environment variables are loaded using `dotenv`.
   * MongoDB connection is established via `mongoose.connect`.

2. **Authentication**

   * Users login with email/password.
   * JWT tokens are issued on login and used for protected routes.

3. **Project Management**

   * `GET /api/v1/project` → fetch projects with optional pagination, search, filter.
   * `POST /api/v1/project` → create a new project.
   * `PUT /api/v1/project/:id` → update an existing project.
   * `DELETE /api/v1/project/:id` → delete a project.

4. **Task Management**

   * `GET /api/v1/task/project/:projectId` → fetch tasks for a project (with pagination and filters).
   * `POST /api/v1/task/project/:projectId` → create a task under a project.
   * `PUT /api/v1/task/:taskId` → update task details.
   * `DELETE /api/v1/task/:taskId` → delete task.

5. **Error Handling**

   * All routes use try/catch blocks and return structured JSON:

     ```json
     {
       "success": true|false,
       "message": "description",
       "data": [...]
     }
     ```

---

## Frontend Flow

1. **Login Page**

   * Uses React Hook Form for input validation.
   * On successful login, JWT token and user info are stored in `localStorage`.
   * User is redirected to **Dashboard**.

2. **Dashboard**

   * Shows list of projects owned by the logged-in user.
   * Filters: status (active/completed), search by project title.
   * Pagination for large lists of projects.
   * CRUD operations for projects via Bootstrap modals.
   * Toast notifications for success/error messages.
   * Logout button to clear session.

3. **Project Detail Page**

   * Shows all tasks under a project.
   * Filters: status (todo/in-progress/done), search by task title.
   * Pagination for tasks.
   * Create/Edit/Delete tasks with modals.
   * Toast notifications for success/error.

4. **Styling & UI**

   * Bootstrap for responsive design.
   * Gradient background for dashboard.
   * Cards for projects and tasks.
   * Buttons and modals for user actions.

---

## API Endpoints

### Auth

| Method | Endpoint           | Description             |
| ------ | ------------------ | ----------------------- |
| POST   | /api/v1/auth/login | Login and get JWT token |

### Project

| Method | Endpoint            | Description                                                   |
| ------ | ------------------- | ------------------------------------------------------------- |
| GET    | /api/v1/project     | Get all projects (supports search, status filter, pagination) |
| POST   | /api/v1/project     | Create new project                                            |
| PUT    | /api/v1/project/:id | Update project                                                |
| DELETE | /api/v1/project/:id | Delete project                                                |

### Task

| Method | Endpoint                        | Description                                        |
| ------ | ------------------------------- | -------------------------------------------------- |
| GET    | /api/v1/task/project/:projectId | Get tasks of a project (with filters & pagination) |
| POST   | /api/v1/task/project/:projectId | Create task under a project                        |
| PUT    | /api/v1/task/:taskId            | Update task                                        |
| DELETE | /api/v1/task/:taskId            | Delete task                                        |

**Headers**:

* `Authorization: Bearer <JWT_TOKEN>`
* `Content-Type: application/json` (for POST/PUT)

---

## Setup & Run

### Backend

```bash
cd backend
npm install
cp .env.example .env        # Add your MongoDB URI and JWT_SECRET
npm run build
npm start                   # or npm run dev for dev mode
```

### Frontend

```bash
cd frontend
npm install
npm start
```

* Frontend runs on `http://localhost:3000`
* Backend runs on `http://localhost:8000`

---

## Docker Setup

**Dockerfile (Backend)**

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 8000
CMD ["node", "dist/app.js"]
```

**docker-compose.yml**

```yaml
version: "3"
services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    env_file:
      - ./backend/.env
```

* `docker-compose up --build` to run backend in Docker

---

## Screenshots / Demo

* **Login Page**: user authentication
* **Dashboard**: projects list, search, filters, pagination
* **Project Detail**: tasks list, filters, create/edit/delete tasks
* **Toast Notifications**: success/error feedback

---

## Notes

* All code includes **TypeScript typings**.
* Backend uses **JWT authentication** for protected routes.
* Frontend uses **Axios** for API calls, **React Hook Form** for validation.
* UI is fully responsive with **Bootstrap**.
