import * as userService from '../services/user.service.js';

export async function uploadUserPic(req, res,next) {
    try {
        const id = req.user.id;
        await userService.uploadUserPic(id,req.file);

        res.status(200).json({message:"Successfully updated profilePic",success:true});
    } catch (e) {
        next(e);
    }
}