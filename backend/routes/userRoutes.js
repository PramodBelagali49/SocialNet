import express from "express";
import { editProfile, followUnfollow, getProfile, getSuggestedUsers, login, logout, signup } from "../controllers/userController.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../middlewares/multer.js";

const router=express.Router();

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/:id/profile").get(isAuthenticated,getProfile);
router.route("/profile/edit").post(isAuthenticated,upload.single("profilePicture"),editProfile);
router.route("/suggested").get(isAuthenticated,getSuggestedUsers);
router.route("/followUnfollow/:id").post(isAuthenticated,followUnfollow);

export default router;
