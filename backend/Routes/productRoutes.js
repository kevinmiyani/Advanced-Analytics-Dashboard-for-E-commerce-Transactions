const express = require("express");
const productController = require("../Controllers/productController");
const authMiddleware = require("../Middleware/authMiddleware");

const router = express.Router();
router.use(authMiddleware.verifyToken);

// Product routes
router.get("/", productController.getAllProducts);

router.post("/", productController.createProduct);

router.get("/:id", productController.getProductById);
router.put("/:id", productController.updateProduct);
router.delete("/:id", productController.deleteProduct);

module.exports = router;
