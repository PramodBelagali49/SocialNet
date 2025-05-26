import express from "express";
import { addComment, addPost, bookmarkPost, deletePost, getAllPosts, getAuthorPosts, getCommentsOfPost, likePost, unlikePost } from "../controllers/postController.js";
import upload from "../middlewares/multer.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
const router=express.Router();

router.route("/")
        .get(getAllPosts)  // Public route
        .post(upload.single("image"),isAuthenticated,addPost)   // multer middleware for parsing image files

        
router.use(isAuthenticated);   // middleware that applies to all the routes below it 
// Protected routes
router.get("/getAuthorPosts",getAuthorPosts);

router.patch("/:id/likePost",likePost);
router.patch("/:id/unlikePost",unlikePost);

router.post("/:id/addComment",addComment);
router.get("/:id/getCommentsOfPost",getCommentsOfPost);

router.delete("/:id/deletePost",deletePost);
router.patch("/:id/bookmarkPost",bookmarkPost);

export default router;
