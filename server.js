const express = require("express"); // For creating the server and handling routes
const cors = require("cors"); // For handling Cross-Origin Resource Sharing
require("dotenv").config();
require("./config/db");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const { errorMiddleware } = require("./middleware/errorHandler");


const authRoutes = require("./routes/authRoutes");


const app = express();

// Middleware
app.use(cors());
app.use(express.json());

/**
 * SECURITY MIDDLEWARE
 */

// Enable Helmet (secure HTTP headers)
app.use(helmet());

// Enable CORS (Allow frontend later)
app.use(cors({
    origin: process.env.NODE_ENV === "production"
        ? "https://your-frontend-domain.com"
        : "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
}));


// Rate Limiter (Protect against brute force)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per window
    message: {
        success: false,
        message: "Too many requests from this IP, please try again later."
    }
});

app.use(limiter);

// Auth Routes
app.use("/api/auth", authRoutes);

// Product Routes
app.use("/api/products", productRoutes);

// Cart Routes
app.use("/api/cart", cartRoutes);

// Order Routes
app.use("/api/orders", orderRoutes);

// Analytics Routes
app.use("/api/analytics", analyticsRoutes);

// Test route
app.get("/", (req, res) => {
    res.send("E-Commerce API is running...");
});


const { authenticateUser, authorizeAdmin } = require("./middleware/authMiddleware");

// Test Protected Route
app.get("/api/protected", authenticateUser, (req, res) => {
    res.json({
        success: true,
        message: "You have accessed a protected route",
        user: req.user
    });
});

// Admin-only test route
app.get("/api/admin", authenticateUser, authorizeAdmin, (req, res) => {
    res.json({
        success: true,
        message: "Welcome Admin",
        user: req.user
    });
});

/**
 * HEALTH CHECK ROUTE
 */
app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "API is healthy",
        environment: process.env.NODE_ENV,
        timestamp: new Date()
    });
});


// Global Error Handler
app.use(errorMiddleware);



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
