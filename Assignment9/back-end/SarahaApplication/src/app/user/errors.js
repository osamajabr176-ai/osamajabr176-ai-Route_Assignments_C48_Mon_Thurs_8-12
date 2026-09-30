import {AppError} from "../../common/error/error.js";

export const userNotExists = new AppError("User not exists",404);
export const userAlreadyExists= new AppError("User already exists",409);
export const userAlreadyVerified = new AppError("User already verified",400);
export const userNotVerified = new AppError("The user is not verified",403);