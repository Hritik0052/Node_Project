const router = require("express").Router();
const controller = require("./user.controller");
const authMiddleware = require("../../../middleware/auth.middleware");
const requireAdmin = require("../../../middleware/requireAdmin");

// All routes require authentication and admin role
router.use(authMiddleware, requireAdmin);

// User statistics (must be before /:id route)
router.get("/stats", controller.getUserStats);

// CRUD operations
router.get("/", controller.getAllUsers);
router.get("/:id", controller.getUserById);
router.post("/", controller.createUser);
router.put("/:id", controller.updateUser);
router.delete("/:id", controller.deleteUser);

module.exports = router;
