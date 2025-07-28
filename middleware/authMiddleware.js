const jwt = require("jsonwebtoken");

exports.protect = async (req, res, next) => {
  try {
    const auth = req.header("Authorization");

    if (!auth || !auth.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Token not found or invalid" });
    }

    const token = auth.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({ message: "Not authorized", error: err.message });
  }
};
