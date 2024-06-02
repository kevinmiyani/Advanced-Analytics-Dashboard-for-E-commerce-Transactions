const express = require("express");
const Transaction = require("../Models/Transaction");
const axios = require("axios");
const router = express.Router();

// Helper function to get predictions from Python service
const getPredictions = async (features) => {
  try {
    const response = await axios.post(
      "http://localhost:5000/predict",
      features
    );
    return response.data;
  } catch (err) {
    console.error(`Error getting predictions:`, err.message);
    return null;
  }
};

router.get("/predict-demand", async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate("productId")
      .populate("customerId");

    const productFeatures = {};

    // Aggregate features for each product
    transactions.forEach((transaction) => {
      const productId = transaction.productId;
      if (!productFeatures[productId]) {
        productFeatures[productId] = {
          productId,
          totalQuantity: 0,
          count: 0,
          day_of_week: transaction.transactiondate.getDay(),
          month: transaction.transactiondate.getMonth() + 1,
          day_of_month: transaction.transactiondate.getDate(),
        };
      }
      productFeatures[productId].totalQuantity += transaction.quantity;
      productFeatures[productId].count += 1;
    });

    // Prepare feature sets for prediction
    const features = Object.values(productFeatures).map((product) => ({
      productId: product.productId,
      quantity: product.totalQuantity / product.count,
      day_of_week: product.day_of_week,
      month: product.month,
      day_of_month: product.day_of_month,
    }));

    // Get predictions
    const predictions = await getPredictions(features);

    res.json(predictions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
