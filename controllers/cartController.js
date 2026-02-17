const cartModel = require("../models/cartModel");
const { ApiError } = require("../middleware/errorHandler");

/**
 * ADD TO CART
 */
const addToCart = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { product_id, quantity } = req.body;

        if (!product_id || !quantity || quantity <= 0) {
            throw new ApiError(400, "Valid product_id and quantity are required");
        }

        const existingItems = await cartModel.findCartItem(userId, product_id);

        if (existingItems.length > 0) {
            const existingQuantity = existingItems[0].quantity;
            const newQuantity = existingQuantity + quantity;

            await cartModel.updateCartQuantity(userId, product_id, newQuantity);

            return res.status(200).json({
                success: true,
                message: "Cart updated successfully"
            });
        }

        await cartModel.addToCart(userId, product_id, quantity);

        res.status(201).json({
            success: true,
            message: "Product added to cart"
        });

    } catch (error) {
        next(error);
    }
};

/**
 * GET USER CART
 */
const getCart = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const cartItems = await cartModel.getUserCart(userId);

        res.status(200).json({
            success: true,
            count: cartItems.length,
            cart: cartItems
        });

    } catch (error) {
        next(error);
    }
};

/**
 * REMOVE FROM CART
 */
const removeFromCart = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { product_id } = req.body;

        if (!product_id) {
            throw new ApiError(400, "Product ID is required");
        }

        const result = await cartModel.removeFromCart(userId, product_id);

        if (result.affectedRows === 0) {
            throw new ApiError(404, "Cart item not found");
        }

        res.status(200).json({
            success: true,
            message: "Item removed from cart"
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    addToCart,
    getCart,
    removeFromCart
};
