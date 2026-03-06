const router = require("express").Router();
const controller = require("./subcategory.controller");
const authMiddleware = require("../../../middleware/auth.middleware");
const requireAdmin = require("../../../middleware/requireAdmin");

// All routes require authentication and admin role
router.use(authMiddleware, requireAdmin);

// CRUD operations
router.get("/", controller.getAllSubCategories);
router.get("/:id", controller.getSubCategoryById);
router.post("/", controller.createSubCategory);
router.put("/:id", controller.updateSubCategory);
router.delete("/:id", controller.deleteSubCategory);

module.exports = router;
