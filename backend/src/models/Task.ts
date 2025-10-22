import mongoose from "mongoose";
export interface ITask extends mongoose.Document {
    project: mongoose.Types.ObjectId;
    title: string;
    description?: string;
    status: "todo" | "in-progress" | "done";
    assignedTo?: mongoose.Types.ObjectId;
    dueDate?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const taskSchema = new mongoose.Schema<ITask>(
    {
        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
            required: true
        },
        title: {
            type: String,
            required: true
        },
        description: {
            type: String
        },
        status: {
            type: String,
            enum: ["todo", "in-progress", "done"],
            default: "todo"
        },
        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        dueDate: {
            type: Date
        }
    },
    {timestamps: true}
)

export const Task = mongoose.model<ITask>("Task", taskSchema);

export default Task;