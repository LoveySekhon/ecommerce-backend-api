const db = require("../config/db");

/**
 * Find cart item
 */
const findCartItem = async (userId, productId) => {
    const query = `
        SELECT * FROM cart_items
        WHERE user_id = ? AND product_id = ?
    `;
    const [rows] = await db.query(query, [userId, productId]);
    return rows;
};

/**
 * Add to cart
 */
const addToCart = async (userId, productId, quantity) => {
    const query = `
        INSERT INTO cart_items (user_id, product_id, quantity)
        VALUES (?, ?, ?)
    `;
    const [result] = await db.query(query, [userId, productId, quantity]);
    return result;
};

/**
 * Update cart quantity
 */
const updateCartQuantity = async (userId, productId, quantity) => {
    const query = `
        UPDATE cart_items
        SET quantity = ?
        WHERE user_id = ? AND product_id = ?
    `;
    const [result] = await db.query(query, [quantity, userId, productId]);
    return result;
};

/**
 * Get user cart with product details
 */
const getUserCart = async (userId) => {
    const query = `
        SELECT 
            cart_items.id,
            cart_items.quantity,
            products.id AS product_id,
            products.name,
            products.price,
            products.image_url
        FROM cart_items
        JOIN products ON cart_items.product_id = products.id
        WHERE cart_items.user_id = ?
    `;
    const [rows] = await db.query(query, [userId]);
    return rows;
};

/**
 * Remove from cart
 */
const removeFromCart = async (userId, productId) => {
    const query = `
        DELETE FROM cart_items
        WHERE user_id = ? AND product_id = ?
    `;
    const [result] = await db.query(query, [userId, productId]);
    return result;
};

module.exports = {
    findCartItem,
    addToCart,
    updateCartQuantity,
    getUserCart,
    removeFromCart
};
