import bcrypt from "bcryptjs";
import connectToDatabase from "./mongodb";
import User from "@/models/User";

async function createAdminUser() {
  try {
    // Connect to database
    await connectToDatabase();
    console.log("Connected to database");

    // Check if admin user already exists
    const existingAdmin = await User.findOne({
      email: "admin@admin.com",
      role: "admin"
    });

    if (existingAdmin) {
      console.log("Admin user already exists!");
      return;
    }

    // Hash the password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash("admin123", saltRounds);

    // Create admin user
    const adminUser = new User({
      email: "admin@admin.com",
      password: hashedPassword,
      firstName: "Admin",
      lastName: "User",
      role: "admin",
      status: "active",
      language: "en",
    });

    await adminUser.save();
    console.log("Admin user created successfully!");
    console.log("Email: admin@admin.com");
    console.log("Password: admin123");

  } catch (error) {
    console.error("Error creating admin user:", error);
    process.exit(1);
  } finally {
    // Close the connection
    process.exit(0);
  }
}

// Run the script
createAdminUser();
