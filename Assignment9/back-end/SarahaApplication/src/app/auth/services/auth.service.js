import { sendEmail } from '../../../lib/email/nodemailer.js';
import * as authRepository from '../repositry/auth.repo.js'
import * as otpRepository from '../repositry/otp.repo.js'
import * as userRepo from '../../user/repositry/user.repo.js'

import { toMs } from '../../../pkg/utils/time.js'
import * as errors from '../errors.js'
import * as userErrors from '../../user/errors.js';
import { cacheProvider } from '../../../lib/cache/init.js';
import { generateOtpCode } from '../../../pkg/utils/otp.js'
import {generatToken} from "../../../pkg/utils/token.js";
import {comparePassword, hashPassword} from "../../../pkg/utils/hash.js";
import {expiredOtp} from "../errors.js";
import {verifyGoogleToken} from '../../../lib/utils/GoogleAuth.js'
import {id} from "zod/locales";
import {mailjetProvider} from "../../../lib/email/init.js";

export async function register(userData) {
  
    const userExists = await authRepository.checkUserExistance(userData.email);
    if (userExists) {
        throw userErrors.userAlreadyExists;
    }
    userData.password = await hashPassword(userData.password);

    const createdUser = await authRepository.createUser(userData);

    const otp = generateOtpCode();
    console.log(otp);
    // await otpRepository.createOtp({
    //     code : otp,
    //     email : userData.email,
    //     expiresAt : Date.now() + toMs(5, 'minutes')
    // })
    await cacheProvider.set(`otp:${userData.email}`, otp, toMs(5, 'minutes')); // Store OTP in cache for 5 minutes
    let html =  `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Your verification code</title>
</head>
<body style="margin:0; padding:0; background-color:#0f1115; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;">
 
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f1115; padding:40px 16px;">
    <tr>
      <td align="center">
 
        <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="max-width:480px; width:100%; background-color:#171a21; border:1px solid #2a2f3a; border-radius:14px;">
 
          <!-- Header -->
          <tr>
            <td style="padding:36px 32px 0 32px; text-align:center;">
              <div style="width:48px; height:48px; background-color:#5b8cff; border-radius:12px; margin:0 auto 20px auto; line-height:48px; font-size:22px; color:#ffffff; font-weight:700;">
                S
              </div>
              <h1 style="margin:0 0 8px 0; font-size:20px; color:#e8eaed; font-weight:600;">
                Verify your email
              </h1>
              <p style="margin:0; font-size:14px; line-height:1.6; color:#8b93a3;">
                Use the code below to finish signing in to Saraha. This code expires in 5 minutes.
              </p>
            </td>
          </tr>
 
          <!-- OTP Code -->
          <tr>
            <td style="padding:28px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="background-color:#10131a; border:1.5px solid #2a2f3a; border-radius:10px; padding:20px;">
                    <span style="font-size:32px; font-weight:700; letter-spacing:8px; color:#5b8cff; font-family: 'Courier New', monospace;">
                      ${otp}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
 
          <!-- Note -->
          <tr>
            <td style="padding:0 32px 32px 32px; text-align:center;">
              <p style="margin:0; font-size:13px; line-height:1.6; color:#8b93a3;">
                Didn't request this code? You can safely ignore this email — no changes will be made to your account.
              </p>
            </td>
          </tr>
 
          <!-- Divider -->
          <tr>
            <td style="padding:0 32px;">
              <div style="border-top:1px solid #2a2f3a;"></div>
            </td>
          </tr>
 
          <!-- Footer -->
          <tr>
            <td style="padding:24px 32px 32px 32px; text-align:center;">
              <p style="margin:0; font-size:12px; color:#5a6072;">
                Saraha App &middot; This is an automated message, please don't reply.
              </p>
            </td>
          </tr>
 
        </table>
 
      </td>
    </tr>
  </table>
 
</body>
</html>`
    await mailjetProvider.sendMail(userData.email,'Otp Verification',html)
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
    const otp = await cacheProvider.get(`otp:${userExistance.email}`); // Retrieve OTP from cache
    if(!otp){
        throw errors.otpExpired();
    }
    if(otp.code !== code){
        throw errors.invalidOtp;
    }
    const updatedUser = await userRepo.updateUserByEmail(email,{isVerified : true});

    await cacheProvider.del(`otp:${userExistance.email}`); // Delete OTP from cache

    return updatedUser;

}

export async function enable2stepVarification(email,code) {
    const userExistance = await authRepository.checkUserExistance(email);
    if (!userExistance) {
        throw userErrors.userNotExists;
    }

    const otp = await cacheProvider.get(`otp:${userExistance.email}`); // Retrieve OTP from cache
    if(!otp){
        throw errors.otpExpired();
    }
    if(otp.code !== code){
        throw errors.invalidOtp;
    }
    const updatedUser = await userRepo.updateUserByEmail(email,{is2StepVerified : true});

    await cacheProvider.del(`otp:${userExistance.email}`); // Delete OTP from cache

    return updatedUser;

}

