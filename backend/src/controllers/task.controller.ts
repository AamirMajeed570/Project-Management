import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import mongoose from "mongoose";
import Project from "../models/Project";
import Task from "../models/Task";

export const createTask = async (req: AuthRequest, res: Response) => {
    const { projectId } = req.params;
    const { title, description, status, dueDate } = req.body;
    const project = await Project.findById(projectId);
    if (!project) {
        return res.status(404).json({ message: "Project not found" });
    }

    if (!req.user!.id) {
        return res.status(403).json({ message: "Forbidden" });
    }

    if (!title) {
        return res.status(400).json({ message: "Title is required" });
    }

    const task = await Task.create({
        project: new mongoose.Types.ObjectId(projectId),
        title,
        description,
        status,
        dueDate
    })

    res.status(201).json({
        message: "Task created successfully",
        task
    });

}
// List Tasks
export const listTasks = async (req: AuthRequest, res: Response) => {
    const { projectId } = req.params;
    console.log("projectId", projectId);
    const project = await Project.findById(projectId);
    console.log("project", project);
    if (!project) return res.status(404).json({ message: "Project not found" });
    if (!req.user!.id) return res.status(403).json({ message: "Forbidden" });
    const filter: any = { project: projectId };
    console.log("Looking for tasks with project:", project);
    if (req.query.status) {
        filter.status = req.query.status;
    }
    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    console.log("Tasks found:", tasks.length);
    res.status(200).json({
        message: "Tasks fetched successfully",
        tasks
    })
}

// Update Task
export const updateTask = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    if (!req.user!.id) {
        return res.status(403).json({ message: "Forbidden" });
    }
    const task = await Task.findById(id);
    if (!task) {
        return res.status(404).json({
            message: "Task not found"
        })
    }
    const project = await Project.findById(task.project);
    if (!project) {
        return res.status(404).json({
            message: "Parent Project not found"
        })
    }
    const { title, description, status, dueDate } = req.body;
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;
    if (dueDate !== undefined) task.dueDate = dueDate;

    await task.save();

    res.status(200).json({
        message: "Task updated successfully",
        task
    })
}

// Delete Task
export const deleteTask = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    if (!req.user!.id) {
        return res.status(403).json({ message: "Forbidden" });
    }
    const task = await Task.findById(id);
    if (!task) {
        return res.status(404).json({
            message: "Task not found"
        })
    }
    const project = await Project.findById(task.project);
    if (!project) {
        return res.status(404).json({
            message: "Parent Project not found"
        })
    }

    await task.deleteOne();

    res.status(200).json({
        message: "Task deleted successfully"
    })
}