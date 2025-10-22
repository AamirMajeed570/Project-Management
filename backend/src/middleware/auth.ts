import { NextFunction, Request,Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "project_management_secret_key";
export interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
    }
}

export const auth = (req: AuthRequest, res: Response, next: NextFunction) => {
    const header = req.headers.authorization;
    if(!header){
        return res.status(401).json({message: "Authorization header missing"});
    }
    const token = header.split(" ")[1];
    console.log("token", token);
    if(!token){
        return res.status(401).json({message: "Token missing"});
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log("decoded", decoded);
        req.user = { id: (decoded as any).id, email: (decoded as any).email };
        next();
    } catch (error) {
        res.status(401).json({message: "Invalid token"});
    }
}   