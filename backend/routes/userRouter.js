import express from "express";
import {  acceptTerms, changePassword, getUser, loginUser, registerUser } from "../controllers/userContoller.js";
import { protect } from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.get('/data',protect, getUser)
userRouter.post('/changepassword',protect, changePassword)
userRouter.post('/accept-terms',protect, acceptTerms)

export default userRouter;