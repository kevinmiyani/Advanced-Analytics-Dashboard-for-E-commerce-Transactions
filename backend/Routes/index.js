const express = require("express");
const authRoutes = require("./authRoutes");
const productRoutes = require("./productRoutes");
const customerRoutes = require("./customerRoutes");
const transactionRoutes = require("./transactionsRoutes");
const demandForecastRoutes = require("./demandForecastRoutes");
const paymentRoutes = require("./paymentRoutes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/products", productRoutes);
router.use("/customers", customerRoutes);
router.use("/transactions", transactionRoutes);
router.use("/demand-forecast", demandForecastRoutes);
router.use("/payment", paymentRoutes);

module.exports = router;
