const db = require("../config/db");
const { ApiError } = require("../middleware/errorHandler");

/**
 * CREATE ORDER (Async + Transaction)
 */
const createOrder = async (req, res, next) => {

    const userId = req.user.id;
    const connection = await db.getConnection();

    try {

        await connection.beginTransaction();

        // 1️⃣ Fetch cart items with product data
        const cartQuery = `
            SELECT 
                cart_items.product_id,
                cart_items.quantity,
                products.price,
                products.stock
            FROM cart_items
            JOIN products ON cart_items.product_id = products.id
            WHERE cart_items.user_id = ?
        `;

        const [cartItems] = await connection.query(cartQuery, [userId]);

        if (cartItems.length === 0) {
            throw new ApiError(400, "Cart is empty");
        }

        // 2️⃣ Validate stock + calculate total
        let totalAmount = 0;

        for (let item of cartItems) {

            if (item.quantity > item.stock) {
                throw new ApiError(
                    400,
                    `Insufficient stock for product ID ${item.product_id}`
                );
            }

            totalAmount += item.quantity * item.price;
        }

        // 3️⃣ Create order
        const orderQuery = `
            INSERT INTO orders (user_id, total_amount, payment_status, order_status)
            VALUES (?, ?, 'pending', 'pending')
        `;

        const [orderResult] = await connection.query(orderQuery, [
            userId,
            totalAmount
        ]);

        const orderId = orderResult.insertId;

        // 4️⃣ Insert order items + reduce stock
        for (let item of cartItems) {

            const orderItemQuery = `
                INSERT INTO order_items 
                (order_id, product_id, quantity, price_at_purchase)
                VALUES (?, ?, ?, ?)
            `;

            await connection.query(orderItemQuery, [
                orderId,
                item.product_id,
                item.quantity,
                item.price
            ]);

            const stockUpdateQuery = `
                UPDATE products
                SET stock = stock - ?
                WHERE id = ?
            `;

            await connection.query(stockUpdateQuery, [
                item.quantity,
                item.product_id
            ]);
        }

        // 5️⃣ Clear cart
        await connection.query(
            `DELETE FROM cart_items WHERE user_id = ?`,
            [userId]
        );

        // 6️⃣ Commit transaction
        await connection.commit();

        res.status(201).json({
            success: true,
            message: "Order placed successfully",
            orderId,
            totalAmount
        });

    } catch (error) {

        await connection.rollback();
        next(error);

    } finally {
        connection.release();
    }
};


/**
 * GET MY ORDERS (Async)
 */
const getMyOrders = async (req, res, next) => {
    try {
        const userId = req.user.id;

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

        const [results] = await db.query(query, [userId]);

        if (results.length === 0) {
            return res.status(200).json({
                success: true,
                orders: []
            });
        }

        const ordersMap = {};

        results.forEach(row => {

            if (!ordersMap[row.order_id]) {
                ordersMap[row.order_id] = {
                    order_id: row.order_id,
                    total_amount: row.total_amount,
                    payment_status: row.payment_status,
                    order_status: row.order_status,
                    created_at: row.created_at,
                    items: []
                };
            }

            ordersMap[row.order_id].items.push({
                product_id: row.product_id,
                name: row.name,
                image_url: row.image_url,
                quantity: row.quantity,
                price_at_purchase: row.price_at_purchase
            });
        });

        res.status(200).json({
            success: true,
            count: Object.keys(ordersMap).length,
            orders: Object.values(ordersMap)
        });

    } catch (error) {
        next(error);
    }
};


/**
 * ADMIN: GET ALL ORDERS (Async)
 */
const getAllOrders = async (req, res, next) => {
    try {

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

        const [results] = await db.query(query);

        if (results.length === 0) {
            return res.status(200).json({
                success: true,
                orders: []
            });
        }

        const ordersMap = {};

        results.forEach(row => {

            if (!ordersMap[row.order_id]) {
                ordersMap[row.order_id] = {
                    order_id: row.order_id,
                    user_id: row.user_id,
                    customer_name: row.customer_name,
                    customer_email: row.customer_email,
                    total_amount: row.total_amount,
                    payment_status: row.payment_status,
                    order_status: row.order_status,
                    created_at: row.created_at,
                    items: []
                };
            }

            ordersMap[row.order_id].items.push({
                product_id: row.product_id,
                product_name: row.product_name,
                quantity: row.quantity,
                price_at_purchase: row.price_at_purchase
            });
        });

        res.status(200).json({
            success: true,
            count: Object.keys(ordersMap).length,
            orders: Object.values(ordersMap)
        });

    } catch (error) {
        next(error);
    }
};


/**
 * ADMIN: UPDATE ORDER STATUS (Async)
 */
const updateOrderStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const allowedStatuses = ["pending", "shipped", "delivered", "cancelled"];

        if (!allowedStatuses.includes(status)) {
            throw new ApiError(400, "Invalid order status value");
        }

        const query = `
            UPDATE orders
            SET order_status = ?
            WHERE id = ?
        `;

        const [result] = await db.query(query, [status, id]);

        if (result.affectedRows === 0) {
            throw new ApiError(404, "Order not found");
        }

        res.status(200).json({
            success: true,
            message: "Order status updated successfully"
        });

    } catch (error) {
        next(error);
    }
};




module.exports = {
    createOrder,
    getMyOrders,
    getAllOrders,
    updateOrderStatus
};


