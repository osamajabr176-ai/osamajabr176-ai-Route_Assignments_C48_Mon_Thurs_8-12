import jwt from "jsonwebtoken";

export async function generatToken(payload){
    return jwt.sign(payload,process.env.JWT_SECRET,{expiresIn: '1h'});
}