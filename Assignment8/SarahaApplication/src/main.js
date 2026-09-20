import express from 'express'
import {config} from 'dotenv'
import './common/db/mongoose.js'
import { OTP } from './app/auth/model/otp.model.js';
import * as authRouter from './app/auth/auth.router.js'
config();

const app = express();
app.use(express.json());

app.use('/api/v1', authRouter.authRouter);
app.use((err,req,res,next) => {
    res.status(500).json({
        message : err.message,
        success : false,
        stack : err.stack
    })
})
app.listen(process.env.PORT,() =>{
    console.log("Server is running",process.env.PORT);
});

// OTP.create({
//     code : '123456',
//     email : 'osama@gmail.com',
//     expiresAt : Date.now() + 5*60*1000
// })