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
  try {
    const { page = 1, limit = 10, status,search = "", name } = req.query;

    // Build the filter object
    const filter: any = { owner: req.user!.id };
    if (search) {
      filter.title = { $regex: search, $options: "i" }; // case-insensitive search
    }
    if (status) filter.status = status;       // filter by project status
    if (name) filter.name = { $regex: name, $options: 'i' }; // case-insensitive search by name

    // Convert page and limit to numbers
    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);

    // Fetch total count for pagination
    const total = await Project.countDocuments(filter);

    // Fetch paginated and sorted projects
    const projects = await Project.find(filter)
      .sort({ createdAt: -1 })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    res.status(200).json({
      message: "Projects fetched successfully",
      success: true,
      data: projects,
      pagination: {
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(total / limitNumber),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch projects",
      success: false,
    });
  }
};


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