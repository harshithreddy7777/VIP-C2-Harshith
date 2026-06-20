import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './db.js';

// Import Route modules
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Connect to MongoDB Database
connectDB();

// Standard Request Middlewares
app.use(cors());
app.use(express.json());

// Mounting Express Router Modules
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

// Server status validation check
app.get('/', (req, res) => {
  res.send("ShopEZ E-commerce Server is running successfully.");
});

// 404 Route fallback
app.use((req, res) => {
  res.status(404).json({ message: "Requested path does not exist on this server" });
});

// Global Express Error Middleware
app.use((err, req, res, next) => {
  console.error("Express global handler caught:", err.stack);
  res.status(500).json({
    message: "Internal Server Error",
    error: err.message
  });
});

app.listen(PORT, () => {
  console.log(`Server started successfully on port ${PORT}`);
  console.log(`Local link: http://localhost:${PORT}`);
});
