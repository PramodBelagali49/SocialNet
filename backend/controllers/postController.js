import Post from "../models/post.js";
import User from "../models/user.js";
import sharp from "sharp"
import cloudinary from "../utils/cloudinary_config.js";
import Comment from "../models/comment.js";

export const addPost=async(req,resp)=>{
    try {
        const {caption}=req.body;
        const image=req.file;
        const authorId=req.id;

        if(!image) return resp.status(400).json({message:"Image is required"})
        
        const optimizedImageBuffer=await sharp(image.buffer)
                                    .resize({width:"800",height:"800",fit:"inside"})
                                    .toFormat('jpeg',{quality:80})
                                    .toBuffer();

        const fileUri=`data:image/jpeg;base64,${optimizedImageBuffer.toString("base64")}`
        const cloudResponse=await cloudinary.uploader.upload(fileUri);

        const post=await Post.create({
            caption,
            image:cloudResponse.secure_url,
            author:authorId
        })

        const user=await User.findById(authorId);
        if(user){
            user.posts.push(post._id);
            await user.save();
        }

        await post.populate({path:"author",select:"-password"});

        return resp.status(201).json({
            message:"new post added",
            post,
            success:true
        })
    } catch (error) {
        console.log(error);
    }
}

export const getAllPosts=async(req,resp)=>{
    try {
        const posts=await Post.find({}).sort({createdAt:-1})
            .populate({ path:"author",select:'username,profilePicture'})
            .populate({
                path:"comments",
                sort:{createdAt:-1},
                populate:{path:"author",select:"username,profilPicture"}
            })
        
        return resp.status(200).json({
            posts,
            success:true
        })
    } catch (error) {
        console.log(error);
    }
}

export const getAuthorPosts=async(req,resp)=>{
    try {
        const authorId=req.id;
        const posts=await Post.findById({author:authorId}).sort({createdAt:-1})
            .populate({ path:"author",select:'username,profilePicture'})
            .populate({
                path:"comments",
                sort:{createdAt:-1},
                populate:{path:"author",select:"username,profilPicture"}
            })
        
        return resp.status(200).json({
            posts,
            success:true
        })
    } catch (error) {
        console.log(error);
    }
}
