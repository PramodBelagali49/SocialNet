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
    try {
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

        user={
            _id:user._id,
            username:user.username,
            email:user.email,
            profilePicture:user.profilePicture,
            bio:user.bio,
            followers:user.followers,
            following:user.following,
            posts:user.posts  // posts id stored here
        }

        const token=await jwt.sign({userId:user._id},process.env.SECRET_KEY,{expiresIn:'1d'})
        return resp.cookie('token',token,{httpOnly:true,sameSite:'strict',maxAge:1*24*60*60*1000}).json({
            message:`welcome back ${user.username}`,
            success:true
        })
    } catch (error) {
        console.log(error);
    }
}

export const logout=async(req,resp)=>{
    try {
        return resp.cookie("token","",{maxAge:0}).json({
            message:"logged out successfully",
            success:true
        })
    } catch (error) {
        console.log(error);
    }
}

export const getProfile=async(req,resp)=>{
    try {
        const userId=req.params.id;
        const user=await User.findById(userId);
        return resp.status(200).json({
            user,
            success:true
        })
    } catch (error) {
        console.log(error);
    }
}

export const editProfile=async(req,resp)=>{
    try {
        const userId=req.id;
    } catch (error) {
        console.log(error);
    }
}