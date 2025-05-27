const jwt = require("jsonwebtoken");
const JWT_SECRET = "your_secret_key";  // Use the same secret as in your auth routes

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extract token from "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({ error: "Access denied, no token provided" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid token" });

    req.user = user;  // user contains { id: user._id } as per your login route
    next();
  });
}

module.exports = authenticateToken;
