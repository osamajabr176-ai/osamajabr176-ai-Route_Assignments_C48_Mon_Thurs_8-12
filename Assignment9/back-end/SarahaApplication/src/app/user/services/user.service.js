import {userNotExists} from "../errors.js";
import * as userRepo from '../repositry/user.repo.js'
import fs from "node:fs";


export async function uploadUserPic(id,file) {
    const user = await userRepo.findUserById(id);
    if (!user) {
        throw userNotExists;
    }
    if (user.profilePicPath){
        fs.unlinkSync(user.profilePicPath)
    }
    await userRepo.updateUserByEmail(user.email,{profilePicPath:file.path})
 }