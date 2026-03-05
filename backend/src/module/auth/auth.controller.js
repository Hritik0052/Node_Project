const authService = require("./auth.service");

/**
 * Register a new user
 * POST /api/auth/register
 */
exports.register = async (req, res) => {
  try {
    const result = await authService.registerUser(req.body);
    
    res.status(201).json({
      success: true,
      data: result,
      message: "User registered successfully"
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: {
        status: 400,
        message: error.message
      }
    });
  }
};

/**
 * Login user
 * POST /api/auth/login
 */
exports.login = async (req, res) => {
  try {
    const result = await authService.loginUser(
      req.body.email,
      req.body.password
    );
    
    res.status(200).json({
      success: true,
      data: result,
      message: "Login successful"
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      error: {
        status: 401,
        message: error.message
      }
    });
  }
};

/**
 * Get user profile
 * GET /api/auth/profile
 * Requires authentication
 */
exports.getProfile = async (req, res) => {
  try {
    const user = await authService.getUserProfile(req.user.id);
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      error: {
        status: 404,
        message: error.message
      }
    });
  }
};

/**
 * Update user profile
 * PUT /api/auth/profile
 * Requires authentication
 */
exports.updateProfile = async (req, res) => {
  try {
    const updatedUser = await authService.updateUserProfile(
      req.user.id,
      req.body
    );
    
    res.status(200).json({
      success: true,
      data: updatedUser,
      message: "Profile updated successfully"
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: {
        status: 400,
        message: error.message
      }
    });
  }
};

/**
 * Logout user
 * POST /api/auth/logout
 * Requires authentication
 * Note: For JWT, logout is handled client-side by removing the token
 * This endpoint is provided for consistency and can be extended for token blacklisting
 */
exports.logout = async (req, res) => {
  try {
    // In a JWT-based system, logout is typically handled client-side
    // by removing the token from storage
    // You can implement token blacklisting here if needed
    
    res.status(200).json({
      success: true,
      message: "Logout successful. Please remove the token from client storage."
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        status: 500,
        message: error.message
      }
    });
  }
};



