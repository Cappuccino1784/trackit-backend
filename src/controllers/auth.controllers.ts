import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from 'bcryptjs'

import jwt from 'jsonwebtoken';

export const signup = async (req: Request, res: Response) => {
    try {
        const { username, email, password } = req.body;

        // 1. Check required fields
        if (!username || !email || !password) {
            return res.status(400).json({ message: "Missing fields" });
        }

        // 2. Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "Email already in use" });
        }

        // 4. Create user
        await User.create({
            username,
            email,
            password
        });

        res.status(201).json({ message: "User created successfully" });

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // 1. Check input
        if (!email || !password) {
            return res.status(400).json({ message: "Missing credentials" });
        }

        // 2. Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // 3. Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // 4. Create JWT
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET as string,
            { expiresIn: "7d" }
        );

        res.json({ token });

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};