export async function login(email,password) {
    const userExistance = await authRepository.checkUserExistance(email);
    let cachedOtpTries = await cacheProvider.get(`otp:${userExistance.email}`); // Retrieve OTP from cache
    if (!userExistance) {
        throw userErrors.userNotExists;
    }
    if(cachedOtpTries == "0"){
      throw new AppError("Too many failed attempts. Please try again later.", 429);
    }

    const isMatch = await comparePassword(password,userExistance["password"]);
    if(isMatch === false){
        throw errors.invalidCredentials;
    }
    if(userExistance.isVerified === false){
        throw userErrors.userNotVerified;
    }
    if(userExistance.is2StepVerified === false){
        throw userErrors.userNot2StepVerified;
    }
    cacheTTL = await cacheProvider.ttl(`otp:${userExistance.email}`);
    let ttl = cacheTTL=== -2 ? 300 : cacheTTL; // If the key does not exist, set TTL to 5 minutes (300 seconds)
    cachedOtpTries = cachedOtpTries ?? "5"; // Default to 5 tries if not set
    await cacheProvider.set(`otp:${userExistance.email}`, cachedOtpTries - 1, ttl); // Decrement the number of tries and reset the TTL

    const token = await generatToken({id : userExistance._id,email : userExistance.email,username : userExistance.username});
    return { ...userExistance, token };
}

export async function sendOtp(email) {
    
    const userExistance = await authRepository.checkUserExistance(email);

    if(!userExistance){
        throw userErrors.userNotExists;
    }
    await cacheProvider.del(`otp:${userExistance.email}`); // Delete OTP from cache

    const otp = generateOtpCode();
    console.log(otp);
    // await otpRepository.createOtp({
    //     code : otp,
    //     email : email,
    //     expiresAt : Date.now() + toMs(5, 'minutes')
    // })
    await cacheProvider.set(`otp:${userExistance.email}`, otp, toMs(5, 'minutes')); // Store OTP in cache for 5 minutes
    let html =  `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Your verification code</title>
</head>
<body style="margin:0; padding:0; background-color:#0f1115; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;">
 
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f1115; padding:40px 16px;">
    <tr>
      <td align="center">
 
        <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="max-width:480px; width:100%; background-color:#171a21; border:1px solid #2a2f3a; border-radius:14px;">
 
          <!-- Header -->
          <tr>
            <td style="padding:36px 32px 0 32px; text-align:center;">
              <div style="width:48px; height:48px; background-color:#5b8cff; border-radius:12px; margin:0 auto 20px auto; line-height:48px; font-size:22px; color:#ffffff; font-weight:700;">
                S
              </div>
              <h1 style="margin:0 0 8px 0; font-size:20px; color:#e8eaed; font-weight:600;">
                Verify your email
              </h1>
              <p style="margin:0; font-size:14px; line-height:1.6; color:#8b93a3;">
                Use the code below to finish signing in to Saraha. This code expires in 5 minutes.
              </p>
            </td>
          </tr>
 
          <!-- OTP Code -->
          <tr>
            <td style="padding:28px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="background-color:#10131a; border:1.5px solid #2a2f3a; border-radius:10px; padding:20px;">
                    <span style="font-size:32px; font-weight:700; letter-spacing:8px; color:#5b8cff; font-family: 'Courier New', monospace;">
                      ${otp}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
 
          <!-- Note -->
          <tr>
            <td style="padding:0 32px 32px 32px; text-align:center;">
              <p style="margin:0; font-size:13px; line-height:1.6; color:#8b93a3;">
                Didn't request this code? You can safely ignore this email — no changes will be made to your account.
              </p>
            </td>
          </tr>
 
          <!-- Divider -->
          <tr>
            <td style="padding:0 32px;">
              <div style="border-top:1px solid #2a2f3a;"></div>
            </td>
          </tr>
 
          <!-- Footer -->
          <tr>
            <td style="padding:24px 32px 32px 32px; text-align:center;">
              <p style="margin:0; font-size:12px; color:#5a6072;">
                Saraha App &middot; This is an automated message, please don't reply.
              </p>
            </td>
          </tr>
 
        </table>
 
      </td>
    </tr>
  </table>
 
</body>
</html>`
    await mailjetProvider.sendMail(email,'Otp Verification',html)
}

export async function resetPassword(email,code,newPassword) {
    const otp = await cacheProvider.get(`otp:${userExistance.email}`); // Retrieve OTP from cache
    if(!otp){
        throw new expiredOtp;
    }
    if(otp.code !== code){
        throw errors.invalidOtp;
    }
    const cachedOtpTries = await cacheProvider.get(`otpTries:${userExistance.email}`);
    if(!cachedOtpTries){
        throw new AppError("OTP tries not found", 404);
    }
    if(cachedOtpTries == "0"){
        throw new AppError("Too many failed attempts. Please try again later.", 429);
    }
    const hashedPassword = await hashPassword(newPassword);

    userRepo.updateUserByEmail(email, {password:hashedPassword});
    await cacheProvider.del(`otp:${userExistance.email}`); // Delete OTP from cache

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


export async function refreshToken(user){

  return generatToken(user);
}