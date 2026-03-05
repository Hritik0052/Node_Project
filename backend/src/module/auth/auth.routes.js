const router = require("express").Router();
const controller = require("./auth.controller");
const authMiddleware = require("../../middleware/auth.middleware");

// Public routes
router.post("/register", controller.register);
router.post("/login", controller.login);

// Protected routes (require authentication)
router.get("/profile", authMiddleware, controller.getProfile);
router.put("/profile", authMiddleware, controller.updateProfile);
router.post("/logout", authMiddleware, controller.logout);

module.exports = router;