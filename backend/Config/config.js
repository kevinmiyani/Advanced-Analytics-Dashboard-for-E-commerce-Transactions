require("dotenv").config();

module.exports = {
  database: process.env.DATABASE_URL || "mongodb://localhost:27017/ecommerce",
  jwtSecret: process.env.JWT_SECRET || "your_jwt_secret", // Change this to a secure secret
  paymentSecret: process.env.PAYMENT_KEY || "your_payment_secret", // Change this to a secure secret for payment links
};
