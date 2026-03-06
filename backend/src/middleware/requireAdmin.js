/**
 * Middleware to ensure only admin users can access certain routes
 * Must be used after authMiddleware
 */
const requireAdmin = (req, res, next) => {
  // Check if user exists (should be set by authMiddleware)
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: {
        status: 401,
        message: "Authentication required"
      }
    });
  }

  // Check if user is admin
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({
      success: false,
      error: {
        status: 403,
        message: "Access denied. Admin privileges required."
      }
    });
  }

  next();
};

module.exports = requireAdmin;