const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../../config/prisma");

/**
 * Register a new user
 */
exports.registerUser = async (data) => {
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

  // Generate token
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return { user, token };
};

/**
 * Login user
 */
exports.loginUser = async (email, password) => {
  // Find user
  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  // Generate token
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  // Return user without password
  const { password: _, ...userWithoutPassword } = user;

  return { user: userWithoutPassword, token };
};

/**
 * Get user profile
 */
exports.getUserProfile = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
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
    }
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

/**
 * Update user profile
 */
exports.updateUserProfile = async (userId, data) => {
  // Check if email is being updated and already exists
  if (data.email) {
    const existingUser = await prisma.user.findFirst({
      where: {
        email: data.email,
        NOT: { id: userId }
      }
    });

    if (existingUser) {
      throw new Error("Email already in use");
    }
  }

  // Check if phone is being updated and already exists
  if (data.phone) {
    const existingPhone = await prisma.user.findFirst({
      where: {
        phone: data.phone,
        NOT: { id: userId }
      }
    });

    if (existingPhone) {
      throw new Error("Phone number already in use");
    }
  }

  // Update user
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      avatar: data.avatar
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

  return updatedUser;
};