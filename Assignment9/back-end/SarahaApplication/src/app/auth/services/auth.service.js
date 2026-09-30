import { sendEmail } from '../../../common/email/nodemailer.js';
import * as authRepository from '../repositry/auth.repo.js'
import * as otpRepository from '../repositry/otp.repo.js'
import * as userRepo from '../../user/repositry/user.repo.js'

import { toMs } from '../../../common/utils/time.js'
import * as errors from '../errors.js'
import * as userErrors from '../../user/errors.js';

import { generateOtpCode } from '../../../common/utils/otp.js'
import {generatToken} from "../../../common/utils/token.js";
import {comparePassword, hashPassword} from "../../../common/utils/hash.js";
import {expiredOtp} from "../errors.js";
import {verifyGoogleToken} from '../../../common/utils/GoogleAuth.js'
import {id} from "zod/locales";

export async function register(userData) {
    const userExists = await authRepository.checkUserExistance(userData.email);
    if (userExists) {
        throw userErrors.userAlreadyExists;
    }
    userData.password = await hashPassword(userData.password);

    const createdUser = await authRepository.createUser(userData);

    const otp = generateOtpCode();
    console.log(otp);
    await otpRepository.createOtp({
        code : otp,
        email : userData.email,
        expiresAt : Date.now() + toMs(5, 'minutes')
    })
    await sendEmail(userData.email,otp,"Otp Verification")
    return createdUser
}

export async function verifyAccount(email,code) {
    const userExistance = await authRepository.checkUserExistance(email);
    if (!userExistance) {
        throw userErrors.userNotExists;
    }
    if(userExistance.isVerified === true){
        throw userErrors.userAlreadyVerified;
    }
    const otp = await otpRepository.getOtp(email);
    if(!otp){
        throw errors.otpExpired();
    }
    if(otp.code !== code){
        throw errors.invalidOtp;
    }
    const updatedUser = await userRepo.updateUserByEmail(email,{isVerified : true});

    await otpRepository.deleteOtp(email);

    return updatedUser;

}

export async function login(email,password) {
    const userExistance = await authRepository.checkUserExistance(email);
    if (!userExistance) {
        throw userErrors.userNotExists;
    }

    const isMatch = await comparePassword(password,userExistance["password"]);
    if(isMatch === false){
        throw errors.invalidCredentials;
    }
    if(userExistance.isVerified === false){
        throw userErrors.userNotVerified;
    }
    const token = generatToken({id : userExistance._id,email : userExistance.email,username : userExistance.username});
    return { ...userExistance, token };
}

export async function sendOtp(email) {
    
    const userExistance = await authRepository.checkUserExistance(email);

    if(!userExistance){
        throw userErrors.userNotExists;
    }
    await otpRepository.deleteOtp(email);

    const otp = generateOtpCode();
    console.log(otp);
    await otpRepository.createOtp({
        code : otp,
        email : email,
        expiresAt : Date.now() + toMs(5, 'minutes')
    })
    await sendEmail(email,otp,"new Otp code")
}

export async function resetPassword(email,code,newPassword) {
    const otp = await otpRepository.getOtp(email);
    if(!otp){
        throw new expiredOtp;
    }
    const hashedPassword = await hashPassword(newPassword);

    userRepo.updateUserByEmail(email, {password:hashedPassword});
    otpRepository.deleteOtp(email);

}



export async function loginWithGoogle(idToken){

    const payload = await verifyGoogleToken(idToken);

    const user = await authRepository.checkUserExistance(payload.email);

    if(user){
        return generatToken({
            user_id : user._id,
            email : user.email,
        })
    }
    const createdUser = await authRepository.createUser({
        name:payload.name,
        email:payload.email,
        provider: 'google',
        isVerified : true
    });

    return generatToken({
        _id:createdUser._id,
        email:createdUser.email,

    });
}