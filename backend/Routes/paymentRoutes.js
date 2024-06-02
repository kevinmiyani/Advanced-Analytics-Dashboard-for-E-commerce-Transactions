const express = require("express");
const productController = require("../Controllers/paymentController");
const authMiddleware = require("../Middleware/authMiddleware");
const Razorpay = require("razorpay");

const razorpay = new Razorpay({
  key_id: "rzp_test_P8caAVoaIwKUJb",
  key_secret: "AutLH2q0HO3vtEppF26kVb8y",
});
const router = express.Router();
router.post("/paymentverification", productController.paymentVerification);

router.use(authMiddleware.verifyToken);

router.post("/checkout", productController.Checkout);

module.exports = router;
