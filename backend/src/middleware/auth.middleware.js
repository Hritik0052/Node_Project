const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma");

/**
 * Middleware to verify JWT token and attach user to request
 */
const authMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        error: {
          status: 401,
          message: "No token provided. Please login first."
        }
      });
    }

    // Extract token
    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        avatar: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: {
          status: 401,
          message: "User not found. Token is invalid."
        }
      });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        error: {
          status: 401,
          message: "Invalid token. Please login again."
        }
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        error: {
          status: 401,
          message: "Token expired. Please login again."
        }
      });
    }

    return res.status(500).json({
      success: false,
      error: {
        status: 500,
        message: "Authentication failed",
        details: error.message
      }
    });
  }
};

module.exports = authMiddleware;
