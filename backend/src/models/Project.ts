import mongoose from "mongoose";
import User from "./User";
export interface IProject extends mongoose.Document {
    title: string;
    description?: string;
    status: "active" | "completed";
    owner: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const projectSchema = new mongoose.Schema<IProject>(
    {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String
        },
        status: {
            type: String,
            enum: ["active", "completed"],
            default: "active"
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    { timestamps: true }
);

const Project = mongoose.model<IProject>("Project", projectSchema);

export default Project;