const express = require("express");
const customerController = require("../Controllers/customerController");
const authMiddleware = require("../Middleware/authMiddleware");

const router = express.Router();
router.use(authMiddleware.verifyToken);

// Customer routes
router.get("/", customerController.getAllCustomers);
router.post("/", customerController.createCustomer);
router.get("/getCustomerCounts", customerController.getCustomerCounts);
router.get("/:id", customerController.getCustomerById);
router.put("/:id", customerController.updateCustomer);
router.delete("/:id", customerController.deleteCustomer);

module.exports = router;
