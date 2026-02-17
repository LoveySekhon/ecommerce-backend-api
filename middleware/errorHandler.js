/**
 * Custom API Error Class
 */
class ApiError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * Global Error Handling Middleware
 */
const errorMiddleware = (err, req, res, next) => {

    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error",
        // Hide stack in production later
        stack: process.env.NODE_ENV === "production" ? null : err.stack
    });
};

module.exports = {
    ApiError,
    errorMiddleware
};
