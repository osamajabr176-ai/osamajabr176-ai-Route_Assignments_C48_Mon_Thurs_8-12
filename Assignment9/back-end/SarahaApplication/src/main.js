import express from 'express'
import {config} from 'dotenv'
import './common/db/mongoose.js'
import { OTP } from './app/auth/model/otp.model.js';
import cors from 'cors'
import * as authRouter from './app/auth/auth.router.js'
import {logger} from "./common/logger/logger.js";
config();

const app = express();
app.use(express.json());
app.use(cors({origin: ['http://localhost:3000','http://localhost:4200','http://localhost:5173'],
                credentials: true,
}));
app.use('/api/v1', authRouter.authRouter);
app.use((err,req,res,next) => {
    console.log(err);
    logger.error(err.message);
    if (err.isOperational === true) {
    return res.status(err.statusCode).json({
        message: err.message,
        success: false,
        stack: err.stack
    });

    }
    return res.status(500).json({
        message: "Something went wrong",
        success: false
    });

})
app.listen(process.env.PORT,() =>{
    logger.info("Server is running", {port:process.env.PORT});
});

