import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext.jsx';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const { user, token } = useContext(AuthContext);

  // Sync cart depending on authentication status
  useEffect(() => {
    const loadCart = async () => {
      if (token && user) {
        try {
          const res = await axios.get('/api/cart');
          setCart(res.data);
        } catch (error) {
          console.error("Error fetching database cart", error);
        }
      } else {
        const localCart = localStorage.getItem('shopez_cart');
        setCart(localCart ? JSON.parse(localCart) : []);
      }
    };

    loadCart();
  }, [user, token]);

  const getCartItems = async () => {
    if (token && user) {
      try {
        const res = await axios.get('/api/cart');
        setCart(res.data);
      } catch (error) {
        console.error("Error fetching cart items", error);
      }
    }
  };

  // Helper to update guest local cart
  const updateLocalCart = (newCart) => {
    setCart(newCart);
    if (!token) {
      localStorage.setItem('shopez_cart', JSON.stringify(newCart));
    }
  };

  // Add product to cart
  const addToCart = async (product, size = 'M', quantity = 1) => {
    if (token && user) {
      try {
        await axios.post('/api/cart', {
          title: product.title,
          description: product.description,
          mainImg: product.mainImg,
          size,
          quantity,
          price: product.price,
          discount: product.discount
        });
        await getCartItems();
      } catch (error) {
        console.error("Error adding item to database cart", error);
      }
    } else {
      // Local cart logic
      const existingItemIndex = cart.findIndex(item => item.title === product.title && item.size === size);
      const updatedCart = [...cart];

      if (existingItemIndex > -1) {
        updatedCart[existingItemIndex].quantity += Number(quantity);
      } else {
        updatedCart.push({
          _id: `local_${Date.now()}`,
          title: product.title,
          description: product.description,
          mainImg: product.mainImg,
          size,
          quantity: Number(quantity),
          price: product.price,
          discount: product.discount
        });
      }
      updateLocalCart(updatedCart);
    }
  };

  // Remove single item from cart
  const removeFromCart = async (id) => {
    if (token && user) {
      try {
        await axios.delete(`/api/cart/${id}`);
        await getCartItems();
      } catch (error) {
        console.error("Error removing item from database cart", error);
      }
    } else {
      const updatedCart = cart.filter(item => item._id !== id);
      updateLocalCart(updatedCart);
    }
  };

  // Update item quantity in cart
  const updateCartQuantity = async (id, quantity) => {
    if (quantity <= 0) {
      return removeFromCart(id);
    }

    if (token && user) {
      try {
        await axios.put(`/api/cart/${id}`, { quantity: Number(quantity) });
        await getCartItems();
      } catch (error) {
        console.error("Error updating item quantity in database cart", error);
      }
    } else {
      const updatedCart = cart.map(item => item._id === id ? { ...item, quantity: Number(quantity) } : item);
      updateLocalCart(updatedCart);
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    if (token && user) {
      try {
        await axios.delete('/api/cart');
        setCart([]);
      } catch (error) {
        console.error("Error clearing database cart", error);
      }
    } else {
      updateLocalCart([]);
    }
  };

  // Total items in cart
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, cartCount, addToCart, removeFromCart, updateCartQuantity, clearCart, getCartItems }}>
      {children}
    </CartContext.Provider>
  );
};
