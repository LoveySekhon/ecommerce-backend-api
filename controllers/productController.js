const productModel = require("../models/productModel");
const { ApiError } = require("../middleware/errorHandler");

/**
 * GET ALL PRODUCTS (With Pagination & Filtering)
 */
const getAllProducts = async (req, res, next) => {
    try {

        const result = await productModel.getAllProducts(req.query);

        res.status(200).json({
            success: true,
            totalProducts: result.total,
            currentPage: result.page,
            totalPages: Math.ceil(result.total / result.limit),
            products: result.products
        });

    } catch (error) {
        next(error);
    }
};


/**
 * GET SINGLE PRODUCT
 */
const getProductById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const product = await productModel.getProductById(id);

        if (!product) {
            throw new ApiError(404, "Product not found");
        }

        res.status(200).json({
            success: true,
            product
        });

    } catch (error) {
        next(error);
    }
};

/**
 * CREATE PRODUCT (Admin)
 */
const createProduct = async (req, res, next) => {
    try {
        const result = await productModel.createProduct(req.body);

        res.status(201).json({
            success: true,
            message: "Product created successfully",
            productId: result.insertId
        });

    } catch (error) {
        next(error);
    }
};

/**
 * UPDATE PRODUCT (Admin)
 */
const updateProduct = async (req, res, next) => {
    try {
        const { id } = req.params;

        const result = await productModel.updateProduct(id, req.body);

        if (result.affectedRows === 0) {
            throw new ApiError(404, "Product not found");
        }

        res.status(200).json({
            success: true,
            message: "Product updated successfully"
        });

    } catch (error) {
        next(error);
    }
};

/**
 * DELETE PRODUCT (Admin)
 */
const deleteProduct = async (req, res, next) => {
    try {
        const { id } = req.params;

        const result = await productModel.deleteProduct(id);

        if (result.affectedRows === 0) {
            throw new ApiError(404, "Product not found");
        }

        res.status(200).json({
            success: true,
            message: "Product deleted successfully"
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};
