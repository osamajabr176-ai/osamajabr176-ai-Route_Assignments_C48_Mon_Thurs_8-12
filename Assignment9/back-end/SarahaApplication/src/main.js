import express from 'express'
import './lib/db/mongoose.js'
import cors from 'cors'
import * as authRouter from './app/auth/auth.router.js'
import {globalErrorHandler} from "./lib/error/error.handler.js";
import {appRouter} from "./routes.js";
import {correlationId} from "./pkg/correlation/correlationId.js";
import cookieParser from "cookie-parser";
import {rateLimit} from "express-rate-limit";


export function createApp() {
    const app = express();

    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
        standardHeaders: "draft-8", // Return rate limit info in the `RateLimit-*` headers
        legacyHeaders: false, // Disable the `X-RateLimit-*` headers
        handler: (req, res,next) => {
            next(new AppError(this.message, this.statusCode));
        }
    });
    app.use(limiter);
    app.use(express.json());

    app.use('/src',express.static('uploads'));

    app.use(cookieParser());
    
    app.use(correlationId);

    app.use('/api',appRouter);

    app.use(globalErrorHandler)

    app.use(cors({origin: ['http://localhost:3000','http://localhost:4200','http://localhost:5173'],
        credentials: true,
    }));




return app;
}