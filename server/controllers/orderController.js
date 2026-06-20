import { Orders } from '../models/Schema.js';

// Place a new order (creates separate documents per item as per schema architecture)
export const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email, mobile, address, pincode, paymentMethod, items } = req.body;

    if (!name || !email || !mobile || !address || !pincode || !paymentMethod || !items || items.length === 0) {
      return res.status(400).json({ message: "Please fill in all shipping details and select items" });
    }

    const orderDate = new Date().toISOString().split('T')[0];
    
    // Estimate delivery date: 5 days from today
    const deliveryDateObj = new Date();
    deliveryDateObj.setDate(deliveryDateObj.getDate() + 5);
    const deliveryDate = deliveryDateObj.toISOString().split('T')[0];

    const savedOrders = [];

    // Save a separate Order record for each cart item
    for (const item of items) {
      const newOrder = new Orders({
        userId,
        name,
        email,
        mobile,
        address,
        pincode,
        title: item.title,
        description: item.description,
        mainImg: item.mainImg,
        size: item.size || 'M',
        quantity: Number(item.quantity || 1),
        price: Number(item.price),
        discount: Number(item.discount || 0),
        paymentMethod,
        orderDate,
        deliveryDate,
        orderStatus: 'order placed'
      });
      await newOrder.save();
      savedOrders.push(newOrder);
    }

    return res.status(201).json({ message: "Order placed successfully", orders: savedOrders });
  } catch (error) {
    return res.status(500).json({ message: "Error placing order", error: error.message });
  }
};

// Retrieve orders list for the current logged in user
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const userOrders = await Orders.find({ userId }).sort({ _id: -1 });
    return res.status(200).json(userOrders);
  } catch (error) {
    return res.status(500).json({ message: "Error loading user orders", error: error.message });
  }
};

// Cancel a pending order (User)
export const cancelOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const order = await Orders.findOne({ _id: req.params.id, userId });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.orderStatus === 'delivered') {
      return res.status(400).json({ message: "Cannot cancel an order that has already been delivered" });
    }

    order.orderStatus = 'cancelled';
    await order.save();
    return res.status(200).json({ message: "Order cancelled successfully", order });
  } catch (error) {
    return res.status(500).json({ message: "Error cancelling order", error: error.message });
  }
};

// Retrieve all customer orders (Admin only)
export const getAllOrders = async (req, res) => {
  try {
    const allOrders = await Orders.find().sort({ _id: -1 });
    return res.status(200).json(allOrders);
  } catch (error) {
    return res.status(500).json({ message: "Error loading all orders", error: error.message });
  }
};

// Update status of any order (Admin only)
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;
    const order = await Orders.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.orderStatus = orderStatus;
    await order.save();
    return res.status(200).json({ message: "Order status updated successfully", order });
  } catch (error) {
    return res.status(500).json({ message: "Error updating order status", error: error.message });
  }
};
