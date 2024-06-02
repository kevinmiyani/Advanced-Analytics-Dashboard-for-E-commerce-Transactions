const User = require("../Models/User");

exports.verifyToken = async (req, res, next) => {
  if (!req.user || !req.user._id) {
    return res.status(403).json({ message: "Access denied Admin Access only" });
  }

  try {
    const user = await User.findById(req.user._id);
    if (!user || !user.isAdmin) {
      return res
        .status(403)
        .json({ message: "Access denied Admin Access only" });
    }
    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
