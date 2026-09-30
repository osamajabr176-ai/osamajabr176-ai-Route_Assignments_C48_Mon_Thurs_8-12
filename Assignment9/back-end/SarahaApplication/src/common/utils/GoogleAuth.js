import {OAuth2Client} from "google-auth-library";

import {AppError} from "../error/error.js";
import {configDotenv} from "dotenv";
configDotenv();

const client = new OAuth2Client(
    process.env.Client_ID,
    process.env.Client_secret,
    'postmessage'
);
export async function verifyGoogleToken(idToken) {
    try {


        const ticket = await client.verifyIdToken({
            idToken: idToken,
            audience: process.env.Client_ID
        });
        return ticket.getPayload();

    }catch (err){
        throw new AppError("Invalid google token",403);
    }
}