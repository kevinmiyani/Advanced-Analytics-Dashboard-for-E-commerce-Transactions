// const tf = require("@tensorflow/tfjs");

// const Transaction = require("../Models/Transaction");

// exports.predictDemand = async (req, res) => {
//   try {
//     // 1. Retrieve historical data
//     const historicalData = await Transaction.find({}, "date quantity").lean();

//     // 2. Preprocess data
//     const timestamps = historicalData.map((transaction) =>
//       new Date(transaction.date).getTime()
//     ); // Convert dates to timestamps
//     const quantities = historicalData.map(
//       (transaction) => transaction.quantity
//     );

//     // 3. Call prepareData and handle returned values
//     const { xTrain, xTest, yTrain, yTest } = prepareData(
//       timestamps,
//       quantities
//     );

//     // 4. Define and train the model
//     const model = createModel(); // Custom function to define the model architecture

//     model.compile({ loss: "mse", optimizer: "adam" });
//     await model.fit(xTrain, yTrain, {
//       epochs: 100,
//       validationData: [xTest, yTest],
//     });

//     // 5. Generate forecast (assuming logic in prepareFutureDates)
//     const futureDates = prepareFutureDates(xTest.length); // Get future dates
//     const predictions = model.predict(futureDates);

//     // 6. Send response
//     res.json({ demandForecast: predictions.dataSync() });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Failed to predict demand", error: error.message });
//   }
// };

// // Helper functions for data preparation and model definition
// function prepareData(timestamps, quantities) {
//   // Implement logic to split data into training and testing sets (e.g., 80%/20%)
//   // Consider normalization or feature engineering if needed
//   const splitRatio = 0.8; // Adjust split ratio as needed

//   const numSamples = timestamps.length;
//   let trainSize = Math.floor(numSamples * splitRatio);

//   const xTrain = timestamps.slice(0, trainSize);
//   const yTrain = quantities.slice(0, trainSize);

//   const xTest = timestamps.slice(trainSize);
//   const yTest = quantities.slice(trainSize);

//   // Reshape data for TensorFlow.js (optional)
//   xTrain = tf.tensor2d(xTrain, [xTrain.length, 1]); // Reshape to 2D tensor with single feature
//   yTrain = tf.tensor2d(yTrain, [yTrain.length, 1]); // Reshape to 2D tensor with single target

//   xTest = tf.tensor2d(xTest, [xTest.length, 1]);
//   yTest = tf.tensor2d(yTest, [yTest.length, 1]);

//   return { xTrain, xTest, yTrain, yTest }; // Return data as an object
// }

// function createModel() {
//   // Define the model architecture using TensorFlow.js layers
//   // Example: a simple sequential model with Dense layers
//   const model = tf.sequential();
//   model.add(
//     tf.layers.dense({ units: 10, activation: "relu", inputShape: [1] })
//   ); // Example layer
//   model.add(tf.layers.dense({ units: 1 })); // Example output layer
//   return model;
// }

// function prepareFutureDates(testLength) {
//   // Get today's date
//   const today = new Date();

//   // Set starting date for predictions (next day from today)
//   const startDate = new Date(
//     today.getFullYear(),
//     today.getMonth(),
//     today.getDate() + 1
//   );

//   // Generate an array of future dates for the next year
//   const futureDates = [];
//   for (let i = 0; i < testLength; i++) {
//     const futureDate = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
//     futureDates.push(futureDate.getTime());
//   }

//   return tf.tensor2d(futureDates, [futureDates.length, 1]); // Reshape to 2D tensor with single feature
// }
