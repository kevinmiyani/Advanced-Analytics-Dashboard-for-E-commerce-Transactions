const express = require("express");
const authController = require("../Controllers/authController");
const authMiddleware = require("../Middleware/authMiddleware");

const router = express.Router();

// Authentication routes
router.post("/register", authController.register);
router.post("/login", authController.login);
router.use(authMiddleware.verifyToken);
router.post("/getuser", authController.getUser);

module.exports = router;
