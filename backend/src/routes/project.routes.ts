import express from 'express';
import { createProject,listProjects,getProject,updateProject,deleteProject } from '../controllers/project.controller';
const router = express.Router();

router.post("/create", createProject);
router.get("/", listProjects);
router.get("/:id", getProject);
router.patch("/:id", updateProject);
router.delete("/:id", deleteProject);

export default router;