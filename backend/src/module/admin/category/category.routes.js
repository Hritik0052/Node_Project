const router = require("express").Router();
const controller = require("./category.controller");
const authMiddleware = require("../../../middleware/auth.middleware");
const requireAdmin = require("../../../middleware/requireAdmin");

// All routes require authentication and admin role
router.use(authMiddleware, requireAdmin);

// Category statistics (must be before /:id route)
router.get("/stats", controller.getCategoryStats);

// CRUD operations
router.get("/", controller.getAllCategories);
router.get("/:id", controller.getCategoryById);
router.post("/", controller.createCategory);
router.put("/:id", controller.updateCategory);
router.delete("/:id", controller.deleteCategory);

module.exports = router;
