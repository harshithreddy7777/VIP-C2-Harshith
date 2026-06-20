import { User, Product, Orders, Admin } from '../models/Schema.js';

// Fetch stats summary and chart details for Admin Dashboard
export const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ usertype: { $ne: 'Admin' } });
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Orders.countDocuments();

    // Fetch active orders to calculate total revenue
    const activeOrders = await Orders.find({ orderStatus: { $ne: 'cancelled' } });
    const totalRevenue = activeOrders.reduce((sum, order) => {
      const netPrice = order.price - order.discount;
      return sum + (netPrice * order.quantity);
    }, 0);

    // Grouping for Chart.js - Revenue per ordered product title (top 5)
    const productSales = await Orders.aggregate([
      { $match: { orderStatus: { $ne: 'cancelled' } } },
      {
        $group: {
          _id: "$title",
          revenue: { $sum: { $multiply: [{ $subtract: ["$price", "$discount"] }, "$quantity"] } },
          quantity: { $sum: "$quantity" }
        }
      },
      { $sort: { revenue: -1 } },
      { $limit: 5 }
    ]);

    // Grouping for Chart.js - Orders count by Status
    const ordersByStatus = await Orders.aggregate([
      {
        $group: {
          _id: "$orderStatus",
          count: { $sum: 1 }
        }
      }
    ]);

    return res.status(200).json({
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
      productSales,
      ordersByStatus
    });
  } catch (error) {
    return res.status(500).json({ message: "Error compiling admin dashboard stats", error: error.message });
  }
};

// Fetch current active website configuration (banner and categories list)
export const getStoreConfig = async (req, res) => {
  try {
    let config = await Admin.findOne();
    if (!config) {
      // Seed default configs if missing
      config = new Admin({
        banner: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=1200", // Standard sale banner
        categories: ["Fashion", "Electronics", "Mobiles", "Groceries", "Sports Equipments"]
      });
      await config.save();
    }
    return res.status(200).json(config);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching store configuration", error: error.message });
  }
};

// Update or create layout configurations
export const updateStoreConfig = async (req, res) => {
  try {
    const { banner, categories } = req.body;
    let config = await Admin.findOne();

    if (config) {
      if (banner) {
        config.banner = banner;
      }
      if (categories) {
        config.categories = categories;
      }
      await config.save();
    } else {
      config = new Admin({
        banner: banner || "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=1200",
        categories: categories || ["Fashion", "Electronics", "Mobiles", "Groceries", "Sports Equipments"]
      });
      await config.save();
    }

    return res.status(200).json({ message: "Banner configuration updated successfully", config });
  } catch (error) {
    return res.status(500).json({ message: "Error updating store configuration", error: error.message });
  }
};

// Fetch all registered customers
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ usertype: { $ne: 'Admin' } }).select('-password');
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching user list", error: error.message });
  }
};
