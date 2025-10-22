import { Request,Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";
const JWT_SECRET = process.env.JWT_SECRET || "project_management_secret_key";
export const register = async (req: Request, res: Response) => {
    const {email, password,name} = req.body;
    try {
        if(!email || !password) {
            return res.status(400).json({message: "All fields are required"});
        }
        const existingUser = await User.findOne({email});
        if(existingUser) {
            return res.status(400).json({message: "User already exists"});
        }
        const hashedpassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            name,
            email,
            password: hashedpassword
        })
        res.status(201).json({message: "User registered successfully"});
    } catch (error) {
        
    }
}

export const login = async (req:Request, res:Response) => {
    const {email, password} = req.body;
    if(!email || !password) {
        return res.status(400).json({message: "All fields are required"});
    }
    const user = await User.findOne({email});
    console.log(user);
    if(!user) {
        return res.status(400).json({message: "Invalid credentials"});
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(!isPasswordValid) {
        return res.status(400).json({message: "Invalid credentials"});
    }
    const token = jwt.sign({id: user._id,email: user.email},JWT_SECRET,{expiresIn : "7d"} )
    res.json({token,user: {id: user._id, name: user.name, email: user.email}});
}