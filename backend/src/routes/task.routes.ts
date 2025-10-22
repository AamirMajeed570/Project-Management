import express from 'express';
import { createTask,listTasks,updateTask,deleteTask } from '../controllers/task.controller';
const router = express.Router();

router.post("/project/:projectId", createTask);
router.get("/project/:projectId", listTasks);
router.patch("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;