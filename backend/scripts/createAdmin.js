const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    console.log("🔧 Creating admin user...\n");

    // Admin user details
    const adminData = {
      email: "admin@example.com",
      password: "admin123",
      firstName: "Admin",
      lastName: "User",
      role: "ADMIN"
    };

    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminData.email }
    });

    if (existingAdmin) {
      console.log("⚠️  Admin user already exists!");
      console.log("📧 Email:", existingAdmin.email);
      console.log("👤 Name:", existingAdmin.firstName, existingAdmin.lastName);
      console.log("🔑 Role:", existingAdmin.role);
      console.log("\n✅ You can login with:");
      console.log("   Email:", adminData.email);
      console.log("   Password: admin123");
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(adminData.password, 10);

    // Create admin user
    const admin = await prisma.user.create({
      data: {
        email: adminData.email,
        password: hashedPassword,
        firstName: adminData.firstName,
        lastName: adminData.lastName,
        role: adminData.role
      }
    });

    console.log("✅ Admin user created successfully!\n");
    console.log("📧 Email:", admin.email);
    console.log("👤 Name:", admin.firstName, admin.lastName);
    console.log("🔑 Role:", admin.role);
    console.log("🆔 ID:", admin.id);
    console.log("\n🔐 Login Credentials:");
    console.log("   Email:", adminData.email);
    console.log("   Password: admin123");
    console.log("\n📝 Next Steps:");
    console.log("   1. Use POST /api/auth/login to get your admin token");
    console.log("   2. Use the token to access admin endpoints");
    console.log("\n💡 Example login request:");
    console.log('   curl -X POST http://localhost:5000/api/auth/login \\');
    console.log('     -H "Content-Type: application/json" \\');
    console.log('     -d \'{"email":"admin@example.com","password":"admin123"}\'');

  } catch (error) {
    console.error("❌ Error creating admin user:", error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser();
