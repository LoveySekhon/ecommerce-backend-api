const db = require("../config/db");

/**
 * ADMIN DASHBOARD SUMMARY
 */
const getDashboardSummary = async (req, res, next) => {
    try {

        // 1️⃣ Total Revenue
        const [revenueResult] = await db.query(`
            SELECT IFNULL(SUM(total_amount), 0) AS totalRevenue
            FROM orders
            WHERE payment_status = 'pending' OR payment_status = 'paid'
        `);

        // 2️⃣ Total Orders
        const [ordersResult] = await db.query(`
            SELECT COUNT(*) AS totalOrders
            FROM orders
        `);

        // 3️⃣ Total Products
        const [productsResult] = await db.query(`
            SELECT COUNT(*) AS totalProducts
            FROM products
        `);

        // 4️⃣ Total Users
        const [usersResult] = await db.query(`
            SELECT COUNT(*) AS totalUsers
            FROM users
        `);

        res.status(200).json({
            success: true,
            dashboard: {
                totalRevenue: revenueResult[0].totalRevenue,
                totalOrders: ordersResult[0].totalOrders,
                totalProducts: productsResult[0].totalProducts,
                totalUsers: usersResult[0].totalUsers
            }
        });

    } catch (error) {
        next(error);
    }
};


/**
 * REVENUE PER DAY
 */
const getRevenuePerDay = async (req, res, next) => {
    try {

        const [results] = await db.query(`
            SELECT 
                DATE(created_at) AS date,
                SUM(total_amount) AS revenue
            FROM orders
            GROUP BY DATE(created_at)
            ORDER BY DATE(created_at) DESC
        `);

        res.status(200).json({
            success: true,
            data: results
        });

    } catch (error) {
        next(error);
    }
};


/**
 * TOP SELLING PRODUCTS
 */
const getTopSellingProducts = async (req, res, next) => {
    try {

        const [results] = await db.query(`
            SELECT 
                products.id,
                products.name,
                SUM(order_items.quantity) AS totalSold
            FROM order_items
            JOIN products ON order_items.product_id = products.id
            GROUP BY products.id
            ORDER BY totalSold DESC
            LIMIT 5
        `);

        res.status(200).json({
            success: true,
            topProducts: results
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    getDashboardSummary,
    getRevenuePerDay,
    getTopSellingProducts
};
