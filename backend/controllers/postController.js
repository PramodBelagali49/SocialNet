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


export const likePost = async (req, resp) => {
    try {
        const postId=req.params.id;
        const userId=req.id;
        const post=await Post.findById(postId);

        if(!post) return resp.status(404).json({message:"Post Not Found",success:false})
            // logic for like
        await post.updateOne({$addToSet:{likes:userId}})
        await post.save()

            // implementation of Socket.io for RTN

        return resp.status(200).json({message:"Post liked",success:true})
    } catch (error) {
        console.log(error);
    }
}

export const unlikePost = async (req, resp) => {
    try {
        const postId=req.params.id;
        const userId=req.id;
        const post=await Post.findById(postId);

        if(!post) return resp.status(404).json({message:"Post Not Found",success:false})
            // logic for unlike
        await post.updateOne({$pull:{likes:userId}})
        await post.save()

            // implementation of Socket.io for RTN

        return resp.status(200).json({message:"Post unliked",success:true})
    } catch (error) {
        console.log(error);
    }
}


export const addComment=async(req,resp)=>{
    try {
        const userId=req.id;
        const postId=req.params.id;
        const post=await Post.findById(postId);
        if(!post) return resp.status(400).json({message:"Post Not Found",success:false})

        const text=req.body.text;
        if(!text) return resp.status(404).json({message:"comment text required",success:false})

        const comment=await Comment.create({
            text,
            author:userId,
            post:postId
        }).populate({
            path:"author",
            select:"username,profilePicture"
        });
        await comment.save();   //  check if it is required or not

        post.comments.push(comment._id);
        await post.save();

        return resp.status(201).json({
            message:"Comment added",
            comment,
            success:true
        })
    } catch (error) {
        console.log(error);
    }
}

export const getCommentsOfPost=async(req,resp)=>{
    try {
        const postId=req.params.id;
        const userId=req.id;

        const comments=await Comment.find({post:postId}).populate("author","username,profilePicture");
        if(!comments) return resp.status(404).json({message:"No comments yet..",success:false});

        return resp.status(200).json({comments,success:true})
    } catch (error) {
        console.log(error);
    }
}
