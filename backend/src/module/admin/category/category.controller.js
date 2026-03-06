const categoryService = require("./category.service");

/**
 * Get all categories
 * GET /api/admin/categories
 */
exports.getAllCategories = async (req, res) => {
  try {
    const filters = {
      page: req.query.page,
      limit: req.query.limit,
      search: req.query.search
    };

    const result = await categoryService.getAllCategories(filters);

    res.status(200).json({
      success: true,
      data: result.categories,
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
 * Get single category
 * GET /api/admin/categories/:id
 */
exports.getCategoryById = async (req, res) => {
  try {
    const category = await categoryService.getCategoryById(req.params.id);

    res.status(200).json({
      success: true,
      data: category
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
 * Create new category
 * POST /api/admin/categories
 */
exports.createCategory = async (req, res) => {
  try {
    const category = await categoryService.createCategory(req.body);

    res.status(201).json({
      success: true,
      data: category,
      message: "Category created successfully"
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
 * Update category
 * PUT /api/admin/categories/:id
 */
exports.updateCategory = async (req, res) => {
  try {
    const category = await categoryService.updateCategory(req.params.id, req.body);

    res.status(200).json({
      success: true,
      data: category,
      message: "Category updated successfully"
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
 * Delete category
 * DELETE /api/admin/categories/:id
 */
exports.deleteCategory = async (req, res) => {
  try {
    const result = await categoryService.deleteCategory(req.params.id);

    res.status(200).json({
      success: true,
      message: result.message
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
 * Get category statistics
 * GET /api/admin/categories/stats
 */
exports.getCategoryStats = async (req, res) => {
  try {
    const stats = await categoryService.getCategoryStats();

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
