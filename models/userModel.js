const db = require("../config/db");

/**
 * Find user by email
 */
const findUserByEmail = async (email) => {
    const query = "SELECT * FROM users WHERE email = ?";
    const [rows] = await db.query(query, [email]);
    return rows;
};

/**
 * Create new user
 */
const createUser = async (name, email, hashedPassword) => {
    const query = `
        INSERT INTO users (name, email, password)
        VALUES (?, ?, ?)
    `;
    const [result] = await db.query(query, [name, email, hashedPassword]);
    return result;
};

module.exports = {
    findUserByEmail,
    createUser
};
