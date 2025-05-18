import {User} from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register=async(req,resp)=>{
    try {
        const {username,email,password}=req.body;
        if(!username || !email || !password){
            return resp.status(401).json({
                message:"Fill all the details!",
                success:false
            })
        }
        const user=User.findOne({email});
        if(user){
            return resp.status(401).json({
                message:"User already registered,try different email/username",
                success:false
            })
        }

        const hashedPassword=bcrypt.hash(password,10);
        await User.create({
            username,
            email,
            password:hashedPassword
        })
        return resp.status(200).json({
            message:"User registered successfully",
            success:true
        })
    } catch (error) {
        console.log(error);
    }
};

export const login=async(req,resp)=>{
    const {email,password}=req.body;
        if(!email || !password){
            return resp.status(401).json({
                message:"Fill all the details!",
                success:false
            })
        }
        const user=User.findOne({email});
        const isPasswordMatch=await bcrypt.compare(password,user.password); 
        if(!user || isPasswordMatch){
            return resp.status(401).json({
                message:"Incorrect email or password !!",
                success:false
            })
        }

        const token=await jwt.sign({userId:user._id},process.env.SECRET_KEY,{expiresIn:'1d'})
}