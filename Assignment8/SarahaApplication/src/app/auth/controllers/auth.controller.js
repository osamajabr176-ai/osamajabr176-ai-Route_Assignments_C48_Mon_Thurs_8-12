import * as authService from '../services/auth.service.js'
import { toMs } from '../../../common/utils/time.js'

export async function register(req , res , next) {
    try {
        const createdUser = await authService.register(req.body);
        res.status(201).json({
            message : "User creates succesfully",
            success : true,
            user : createdUser
                })
    } catch (error) {
        next(error)
    }
}
export async function verifyAccount(req , res , next) {
    try {
        const {email,code} = req.body;
        const updatedUser = await authService.verifyAccount(email,code);
        res.status(200).json({
            message : "User verified succesfully",
            success : true,
            user : updatedUser
                })
    } catch (error) {
        next(error)
    }
}

export async function login(req , res , next) {
    try {
        const {email,password} = req.body;
        const {user,token} = await authService.login(email,password);
        res.cookie('access_token', token, { httpOnly: true, secure: true,maxAge: toMs(1,'hours'), sameSite: 'strict' });
        res.status(200).json({
            message : "User logged in succesfully",
            success : true,
            user : user
                })
    }
        catch (error) {
        next(error);
    }
}

export async function sendOtp(req , res , next) {
    try {
        const {email} = req.body;
        await authService.sendOtp(email);
        res.status(200).json({
            message : "Otp sent succesfully",
            success : true
                })
    } catch (error) {
        next(error);
    }
}
