import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/dataUri.js";
import cloudinary from "../utils/cloudinary_config.js";

export const signup=async(req,resp)=>{
    try {
        const {username,email,password}=req.body;
        if(!username || !email || !password){
            return resp.status(401).json({
                message:"Fill all the details!",
                success:false
            })
        }
        const user=await User.findOne({$or:[{email},{username}]});
        if(user){
            return resp.status(400).json({
                message:"username or email already exists , try different one",
                success:false
            })
        }

        const hashedPassword=await bcrypt.hash(password,10);
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
        return resp.status(500).json({
            message: "Could NOT register,try again",
            success: false,
        });
    }
};

export const login=async(req,resp)=>{
    try {
        const {username,password}=req.body;
        if(!username || !password){
            return resp.status(401).json({
                message:"Fill all the details!",
                success:false
            })
        }
        let user=await User.findOne({username});
        const isPasswordMatch=await bcrypt.compare(password,user.password); 
        if(!user || !isPasswordMatch){
            return resp.status(401).json({
                message:"Incorrect username or password !!",
                success:false
            })
        }

        const token=await jwt.sign({userId:user._id},process.env.SECRET_KEY,{expiresIn:'1d'})
        await user.populate("posts");
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
        return resp.cookie('token',token,{httpOnly:true,sameSite:'strict',maxAge:1*24*60*60*1000}).json({
            user,
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
        const user=await User.findById(userId).select("-password");
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
        const user=await User.findById(userId).select("-password");
        if(!user){
            return resp.status(404).json({
                message:"User NOt Found",
                success:false
            })
        }

        const {bio,gender}=req.body;
        const profilePicture=req.file;
        let cloudResponse;

        if(profilePicture){
            const fileUri=getDataUri(profilePicture);
            cloudResponse=await cloudinary.uploader.upload(fileUri, {
                folder: "instagram/profilePictures", // Specify your folder structure
                public_id: `user_${userId}`, // Optional: give specific name to file
                overwrite: true // Will replace existing image with same public_id
            });
        }

        if(bio) user.bio=bio;
        if(gender) user.gender=gender;
        if(profilePicture) user.profilePicture=cloudResponse.secure_url;

        const updatedUser=await user.save();   // updatedUser

        return resp.status(200).json({
            message:"Profile Updated Successfully !!",
            success:true,
            updatedUser
        })

    } catch (error) {
        console.log(error);
    }
}

export const getSuggestedUsers=async(req,resp)=>{
    try {
        const suggestedUsers=await User.find({_id:{$ne:req.id}}).select("-password");
        if(!suggestedUsers){
            return resp.status(400).json({
                message:"No profile suggestions",
                success:false
            })
        }

        return resp.status(200).json({
            success:true,
            users:suggestedUsers
        })
    } catch (error) {
        console.log(error);
    }
}

export const followUnfollow=async(req,resp)=>{
    try {
        const currUserId=req.id;
        const targetUserId=req.params.id;
        if(currUserId === targetUserId){
            return resp.status(400).json({
                message:"You can Not follow/unfollow yourself",
                success:false 
            })
        }
        const currUser=await User.findById(currUserId);
        const targetUser=await User.findById(targetUserId);
        if(!currUser || !targetUser){
            return resp.status(400).json({
                message:"User Not found",
                success:false 
            })
        }

        const isFollowing=currUser.following.includes(targetUser);
        if(isFollowing){
            // logic for unfollow
            await Promise.all([
                User.updateOne({_id:currUserId},{$pull:{following:targetUserId}}),
                User.updateOne({_id:targetUserId},{$pull:{followers:currUserId}})
            ])
            return resp.status(200).json({
                message:"Unfollowed successfully",
                success:true
            })
        }else{
            // logic for follow
            await Promise.all([
                User.updateOne({_id:currUserId},{$push:{following:targetUserId}}),
                User.updateOne({_id:targetUserId},{$push:{followers:currUserId}})
            ])
            return resp.status(200).json({
                message:"Followed successfully",
                success:true
            })
        }
    } catch (error) {
        console.log(error);
    }
}