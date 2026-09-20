import { Router } from "express";
import * as authController from '../auth/controllers/auth.controller.js'

export const authRouter = Router()

authRouter.post('/register',authController.register);
authRouter.patch('/verify-account',authController.verifyAccount);
authRouter.post('/login',authController.login);
authRouter.post('/send-otp',authController.sendOtp);