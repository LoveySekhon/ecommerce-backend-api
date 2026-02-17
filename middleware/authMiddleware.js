const jwt = require("jsonwebtoken");

/**
 * AUTHENTICATION MIDDLEWARE
 * Verifies JWT token before allowing access to protected routes
 */
const authenticateUser = (req, res, next) => {

    // 1️⃣ Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "Access denied. No token provided."
        });
    }

    const token = authHeader.split(" ")[1];

    try {
        // 2️⃣ Verify token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || "defaultsecret"
        );

        // 3️⃣ Attach user data to request object
        req.user = decoded;

        // 4️⃣ Move to next middleware/controller
        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token."
        });
    }
};

/**
 * AUTHORIZATION MIDDLEWARE
 * Allows access only to users with admin role
 */
const authorizeAdmin = (req, res, next) => {

    // Check if user exists and role is admin
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({
            success: false,
            message: "Access denied. Admin privileges required."
        });
    }

    next();
};


module.exports = {
    authenticateUser,
    authorizeAdmin
};
