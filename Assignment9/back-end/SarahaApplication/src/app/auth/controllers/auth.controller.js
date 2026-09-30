import * as authService from '../services/auth.service.js'
import { toMs } from '../../../common/utils/time.js'
import {validation} from "../../../common/validation/validation.js";
import {LoginDTO, registerDTO, resetPasswordDTO, sendOtpDTO, verifyAccountDTO} from "../dto/auth.dto.js";


export async function register(req , res , next) {
    try {
        const data = validation(registerDTO,req.body);
        console.log(data);
        const createdUser = await authService.register(data);
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
        const data = validation(verifyAccountDTO,req.body);
        const {email,code} = data;
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
        const data = validation(LoginDTO,req.body);
        const {email,password} = data;
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
        const data = validation(sendOtpDTO,req.body);
        const {email} = data;
        await authService.sendOtp(email);
        res.status(200).json({
            message : "Otp sent succesfully",
            success : true
                })
    } catch (error) {
        next(error);
    }
}

export async function resetPassword(req , res , next) {
    try {
        const data = validation(resetPasswordDTO,req.body);
        const {email,code,newPassword} = data;
        await authService.resetPassword(email,code,newPassword);
        res.sendStatus(204);
    } catch (err) {
        next(err);
    }
}

export async function loginWithGoogle(req , res , next) {
    try {

        const token =  await authService.loginWithGoogle(req.body.idToken);
        res.cookie('access_token',token,{
            httpOnly: true,
            maxAge:toMs(1,'hours'),
            sameSite: 'strict'
        })
        res.status(200).json({
            message : "User logged in succesfully",
            success : true
        })

    } catch (err){
        next(err);
    }
}