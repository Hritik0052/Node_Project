const subCategoryService = require("./subcategory.service");

/**
 * Get all subcategories
 * GET /api/admin/subcategories
 */
exports.getAllSubCategories = async (req, res) => {
  try {
    const filters = {
      page: req.query.page,
      limit: req.query.limit,
      categoryId: req.query.categoryId,
      search: req.query.search
    };

    const result = await subCategoryService.getAllSubCategories(filters);

    res.status(200).json({
      success: true,
      data: result.subCategories,
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
 * Get single subcategory
 * GET /api/admin/subcategories/:id
 */
exports.getSubCategoryById = async (req, res) => {
  try {
    const subCategory = await subCategoryService.getSubCategoryById(req.params.id);

    res.status(200).json({
      success: true,
      data: subCategory
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
 * Create new subcategory
 * POST /api/admin/subcategories
 */
exports.createSubCategory = async (req, res) => {
  try {
    const subCategory = await subCategoryService.createSubCategory(req.body);

    res.status(201).json({
      success: true,
      data: subCategory,
      message: "SubCategory created successfully"
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
 * Update subcategory
 * PUT /api/admin/subcategories/:id
 */
exports.updateSubCategory = async (req, res) => {
  try {
    const subCategory = await subCategoryService.updateSubCategory(req.params.id, req.body);

    res.status(200).json({
      success: true,
      data: subCategory,
      message: "SubCategory updated successfully"
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
 * Delete subcategory
 * DELETE /api/admin/subcategories/:id
 */
exports.deleteSubCategory = async (req, res) => {
  try {
    const result = await subCategoryService.deleteSubCategory(req.params.id);

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
 * Get subcategories by category
 * GET /api/admin/categories/:categoryId/subcategories
 */
exports.getSubCategoriesByCategory = async (req, res) => {
  try {
    const subCategories = await subCategoryService.getSubCategoriesByCategory(req.params.categoryId);

    res.status(200).json({
      success: true,
      data: subCategories
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
