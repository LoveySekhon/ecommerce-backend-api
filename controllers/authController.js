const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
const { ApiError } = require("../middleware/errorHandler");

/**
 * REGISTER USER
 */
const registerUser = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            throw new ApiError(400, "All fields are required");
        }

        const existingUsers = await userModel.findUserByEmail(email);

        if (existingUsers.length > 0) {
            throw new ApiError(400, "User already exists with this email");
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const result = await userModel.createUser(name, email, hashedPassword);

        const token = jwt.sign(
            { id: result.insertId, email },
            process.env.JWT_SECRET || "defaultsecret",
            { expiresIn: "1d" }
        );

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            token
        });

    } catch (error) {
        next(error);
    }
};


/**
 * LOGIN USER
 */
const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            throw new ApiError(400, "Email and password are required");
        }

        const users = await userModel.findUserByEmail(email);

        if (users.length === 0) {
            throw new ApiError(400, "Invalid email or password");
        }

        const user = users[0];

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            throw new ApiError(400, "Invalid email or password");
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET || "defaultsecret",
            { expiresIn: "1d" }
        );

        res.status(200).json({
            success: true,
            message: "Login successful",
            token
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    registerUser,
    loginUser
};
