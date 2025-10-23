from pathlib import Path

readme_content = """# 🧠 Project Management Backend API

A robust, scalable REST API built using **Node.js**, **Express**, and **TypeScript**, featuring **JWT-based authentication**, **project management**, and **task tracking** — fully **Dockerized** and connected to **MongoDB Atlas**.

## 🚀 Features

✅ User Authentication (Register/Login with JWT)  
✅ Role-based project ownership  
✅ Project CRUD (Create, Read, Update, Delete)  
✅ Task CRUD (Create, Read, Update, Delete) per project  
✅ TypeScript for strong typing  
✅ Centralized error handling  
✅ MongoDB Atlas integration  
✅ Dockerized setup for production  
✅ Jest & Supertest-ready for unit testing  

## 🧱 Tech Stack

| Category | Technology |
|-----------|-------------|
| Language | TypeScript |
| Runtime | Node.js |
| Framework | Express |
| Database | MongoDB Atlas |
| Authentication | JWT (jsonwebtoken + bcryptjs) |
| Containerization | Docker & Docker Compose |
| Testing | Jest + Supertest |
| Build Tool | tsc (TypeScript compiler) |

## ⚙️ Project Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/AamirMajeed570/Project-Management.git
cd backend

2️⃣ Install Dependencies
npm install

3️⃣ Environment Variables

Create a .env file in your root directory:
PORT=8000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/project_management
JWT_SECRET=your_secret_key

4️⃣ Run Locally (Development)
npm run dev

5️⃣ Build for Production
npm run build

6️⃣ Start Production Server
npm start

🐳 Run with Docker
1️⃣ Build and Run the Container
docker-compose up --build

2️⃣ Or Run Manually
docker build -t project-backend .
docker run -p 5000:8000 --env-file .env project-backend

🔑 Authentication
Authorization: Bearer <your_token>

🧬 Project Structure
backend/
├── src/
│   ├── controllers/        # Route handlers (Auth, Projects, Tasks)
│   ├── middleware/         # Auth middleware (JWT verification)
│   ├── models/             # Mongoose Schemas (User, Project, Task)
│   ├── routes/             # Route definitions
│   ├── seed/               # Database seeding script
│   └── index.ts            # App entry point
│
├── dist/                   # Compiled JS output
├── Dockerfile              # Docker build configuration
├── docker-compose.yml      # Docker Compose setup
├── tsconfig.json           # TypeScript configuration
├── package.json
└── .env.example

🧪 Testing (Optional)
npm run test

🌱 Seed the Database
npm run seed

default User
email: test@example.com
password: Test@123
