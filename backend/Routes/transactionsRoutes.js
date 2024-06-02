const express = require("express");
const transactionController = require("../Controllers/transactionController");
const authMiddleware = require("../Middleware/authMiddleware");

const router = express.Router();
router.use(authMiddleware.verifyToken);
router.put("/:id", transactionController.updateTransaction);
router.post("/customerid", transactionController.getDataCustomerTransaction);
router.post("/", transactionController.createTransaction);

// Transaction routes
router.get("/", transactionController.getAllTransactions);
router.get("/:id", transactionController.getTransactionById);
router.delete("/:id", transactionController.deleteTransaction);

module.exports = router;
