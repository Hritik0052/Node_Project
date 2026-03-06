const userService = require("./user.service");

/**
 * Get all users
 * GET /api/admin/users
 */
exports.getAllUsers = async (req, res) => {
  try {
    const filters = {
      page: req.query.page,
      limit: req.query.limit,
      role: req.query.role,
      search: req.query.search
    };

    const result = await userService.getAllUsers(filters);

    res.status(200).json({
      success: true,
      data: result.users,
      pagination: result.pagination
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

/**
 * Get single user
 * GET /api/admin/users/:id
 */
exports.getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);

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
 * Create new user
 * POST /api/admin/users
 */
exports.createUser = async (req, res) => {
  try {
    const user = await userService.createUser(req.body);

    res.status(201).json({
      success: true,
      data: user,
      message: "User created successfully"
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
 * Update user
 * PUT /api/admin/users/:id
 */
exports.updateUser = async (req, res) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);

    res.status(200).json({
      success: true,
      data: user,
      message: "User updated successfully"
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
 * Delete user
 * DELETE /api/admin/users/:id
 */
exports.deleteUser = async (req, res) => {
  try {
    const result = await userService.deleteUser(req.params.id);

    res.status(200).json({
      success: true,
      message: result.message
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
 * Get user statistics
 * GET /api/admin/users/stats
 */
exports.getUserStats = async (req, res) => {
  try {
    const stats = await userService.getUserStats();

    res.status(200).json({
      success: true,
      data: stats
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
