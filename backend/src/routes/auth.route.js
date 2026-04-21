import { Router } from "express";
import {registerValidation , loginValidation} from '../validator/auth.validator.js'
import authController from "../controller/auth.controller.js";
import passport from "passport";
import { authUser } from "../middleware/auth.middleware.js";
const authRouter= Router()

authRouter.post("/register",registerValidation,authController.register)
authRouter.post("/login",loginValidation,authController.login)
authRouter.get("/google", passport.authenticate('google', { scope: ['profile', 'email'] }))
authRouter.get("/google/callback",passport.authenticate("google",{session:false}),authController.google)
authRouter.get("/getMe",authUser,authController.getMe)
authRouter.delete("/logout",authUser,authController.logout)
 
export default authRouter