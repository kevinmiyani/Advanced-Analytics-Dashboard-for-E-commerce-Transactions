const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const config = require("./Config/config");
const errorHandler = require("./Utils/errorHandler");
const routes = require("./Routes");
const { generateFakeData } = require("./Utils/fakerData");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(config.database, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on("connected", () => {
  console.log("Connected to database ");
});
mongoose.connection.on("error", (err) => {
  console.log("Database error: " + err);
});

app.use("/api", routes);
app.use(errorHandler);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Server started on port " + port);
  // generateFakeData();
});
