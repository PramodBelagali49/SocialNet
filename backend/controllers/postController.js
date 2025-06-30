import Post from "../models/post.js";
import User from "../models/user.js";
import sharp from "sharp"
import cloudinary from "../utils/cloudinary_config.js";
import Comment from "../models/comment.js";
import { getReceiverSocketId } from "../socket/socket.js";

export const addPost=async(req,resp)=>{
    try {
        if(!req.body){
            return resp.status(400).json({message:`req.body is required: ${req.body}`})
        }
        const caption=req.body.caption;
        const image=req.file;
        const authorId=req.id;

        if(!image) return resp.status(400).json({message:"Image is required"})
        
        const optimizedImageBuffer=await sharp(image.buffer)
                                    .resize({width:800,height:800,fit:"inside"})
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

        await post.populate({path:"author",select:"-password -email"});

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
            .populate({ path:"author",select:'username profilePicture'})
            .populate({
                path:"comments",
                sort:{createdAt:-1},
                populate:{path:"author",select:"username profilPicture"}
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
        const posts=await Post.find({author:authorId}).sort({createdAt:-1})
            .populate({ path:"author",select:'username profilePicture'})
            .populate({
                path:"comments",
                sort:{createdAt:-1},
                populate:{path:"author",select:"username profilPicture"}
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
        const userId=req.id;  // userId is the id of one who likes the post
        const post=await Post.findById(postId);

        if(!post) return resp.status(404).json({message:"Post Not Found",success:false})
            // logic for like
        await post.updateOne({$addToSet:{likes:userId}})
        await post.save()

            // implementation of Socket.io for RTN
        const user=await User.findById(userId).select("username profilePicture");
        const postOwnerId=post?.author.toString();
        if(postOwnerId !== userId){
            const notification={
                type:"like",
                userId:userId,
                userDetails:user,
                postId,
                message:"Your post was liked"
            }
            const postOwnerSocketId=getReceiverSocketId(postOwnerId);
            io.to(postOwnerSocketId).emit("likeNotification",notification);
        }

        return resp.status(200).json({message:"Post liked",success:true})
    } catch (error) {
        console.log("galati in likePost backend ",error);
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
        const user=await User.findById(userId).select("username profilePicture");
        const postOwnerId=post?.author.toString();
        if(postOwnerId !== userId){
            const notification={
                type:"dislike",
                userId:userId,
                userDetails:user,
                postId,
                message:"Your post was disliked"
            }

            const postOwnerSocketId=getReceiverSocketId(postOwnerId);
            io.to(postOwnerSocketId).emit("dislikeNotification",notification);
        }

        return resp.status(200).json({message:"Post unliked",success:true})
    } catch (error) {
        console.log("galati in unlikePost backend ",error);
    }
}


export const addComment=async(req,resp)=>{
    try {
        const userId=req.id;
        const postId=req.params.id;
        const post=await Post.findById(postId);
        if(!post) return resp.status(400).json({message:"Post Not Found",success:false})
        
        if(!req.body){
            return resp.status(400).json({message:`req.body is required: ${req.body}`})
        }
        
        const {text}=req.body;
        if(!text) return resp.status(400).json({message:"comment text required",success:false})

        const comment=await Comment.create({
            text,
            author:userId,
            post:postId
        })

        const populatedComment=await comment.populate({
            path:"author",
            select:"username profilePicture"
        });

        post.comments.push(comment._id);
        await post.save();

        return resp.status(201).json({
            message:"Comment added",
            comment:populatedComment,
            success:true
        })
    } catch (error) {
        console.log(error);
    }
}

export const getCommentsOfPost=async(req,resp)=>{
    try {
        const postId=req.params.id;
        const comments=await Comment.find({post:postId}).populate("author","username profilePicture");
        if(comments.length==0) return resp.status(200).json({message:"No comments yet..",success:false});
        return resp.status(200).json({comments,success:true})
    } catch (error) {
        console.log(error);
    }
}

export const deletePost=async(req,resp)=>{
    try {
        const postId=req.params.id;
        const authorId=req.id;

        const post=await Post.findById(postId);
        if(!post) return resp.status(400).json({message:"Post Not Found",success:false})
            
            // authorization of the owner of the post
        if(post.author.toString() !== authorId) return resp.status(403).json({message:"You are NOT authorized to delete post"})
            
            // delete the post
        await Post.findByIdAndDelete(postId);
            
            // remove the postId entry from the user's posts
        const user=await User.findById(authorId);
        user.posts=user.posts.filter(id => id.toString() != postId)
        await user.save();

            // delete the associated comments
        await Comment.deleteMany({post:postId});

        return resp.status(200).json({message:"Post deleted",success:true});

    } catch (error) {
        console.log(error);
    }
}

export const bookmarkPost=async(req,resp)=>{
    try {
        const postId=req.params.id;
        const authorId=req.id;

        const post=await Post.findById(postId)
        if(!post) return resp.status(400).json({message:"Post Not Found",success:false})

        const user=await User.findById(authorId);

        if(user.bookmarks.includes(postId)){
            // remove from bookmark
            await User.updateOne({_id:authorId},{$pull:{bookmarks:post._id}})
            await user.save()
            return resp.status(200).json({type:"unsaved",message:"Post removed from bookmarks",success:true})
        }else{
            // Add to bookmark
            await User.updateOne({_id:authorId},{$addToSet:{bookmarks:post._id}})
            await user.save()
            return resp.status(200).json({type:"saved",message:"Post bookmarked",success:true})
        }
    } catch (error) {
        console.log(error);
    }
}