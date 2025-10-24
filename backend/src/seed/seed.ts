import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import User from "../models/User";
import Project from "../models/Project";
import Task from "../models/Task";
dotenv.config();

const MONGO_URI:string = process.env.MONGO_URI!;

async function seed() {
  await mongoose.connect(MONGO_URI!).then(() => {
    console.log("MongoDB connected successfully");
  }).catch((err) => {
    console.error("MongoDB connection error:", err);
  });
  console.log("Connected to MongoDB");

  await User.deleteMany({});
  await Project.deleteMany({});
  await Task.deleteMany({});

  const passwordHash = await bcrypt.hash("Test@123", 10);
  const user = await User.create({
    email: "test@example.com",
    password: passwordHash,
    name: "Test User",
  });

  const project1 = await Project.create({
    title: "Seed Project Alpha",
    description: "First seeded project",
    owner: user._id,
  });
  const project2 = await Project.create({
    title: "Seed Project Beta",
    description: "Second seeded project",
    owner: user._id,
  });

  await Task.insertMany([
    { project: project1._id, title: "Alpha Task 1", status: "todo" },
    { project: project1._id, title: "Alpha Task 2", status: "in-progress" },
    { project: project2._id, title: "Beta Task 1", status: "done" },
  ]);

  console.log("✅ Seed completed: test@example.com / Test@123");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
