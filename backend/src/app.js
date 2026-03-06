const express = require("express");
const cors = require("cors");

const authRoutes = require("./module/auth/auth.routes");
const adminUserRoutes = require("./module/admin/user/user.routes");
const adminCategoryRoutes = require("./module/admin/category/category.routes");
const adminSubCategoryRoutes = require("./module/admin/subcategory/subcategory.routes");

const app = express();

app.use(cors());
app.use(express.json());

// Public routes
app.use("/api/auth", authRoutes);

// Admin routes
app.use("/api/admin/users", adminUserRoutes);
app.use("/api/admin/categories", adminCategoryRoutes);
app.use("/api/admin/subcategories", adminSubCategoryRoutes);

module.exports = app;