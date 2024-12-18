import { user } from "../models/user.model.js";
import bcrypt from "bcryptjs"

export const register = async (req,res) => {
    try {
        const {fullname, email, phoneNumber, password, role} = req.body;
        if(!fullname || !email || !phoneNumber || !password || !role){
            return res.status(400).json({
                message: "Something is missing",
                sucesss:false
            });
        };
        const user = await user.findOne({email});
        if (user) {
            return res.status(400).json({
                message:"user already exsist with this email",
                sucesss:false
            });
        };
        const hashedPassword = await bcrypt.hash(password, 10);

        await user.create({
            fullname, 
            email, 
            phoneNumber, 
            password:hashedPassword, 
            role
        })
    } catch (error) {
        console.log(error);
        
    }
}


// login 

