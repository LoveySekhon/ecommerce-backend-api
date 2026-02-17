const db = require("../config/db");

/**
 * Create a new order
 */
const createOrder = (userId, totalAmount, callback) => {
    const query = `
        INSERT INTO orders (user_id, total_amount, payment_status, order_status)
        VALUES (?, ?, 'pending', 'pending')
    `;

    db.query(query, [userId, totalAmount], callback);
};


/**
 * Insert order items
 */
const insertOrderItem = (orderId, productId, quantity, priceAtPurchase, callback) => {
    const query = `
        INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase)
        VALUES (?, ?, ?, ?)
    `;

    db.query(query, [orderId, productId, quantity, priceAtPurchase], callback);
};


/**
 * Get user's cart with product prices
 */
const getUserCartWithPrices = (userId, callback) => {
    const query = `
        SELECT 
            cart_items.product_id,
            cart_items.quantity,
            products.price,
            products.stock
        FROM cart_items
        JOIN products ON cart_items.product_id = products.id
        WHERE cart_items.user_id = ?
    `;

    db.query(query, [userId], callback);
};


/**
 * Clear user cart after successful order
 */
const clearUserCart = (userId, callback) => {
    const query = `
        DELETE FROM cart_items
        WHERE user_id = ?
    `;

    db.query(query, [userId], callback);
};


/**
 * Reduce product stock
 */
const reduceProductStock = (productId, quantity, callback) => {
    const query = `
        UPDATE products
        SET stock = stock - ?
        WHERE id = ?
    `;

    db.query(query, [quantity, productId], callback);
};

/**
 * Get all orders for a user with order items
 */
const getUserOrders = (userId, callback) => {

    const query = `
        SELECT 
            orders.id AS order_id,
            orders.total_amount,
            orders.payment_status,
            orders.order_status,
            orders.created_at,
            order_items.product_id,
            order_items.quantity,
            order_items.price_at_purchase,
            products.name,
            products.image_url
        FROM orders
        JOIN order_items ON orders.id = order_items.order_id
        JOIN products ON order_items.product_id = products.id
        WHERE orders.user_id = ?
        ORDER BY orders.created_at DESC
    `;

    db.query(query, [userId], callback);
};

/**
 * Get all orders (Admin)
 */
const getAllOrders = (callback) => {

    const query = `
        SELECT 
            orders.id AS order_id,
            orders.user_id,
            users.name AS customer_name,
            users.email AS customer_email,
            orders.total_amount,
            orders.payment_status,
            orders.order_status,
            orders.created_at,
            order_items.product_id,
            order_items.quantity,
            order_items.price_at_purchase,
            products.name AS product_name
        FROM orders
        JOIN users ON orders.user_id = users.id
        JOIN order_items ON orders.id = order_items.order_id
        JOIN products ON order_items.product_id = products.id
        ORDER BY orders.created_at DESC
    `;

    db.query(query, callback);
};

/**
 * Update order status (Admin)
 */
const updateOrderStatus = (orderId, newStatus, callback) => {

    const query = `
        UPDATE orders
        SET order_status = ?
        WHERE id = ?
    `;

    db.query(query, [newStatus, orderId], callback);
};



module.exports = {
    createOrder,
    insertOrderItem,
    getUserCartWithPrices,
    clearUserCart,
    reduceProductStock,
    getUserOrders, 
    getAllOrders, 
    updateOrderStatus
};

