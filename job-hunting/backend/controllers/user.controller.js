import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { user } from "../models/user.model.js";


// Register
export const register = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, role } = req.body;

        if (!fullname || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        }

        const existingUser = await user.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "User already exists with this email",
                success: false
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await user.create({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            role
        });

        return res.status(201).json({
            message: "User registered successfully",
            success: true
        });

    } catch (error) {
        console.error("Error in Register:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
};

// Login
export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        if (!email || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        }

        const foundUser = await user.findOne({ email });
        if (!foundUser) {
            return res.status(400).json({
                message: "Incorrect email or password",
                success: false
            });
        }

        const isPasswordMatch = await bcrypt.compare(password, foundUser.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect email or password",
                success: false
            });
        }

        // Check if role matches
        if (role !== foundUser.role) {
            return res.status(400).json({
                message: "Account does not exist with the current role",
                success: false
            });
        }

        // Generate token
        const tokenData = { userId: foundUser._id };
        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

        const responseUser = {
            _id: foundUser._id,
            fullname: foundUser.fullname,
            email: foundUser.email,
            phoneNumber: foundUser.phoneNumber,
            role: foundUser.role,
            profile: foundUser.profile
        };

        return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: "strict" })
            .json({
                message: `Welcome Back ${responseUser.fullname}`,
                user: responseUser,
                success: true
            });

    } catch (error) {
        console.error("Error in Login:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
};

// Logout
export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out Successfully",
            success: true
        });
    } catch (error) {
        console.error("Error in Logout:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
};

// Update Profile
export const updateProfile = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, bio, skills } = req.body;
        const file = req.file; // Assuming file upload middleware is used

        // Validate skills
        const skillsArray = skills ? skills.split(",").map(skill => skill.trim()) : undefined;

        const userId = req.id; // Middleware should attach authenticated user's ID

        // Find user
        let foundUser = await user.findById(userId);

        if (!foundUser) {
            return res.status(400).json({
                message: "User not found",
                success: false
            });
        }

        // Update user data
        if (fullname) foundUser.fullname = fullname;
        if (email) foundUser.email = email;
        if (phoneNumber) foundUser.phoneNumber = phoneNumber;
        if (bio) foundUser.profile.bio = bio;
        if (skillsArray) foundUser.profile.skills = skillsArray;

        // Save updated user
        await foundUser.save();

        const responseUser = {
            _id: foundUser._id,
            fullname: foundUser.fullname,
            email: foundUser.email,
            phoneNumber: foundUser.phoneNumber,
            role: foundUser.role,
            profile: foundUser.profile
        };

        return res.status(200).json({
            message: "Profile updated successfully",
            user: responseUser,
            success: true
        });

    } catch (error) {
        console.error("Error in Update Profile:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
};
