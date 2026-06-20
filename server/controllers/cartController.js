import { Cart } from '../models/Schema.js';

// Get cart items for logged in user
export const getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cartItems = await Cart.find({ userId });
    return res.status(200).json(cartItems);
  } catch (error) {
    return res.status(500).json({ message: "Error loading cart", error: error.message });
  }
};

// Add item to cart
export const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, description, mainImg, size, quantity, price, discount } = req.body;

    // Check if the item with same title and size exists in user's cart
    let cartItem = await Cart.findOne({ userId, title, size });

    if (cartItem) {
      cartItem.quantity += Number(quantity || 1);
      await cartItem.save();
    } else {
      cartItem = new Cart({
        userId,
        title,
        description,
        mainImg,
        size: size || 'M',
        quantity: Number(quantity || 1),
        price: Number(price),
        discount: Number(discount) || 0
      });
      await cartItem.save();
    }

    return res.status(200).json({ message: "Item added to cart", cartItem });
  } catch (error) {
    return res.status(500).json({ message: "Error adding to cart", error: error.message });
  }
};

// Remove single item from cart
export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cartItem = await Cart.findOneAndDelete({ _id: req.params.id, userId });
    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }
    return res.status(200).json({ message: "Removed from cart successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error removing item from cart", error: error.message });
  }
};

// Update cart item quantity or size selection
export const updateCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { quantity, size } = req.body;

    const cartItem = await Cart.findOne({ _id: req.params.id, userId });
    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    if (quantity !== undefined) {
      cartItem.quantity = Number(quantity);
    }
    if (size !== undefined) {
      cartItem.size = size;
    }

    await cartItem.save();
    return res.status(200).json({ message: "Cart item updated", cartItem });
  } catch (error) {
    return res.status(500).json({ message: "Error updating cart item", error: error.message });
  }
};

// Clear all items in user's cart
export const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;
    await Cart.deleteMany({ userId });
    return res.status(200).json({ message: "Cart cleared" });
  } catch (error) {
    return res.status(500).json({ message: "Error clearing cart", error: error.message });
  }
};
