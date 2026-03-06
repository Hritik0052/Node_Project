const prisma = require("../../../config/prisma");

/**
 * Get all subcategories with pagination and filters
 */
exports.getAllSubCategories = async (filters = {}) => {
  // Parse and set defaults for pagination
  const page = parseInt(filters.page) || 1;
  const limit = parseInt(filters.limit) || 20;
  const skip = (page - 1) * limit;

  // Build where clause
  const where = {};
  
  if (filters.categoryId) {
    where.categoryId = parseInt(filters.categoryId);
  }

  if (filters.search) {
    where.OR = [
      { name: { contains: filters.search } },
      { slug: { contains: filters.search } }
    ];
  }

  // Get subcategories and total count
  const [subCategories, total] = await Promise.all([
    prisma.subCategory.findMany({
      where,
      skip,
      take: limit,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        _count: {
          select: {
            properties: true
          }
        }
      },
      orderBy: {
        name: "asc"
      }
    }),
    prisma.subCategory.count({ where })
  ]);

  return {
    subCategories,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
};

/**
 * Get single subcategory by ID
 */
exports.getSubCategoryById = async (subCategoryId) => {
  const subCategory = await prisma.subCategory.findUnique({
    where: { id: parseInt(subCategoryId) },
    include: {
      category: true,
      _count: {
        select: {
          properties: true
        }
      }
    }
  });

  if (!subCategory) {
    throw new Error("SubCategory not found");
  }

  return subCategory;
};

/**
 * Create new subcategory
 */
exports.createSubCategory = async (data) => {
  // Check if category exists
  const category = await prisma.category.findUnique({
    where: { id: parseInt(data.categoryId) }
  });

  if (!category) {
    throw new Error("Category not found");
  }

  // Check if slug already exists
  const existingSubCategory = await prisma.subCategory.findUnique({
    where: { slug: data.slug }
  });

  if (existingSubCategory) {
    throw new Error("SubCategory with this slug already exists");
  }

  // Create subcategory
  const subCategory = await prisma.subCategory.create({
    data: {
      name: data.name,
      slug: data.slug,
      categoryId: parseInt(data.categoryId)
    },
    include: {
      category: {
        select: {
          id: true,
          name: true,
          slug: true
        }
      },
      _count: {
        select: {
          properties: true
        }
      }
    }
  });

  return subCategory;
};

/**
 * Update subcategory
 */
exports.updateSubCategory = async (subCategoryId, data) => {
  // Check if subcategory exists
  const existingSubCategory = await prisma.subCategory.findUnique({
    where: { id: parseInt(subCategoryId) }
  });

  if (!existingSubCategory) {
    throw new Error("SubCategory not found");
  }

  // Check if category exists (if being updated)
  if (data.categoryId) {
    const category = await prisma.category.findUnique({
      where: { id: parseInt(data.categoryId) }
    });

    if (!category) {
      throw new Error("Category not found");
    }
  }

  // Check if slug is being updated and already exists
  if (data.slug && data.slug !== existingSubCategory.slug) {
    const slugExists = await prisma.subCategory.findUnique({
      where: { slug: data.slug }
    });

    if (slugExists) {
      throw new Error("Slug already in use");
    }
  }

  // Update subcategory
  const updatedSubCategory = await prisma.subCategory.update({
    where: { id: parseInt(subCategoryId) },
    data: {
      name: data.name,
      slug: data.slug,
      categoryId: data.categoryId ? parseInt(data.categoryId) : undefined
    },
    include: {
      category: {
        select: {
          id: true,
          name: true,
          slug: true
        }
      },
      _count: {
        select: {
          properties: true
        }
      }
    }
  });

  return updatedSubCategory;
};

/**
 * Delete subcategory
 */
exports.deleteSubCategory = async (subCategoryId) => {
  // Check if subcategory exists
  const subCategory = await prisma.subCategory.findUnique({
    where: { id: parseInt(subCategoryId) },
    include: {
      _count: {
        select: {
          properties: true
        }
      }
    }
  });

  if (!subCategory) {
    throw new Error("SubCategory not found");
  }

  // Check if subcategory has properties
  if (subCategory._count.properties > 0) {
    throw new Error("Cannot delete subcategory with associated properties.");
  }

  // Delete subcategory
  await prisma.subCategory.delete({
    where: { id: parseInt(subCategoryId) }
  });

  return { message: "SubCategory deleted successfully" };
};

/**
 * Get subcategories by category ID
 */
exports.getSubCategoriesByCategory = async (categoryId) => {
  const subCategories = await prisma.subCategory.findMany({
    where: { categoryId: parseInt(categoryId) },
    include: {
      _count: {
        select: {
          properties: true
        }
      }
    },
    orderBy: {
      name: "asc"
    }
  });

  return subCategories;
};
