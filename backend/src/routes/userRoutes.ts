import { Router } from "express";
import UserController from "../controllers/userController.js";

const userRouter = Router();

// Get user profile by ID
// userRouter.post('/api/user/get-profile', UserController.getProfile.bind(UserController));

// Update user profile
userRouter.post('/api/user/update-profile', UserController.updateProfile.bind(UserController));

// delete user
userRouter.post('/api/user/delete-profile', UserController.deleteProfile.bind(UserController));

export default userRouter