const db = require("../config/db");

/**
 * Get products with pagination, filtering & sorting
 */
const getAllProducts = async (queryParams) => {

    let {
        page = 1,
        limit = 10,
        sort,
        category,
        minPrice,
        maxPrice
    } = queryParams;

    page = parseInt(page);
    limit = parseInt(limit);

    const offset = (page - 1) * limit;

    let baseQuery = "SELECT * FROM products WHERE 1=1";
    let countQuery = "SELECT COUNT(*) as total FROM products WHERE 1=1";

    const values = [];

    // Category filter
    if (category) {
        baseQuery += " AND category = ?";
        countQuery += " AND category = ?";
        values.push(category);
    }

    // Price range filter
    if (minPrice) {
        baseQuery += " AND price >= ?";
        countQuery += " AND price >= ?";
        values.push(minPrice);
    }

    if (maxPrice) {
        baseQuery += " AND price <= ?";
        countQuery += " AND price <= ?";
        values.push(maxPrice);
    }

    // Sorting
    if (sort) {
        if (sort === "price_asc") {
            baseQuery += " ORDER BY price ASC";
        } else if (sort === "price_desc") {
            baseQuery += " ORDER BY price DESC";
        } else if (sort === "newest") {
            baseQuery += " ORDER BY created_at DESC";
        }
    } else {
        baseQuery += " ORDER BY created_at DESC";
    }

    baseQuery += " LIMIT ? OFFSET ?";
    values.push(limit, offset);

    const [products] = await db.query(baseQuery, values);

    const [countResult] = await db.query(
        countQuery,
        values.slice(0, values.length - 2)
    );

    return {
        products,
        total: countResult[0].total,
        page,
        limit
    };
};

/**
 * Get product by ID
 */
const getProductById = async (id) => {
    const query = "SELECT * FROM products WHERE id = ?";
    const [rows] = await db.query(query, [id]);
    return rows[0];
};

/**
 * Create product
 */
const createProduct = async (productData) => {
    const { name, description, price, category, stock, image_url } = productData;

    const query = `
        INSERT INTO products (name, description, price, category, stock, image_url)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(query, [
        name,
        description,
        price,
        category,
        stock,
        image_url
    ]);

    return result;
};

/**
 * Update product
 */
const updateProduct = async (id, productData) => {
    const { name, description, price, category, stock, image_url } = productData;

    const query = `
        UPDATE products
        SET name = ?, description = ?, price = ?, category = ?, stock = ?, image_url = ?
        WHERE id = ?
    `;

    const [result] = await db.query(query, [
        name,
        description,
        price,
        category,
        stock,
        image_url,
        id
    ]);

    return result;
};

/**
 * Delete product
 */
const deleteProduct = async (id) => {
    const query = "DELETE FROM products WHERE id = ?";
    const [result] = await db.query(query, [id]);
    return result;
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};
