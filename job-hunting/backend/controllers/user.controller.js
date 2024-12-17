import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs"

export const register = async (req, res) => {
    try {
        const {fullName, email, phonNumber, passowrd, role} = req.body;
        if(!fullName || !email || !phonNumber || !passowrd || !role) {
            return res.status(400).json({
                message:"somethinf is missing",
                success:false
            });
        };
        const user = await User.findOne({email});
        if (user) {
            return res.status(400).json({
                message:'User already exsist',
                success:false
            })
        }
        const hashedPassword = await bcrypt.hash(passowrd, 10);
        await User.create({
            fullName,
            phonenUMBER,
            password:hashedPassword,
            role,
        })
    } catch (error) {
        
    }
}

export const login = async (req, res) => {
    try {
        const {email, passowrd, role} = req.body;
        if(!email || !passowrd || !role) {
            return res.status(400).json({
                message:"something is missing",
                success:false
            });
        };
        const user = await User.findOne({email})
        if (!user) {
            return res.status(400).json({
                message:"incorrect email or password",
                success:false,
            })
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch){
            return res.status(400).json({
                message:"incorrect email or password",
                success:false,
            })
        };
    } catch (error) {
        
    }
}