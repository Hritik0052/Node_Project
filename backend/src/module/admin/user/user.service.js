const prisma = require("../../../config/prisma");
const bcrypt = require("bcrypt");

/**
 * Get all users with pagination and filters
 */
exports.getAllUsers = async (filters = {}) => {
  // Parse and set defaults for pagination
  const page = parseInt(filters.page) || 1;
  const limit = parseInt(filters.limit) || 10;
  const skip = (page - 1) * limit;

  // Build where clause
  const where = {};
  
  if (filters.role) {
    where.role = filters.role;
  }

  if (filters.search) {
    where.OR = [
      { email: { contains: filters.search } },
      { firstName: { contains: filters.search } },
      { lastName: { contains: filters.search } },
      { phone: { contains: filters.search } }
    ];
  }

  // Get users and total count
  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        avatar: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            properties: true,
            reviews: true,
            favorites: true,
            blogs: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    }),
    prisma.user.count({ where })
  ]);

  return {
    users,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
};

/**
 * Get single user by ID
 */
exports.getUserById = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: parseInt(userId) },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
      avatar: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      properties: {
        select: {
          id: true,
          title: true,
          price: true,
          status: true,
          createdAt: true
        }
      },
      reviews: {
        select: {
          id: true,
          rating: true,
          comment: true,
          createdAt: true
        }
      },
      blogs: {
        select: {
          id: true,
          title: true,
          createdAt: true
        }
      },
      _count: {
        select: {
          properties: true,
          reviews: true,
          favorites: true,
          blogs: true
        }
      }
    }
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

/**
 * Create new user (admin only)
 */
exports.createUser = async (data) => {
  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email }
  });

  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  // Check if phone is provided and already exists
  if (data.phone) {
    const existingPhone = await prisma.user.findUnique({
      where: { phone: data.phone }
    });

    if (existingPhone) {
      throw new Error("User with this phone number already exists");
    }
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(data.password, 10);

  // Create user
  const user = await prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      avatar: data.avatar,
      role: data.role || "CUSTOMER"
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
      avatar: true,
      role: true,
      createdAt: true,
      updatedAt: true
    }
  });

  return user;
};

/**
 * Update user
 */
exports.updateUser = async (userId, data) => {
  // Check if user exists
  const existingUser = await prisma.user.findUnique({
    where: { id: parseInt(userId) }
  });

  if (!existingUser) {
    throw new Error("User not found");
  }

  // Check if email is being updated and already exists
  if (data.email && data.email !== existingUser.email) {
    const emailExists = await prisma.user.findUnique({
      where: { email: data.email }
    });

    if (emailExists) {
      throw new Error("Email already in use");
    }
  }

  // Check if phone is being updated and already exists
  if (data.phone && data.phone !== existingUser.phone) {
    const phoneExists = await prisma.user.findUnique({
      where: { phone: data.phone }
    });

    if (phoneExists) {
      throw new Error("Phone number already in use");
    }
  }

  // Prepare update data
  const updateData = {
    firstName: data.firstName,
    lastName: data.lastName,
    phone: data.phone,
    avatar: data.avatar,
    role: data.role
  };

  // Update password if provided
  if (data.password) {
    updateData.password = await bcrypt.hash(data.password, 10);
  }

  // Update user
  const updatedUser = await prisma.user.update({
    where: { id: parseInt(userId) },
    data: updateData,
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
      avatar: true,
      role: true,
      createdAt: true,
      updatedAt: true
    }
  });

  return updatedUser;
};

/**
 * Delete user
 */
exports.deleteUser = async (userId) => {
  // Check if user exists
  const user = await prisma.user.findUnique({
    where: { id: parseInt(userId) }
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Delete user (cascade will handle related records)
  await prisma.user.delete({
    where: { id: parseInt(userId) }
  });

  return { message: "User deleted successfully" };
};

/**
 * Get user statistics
 */
exports.getUserStats = async () => {
  const [totalUsers, adminCount, customerCount, recentUsers] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: "ADMIN" } }),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true
      }
    })
  ]);

  return {
    totalUsers,
    adminCount,
    customerCount,
    recentUsers
  };
};
