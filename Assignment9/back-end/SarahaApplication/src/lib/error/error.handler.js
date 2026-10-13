import {logger} from "../../pkg/logger/logger.js";

export function globalErrorHandler(err,req, res, _next) {

        console.log(err);
        logger.error(err.message);
        if (err.isOperational === true) {
            return res.status(err.statusCode).json({
                message: err.message,
                success: false,
                stack: err.stack,
                correlationId: req.correlationId,
            });

        }
        return res.status(500).json({
            message: "Something went wrong",
            success: false
        });


}