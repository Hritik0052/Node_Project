const prisma = require("../../../config/prisma");

/**
 * Get all categories with subcategories
 */
exports.getAllCategories = async (filters = {}) => {
  // Parse and set defaults for pagination
  const page = parseInt(filters.page) || 1;
  const limit = parseInt(filters.limit) || 20;
  const skip = (page - 1) * limit;

  // Build where clause
  const where = {};
  
  if (filters.search) {
    where.OR = [
      { name: { contains: filters.search } },
      { slug: { contains: filters.search } },
      { description: { contains: filters.search } }
    ];
  }

  // Get categories and total count
  const [categories, total] = await Promise.all([
    prisma.category.findMany({
      where,
      skip,
      take: limit,
      include: {
        subCategories: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        _count: {
          select: {
            subCategories: true,
            properties: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    }),
    prisma.category.count({ where })
  ]);

  return {
    categories,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
};

/**
 * Get single category by ID
 */
exports.getCategoryById = async (categoryId) => {
  const category = await prisma.category.findUnique({
    where: { id: parseInt(categoryId) },
    include: {
      subCategories: true,
      _count: {
        select: {
          subCategories: true,
          properties: true
        }
      }
    }
  });

  if (!category) {
    throw new Error("Category not found");
  }

  return category;
};

/**
 * Create new category
 */
exports.createCategory = async (data) => {
  // Check if slug already exists
  const existingCategory = await prisma.category.findUnique({
    where: { slug: data.slug }
  });

  if (existingCategory) {
    throw new Error("Category with this slug already exists");
  }

  // Create category
  const category = await prisma.category.create({
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description
    },
    include: {
      _count: {
        select: {
          subCategories: true,
          properties: true
        }
      }
    }
  });

  return category;
};

/**
 * Update category
 */
exports.updateCategory = async (categoryId, data) => {
  // Check if category exists
  const existingCategory = await prisma.category.findUnique({
    where: { id: parseInt(categoryId) }
  });

  if (!existingCategory) {
    throw new Error("Category not found");
  }

  // Check if slug is being updated and already exists
  if (data.slug && data.slug !== existingCategory.slug) {
    const slugExists = await prisma.category.findUnique({
      where: { slug: data.slug }
    });

    if (slugExists) {
      throw new Error("Slug already in use");
    }
  }

  // Update category
  const updatedCategory = await prisma.category.update({
    where: { id: parseInt(categoryId) },
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description
    },
    include: {
      subCategories: true,
      _count: {
        select: {
          subCategories: true,
          properties: true
        }
      }
    }
  });

  return updatedCategory;
};

/**
 * Delete category
 */
exports.deleteCategory = async (categoryId) => {
  // Check if category exists
  const category = await prisma.category.findUnique({
    where: { id: parseInt(categoryId) },
    include: {
      _count: {
        select: {
          subCategories: true,
          properties: true
        }
      }
    }
  });

  if (!category) {
    throw new Error("Category not found");
  }

  // Check if category has subcategories or properties
  if (category._count.subCategories > 0) {
    throw new Error("Cannot delete category with subcategories. Delete subcategories first.");
  }

  if (category._count.properties > 0) {
    throw new Error("Cannot delete category with associated properties.");
  }

  // Delete category
  await prisma.category.delete({
    where: { id: parseInt(categoryId) }
  });

  return { message: "Category deleted successfully" };
};

/**
 * Get category statistics
 */
exports.getCategoryStats = async () => {
  const [totalCategories, totalSubCategories, recentCategories] = await Promise.all([
    prisma.category.count(),
    prisma.subCategory.count(),
    prisma.category.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: {
            subCategories: true,
            properties: true
          }
        }
      }
    })
  ]);

  return {
    totalCategories,
    totalSubCategories,
    recentCategories
  };
};
