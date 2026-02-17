const express = require("express");
const router = express.Router();

const {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} = require("../controllers/productController");

const { authenticateUser, authorizeAdmin } = require("../middleware/authMiddleware");

/**
 * PUBLIC ROUTES
 */
router.get("/", getAllProducts);
router.get("/:id", getProductById);

/**
 * ADMIN ROUTES
 */
router.post("/", authenticateUser, authorizeAdmin, createProduct);
router.put("/:id", authenticateUser, authorizeAdmin, updateProduct);
router.delete("/:id", authenticateUser, authorizeAdmin, deleteProduct);

module.exports = router;
