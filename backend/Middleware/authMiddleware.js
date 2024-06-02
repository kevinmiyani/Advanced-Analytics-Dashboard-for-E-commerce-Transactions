const jwt = require("jsonwebtoken");
const config = require("../Config/config");

exports.verifyToken = (req, res, next) => {
  const authHeader = req.header("Authorization");
  let token;
  if (
    authHeader &&
    (authHeader.startsWith("Bearer ") || authHeader.startsWith("bareer "))
  ) {
    token = authHeader.split(" ")[1];
  }

  if (!token) {
    return res.status(401).send("Access Denied");
  }

  try {
    const verified = jwt.verify(token, config.jwtSecret);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send("Invalid Token");
  }
};
