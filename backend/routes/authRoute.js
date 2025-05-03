import express from "express";
import {signup,signin, getAllUsers, authorizeAdmin} from "../controller/auth.js"
import { verifyToken } from "../middlewares/authMiddleware.js";


const authRouter = express.Router();

authRouter.post('/signup',signup);
authRouter.post('/signin',signin);
authRouter.get('/getUser', verifyToken, authorizeAdmin, getAllUsers);

export default authRouter;
















