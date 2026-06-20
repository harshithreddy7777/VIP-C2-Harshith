import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { User, Product, Admin, Orders, Cart } from './models/Schema.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/ShopEZ";

const seedDatabase = async () => {
  try {
    console.log("Connecting to database at:", MONGO_URI);
    await mongoose.connect(MONGO_URI);
    console.log("Connected. Clearing old collections...");

    // Delete existing records
    await User.deleteMany({});
    await Product.deleteMany({});
    await Admin.deleteMany({});
    await Orders.deleteMany({});
    await Cart.deleteMany({});

    console.log("Collections cleared. Seeding default accounts...");

    // Seed Admin
    const adminPassword = await bcrypt.hash("admin123", 10);
    const defaultAdmin = new User({
      username: "ShopEZ Admin",
      email: "admin@shopez.com",
      password: adminPassword,
      usertype: "Admin"
    });
    await defaultAdmin.save();

    // Seed Customer
    const customerPassword = await bcrypt.hash("user123", 10);
    const defaultCustomer = new User({
      username: "Harshith Reddy",
      email: "customer@shopez.com",
      password: customerPassword,
      usertype: "Customer"
    });
    await defaultCustomer.save();

    console.log("Users created. Seeding store configurations...");

    // Seed Store Configuration (Admin banner / categories)
    const storeConfig = new Admin({
      banner: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=1200", // Standard sale banner
      categories: ["Fashion", "Electronics", "Mobiles", "Groceries", "Sports Equipments"]
    });
    await storeConfig.save();

    console.log("Store configurations created. Seeding catalog products...");

    // Seed Products
    const productsList = [
      {
        title: "iPhone 12",
        description: "Popular Apple iPhone with 64GB storage, A14 Bionic chip, dual-camera system, and Super Retina XDR display.",
        mainImg: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=600",
        carousel: [
          "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=600",
          "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?q=80&w=600"
        ],
        sizes: ["One Size"],
        category: "Mobiles",
        gender: "Unisex",
        price: 67999,
        discount: 12000
      },
      {
        title: "Realme Buds",
        description: "Wireless Bluetooth earbuds with deep bass boost, 20 hours combined playback battery life, and super-low latency gaming mode.",
        mainImg: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=600",
        carousel: [
          "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=600"
        ],
        sizes: ["One Size"],
        category: "Electronics",
        gender: "Unisex",
        price: 2599,
        discount: 800
      },
      {
        title: "MRF Cricket Bat",
        description: "Popular english willow wood cricket bat from MRF. Engineered with a massive sweet spot, suitable for all your format plays in all outdoor conditions.",
        mainImg: "https://upload.wikimedia.org/wikipedia/commons/6/69/Cricket_bat.jpg",
        carousel: [
          "https://upload.wikimedia.org/wikipedia/commons/6/69/Cricket_bat.jpg",
          "https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=600"
        ],
        sizes: ["Short Handle", "Long Handle"],
        category: "Sports Equipments",
        gender: "Unisex",
        price: 1308,
        discount: 391
      },
      {
        title: "Nike Running Shoes",
        description: "High performance athletic running shoes for men featuring reactive cushioning, breathable fabric, and durable rubber traction soles.",
        mainImg: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600",
        carousel: [
          "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600"
        ],
        sizes: ["7", "8", "9", "10"],
        category: "Fashion",
        gender: "Men",
        price: 4999,
        discount: 1000
      },
      {
        title: "Women's Floral Summer Dress",
        description: "Elegant and breathable floral summer dress for women. Light fabric with waist tie, perfect for warm weather and casual day outs.",
        mainImg: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600",
        carousel: [
          "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600"
        ],
        sizes: ["S", "M", "L"],
        category: "Fashion",
        gender: "Women",
        price: 1899,
        discount: 400
      },
      {
        title: "Fresh Organic Apple Pack",
        description: "Pack of 1kg fresh, juicy and crunchy red organic apples straight from local orchards. Healthy snack option full of nutrients.",
        mainImg: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?q=80&w=600",
        carousel: [
          "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?q=80&w=600"
        ],
        sizes: ["1kg pack"],
        category: "Groceries",
        gender: "Unisex",
        price: 180,
        discount: 30
      }
    ];

    await Product.insertMany(productsList);
    console.log("Products seeded successfully.");

    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

seedDatabase();
