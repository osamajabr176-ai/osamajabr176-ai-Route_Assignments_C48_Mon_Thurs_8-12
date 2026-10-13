import express from 'express'
import './lib/db/mongoose.js'
import cors from 'cors'
import * as authRouter from './app/auth/auth.router.js'
import {globalErrorHandler} from "./lib/error/error.handler.js";
import {appRouter} from "./routes.js";
import {correlationId} from "./pkg/correlation/correlationId.js";
import cookieParser from "cookie-parser";



export function createApp() {
    const app = express();
    
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