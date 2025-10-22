import mongoose from "mongoose";
const MONGO_URI = process.env.MONGO_URI;
// console.log("MONGO_URI:", MONGO_URI);
export const connectDB = async (MONGO_URI: string) => {
    try {
        await mongoose.connect("mongodb+srv://aamirmajeedkhan570_db_user:Fb4CtLYv9d8n6V3F@cluster0.4tdncf2.mongodb.net/Project-Management?retryWrites=true&w=majority&appName=Cluster0").then(() => {
            console.log("MongoDB connected successfully");
        }).catch((err) => {
            console.error("MongoDB connection error:", err);
        });
    } catch (error) {
        // console.log("Error connecting to MongoDB:", error); 
        throw error;
    }
}

// connectDB(MONGO_URI!);