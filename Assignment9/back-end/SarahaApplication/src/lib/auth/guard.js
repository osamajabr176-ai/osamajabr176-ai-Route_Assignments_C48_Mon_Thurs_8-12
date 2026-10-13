import {AppError} from "../error/error.js";
import jwt from "jsonwebtoken";
import {env} from "../config/env.js";


export const authGuard = async   (req, res, next) => {
    
    const token = req.cookies.access_token;

    if (!token) {
        throw new AppError("no token found", 403);
    }

    req.user = await jwt.verify(token, env.jwt.secret);

    next();
};