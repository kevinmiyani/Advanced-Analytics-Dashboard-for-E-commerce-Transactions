const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../Models/User");
const config = require("../Config/config");
const Customer = require("../Models/Customer");

exports.register = async (req, res) => {
  const { email, password } = req.body;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = new User({
    email,
    password: hashedPassword,
  });

  try {
    const savedUser = await user.save();
    res.send({ user: savedUser._id });
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);

  let user = await User.findOne({ email });
  let role;

  if (user) {
    role = "ADMIN";
  } else {
    user = await Customer.findOne({ email });
    if (user) {
      role = "CUSTOMER";
    }
  }

  if (!user) {
    return res.status(400).send("email or password is wrong");
  }

  const validPass = await bcrypt.compare(password, user.password);
  if (!validPass) {
    return res.status(400).send("Invalid password");
  }

  const token = jwt.sign({ _id: user._id, role: role }, config.jwtSecret);
  res.header("Authorization", token).send({ token, role, data: user });
};

exports.getUser = async (req, res) => {
  const userToken = req.user._id;

  let user = await User.findOne({ _id: userToken });
  let role;

  if (user) {
    role = "ADMIN";
  } else {
    user = await Customer.findOne({ _id: userToken });
    if (user) {
      role = "CUSTOMER";
    }
  }

  if (!user) {
    return res.status(400).send("User not found");
  }
  const token = jwt.sign({ _id: user._id, role: role }, config.jwtSecret);
  res.header("Authorization", token).send({ token, role, data: user });
};
