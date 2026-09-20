import { sendEmail } from '../../../common/email/nodemailer.js';
import * as authRepository from '../repositry/auth.repo.js'
import * as otpRepository from '../repositry/otp.repo.js'
import * as userRepo from '../../user/repositry/user.repo.js'
import bcrypt from 'bcryptjs' 
import { toMs } from '../../../common/utils/time.js'
import * as errors from '../errors.js'
import * as userErrors from '../../user/errors.js';
import jwt from 'jsonwebtoken'
import { generateOtpCode } from '../../../common/utils/otp.js'

export async function register(userData) {
    const userExists = await authRepository.checkUserExistance(userData.email);
    if (userExists) {
        throw userErrors.userAlreadyExists();
    }
    userData.password = await bcrypt.hash(userData.password,10);

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
        throw userErrors.userNotExists();
    }
    if(userExistance.isVerified === true){
        throw userErrors.userAlreadyVerified();
    }
    const otp = await otpRepository.getOtp(email);
    if(!otp){
        throw errors.otpExpired();
    }
    if(otp.code !== code){
        throw errors.invalidOtp();
    }
    const updatedUser = await userRepo.updateUserByEmail(email,{isVerified : true});

    await otpRepository.deleteOtp(email);

    return updatedUser;

}

export async function login(email,password) {
    const userExistance = await authRepository.checkUserExistance(email);
    if (!userExistance) {
        throw userErrors.userNotExists();
    }
    if(userExistance.isVerified === false){
        throw userErrors.userNotVerified();
    }
    const isMatch = await bcrypt.compare(password,userExistance.password);
    if(!isMatch){
        throw errors.invalidCredentials();
    }
    const token = jwt.sign({id : userExistance._id,email : userExistance.email,username : userExistance.username},process.env.JWT_SECRET,{expiresIn : '1h'});
    return { ...userExistance, token };
}

export async function sendOtp(email) {
    
    const userExistance = await authRepository.checkUserExistance(email);

    if(!userExistance){
        throw userErrors.userNotExists();
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