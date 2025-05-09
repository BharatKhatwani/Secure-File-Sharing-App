const jwt = require('jsonwebtoken');

// Middleware to authenticate using JWT
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Extract the token from the Authorization header

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    req.user = decoded; // Store the decoded user info in the request object
    console.log(req.user)
    next(); // Proceed to the next middleware or route handler
  });
};

module.exports = authMiddleware;
