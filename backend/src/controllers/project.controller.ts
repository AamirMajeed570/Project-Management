import { Request, Response } from "express";
import Project from "../models/Project";
import Task from "../models/Task";
import User from "../models/User";
import { AuthRequest } from "../middleware/auth";

export const createProject = async (req: AuthRequest, res: Response) => {
    const { title, description } = req.body;
    const ownerId = req.user!.id;
    console.log(ownerId);
    try {
        const project = await Project.create({
            title,
            description,
            owner: ownerId
        })
        res.status(201).json({
            message: "Project created successfully",
            success: true,
            project
        })
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            success: false
        })
    }
}

export const listProjects = async (req: AuthRequest, res: Response) => {
    const projects = await Project.find({ owner: req.user!.id }).sort({
        createdAt: -1
    })
    res.status(200).json({
        message: "Projects Fetched Succesfully",
        success: true,
        data: projects
    })
}

export const getProject = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const project = await Project.findById(id);
    if (!req.user!.id)
        return res.status(403).json({ message: "Forbidden" });
    if (!project) {
        return res.status(404).json({ message: "Project not found" });
    }
    const tasks = await Task.find({ project: id }).sort({ createdAt: -1 });

    res.status(200).json({
        message: "Projects and its Tasks Fetched Succesfully",
        data: {
            project,
            tasks
        }
    })
}

export const updateProject = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    if (!req.user!.id) {

        return res.status(403).json({ message: "Forbidden" });
    }
    const project = await Project.findById(id);
    if (!project) {
        return res.status(404).json({ message: "Project not found" });
    }
    const { title, description, status } = req.body;
    if (title !== undefined) project.title = title;
    if (description !== undefined) project.description = description;
    if (status !== undefined) project.status = status;

    await project.save();
    res.status(200).json({
        message: "project details Updated",
        success: true,
        data: project
    })
}

export const deleteProject = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    if (!req.user!.id) {
        return res.status(403).json({ message: "Forbidden" });
    }
    const project = await Project.findById(id);
    if (!project) {
        return res.status(404).json({
            message: "Project Not Found",
        })
    }
    await Project.deleteOne();
    await Task.deleteMany({ project: id });

    res.status(200).json({
        message: "Project deleted Succesfully",
        success: true,
    })

}