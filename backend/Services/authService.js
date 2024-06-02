const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../Models/User");
const config = require("../Config/config");

exports.register = async (username, password) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = new User({ username, password: hashedPassword });
  return await user.save();
};

exports.login = async (username, password) => {
  const user = await User.findOne({ username });
  if (!user) throw new Error("Username or password is wrong");

  const validPass = await bcrypt.compare(password, user.password);
  if (!validPass) throw new Error("Invalid password");

  return jwt.sign({ _id: user._id }, config.jwtSecret);
};
