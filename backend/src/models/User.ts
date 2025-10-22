import mongoose from "mongoose";

export interface IUser extends mongoose.Document {
    email: string;
    password: string;
    name?: string;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new mongoose.Schema<IUser>({
    email: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String
    }
},
    { timestamps: true }
)

const User = mongoose.model("User", userSchema);

export default User;