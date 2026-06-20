import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/Schema.js';

// User Registration
export const register = async (req, res) => {
  try {
    const { username, email, password, usertype } = req.body;

    if (!username || !email || !password || !usertype) {
      return res.status(400).json({ message: "Please fill in all details" });
    }

    // Check if user email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    // Encrypt user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      usertype
    });

    await newUser.save();
    return res.status(201).json({ message: "User registration successful" });
  } catch (error) {
    return res.status(500).json({ message: "Registration error", error: error.message });
  }
};

// User Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, usertype: user.usertype },
      process.env.JWT_SECRET || 'btech_project_shopez_secret_key',
      { expiresIn: '24h' }
    );

    return res.status(200).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        usertype: user.usertype
      }
    });
  } catch (error) {
    return res.status(500).json({ message: "Login error", error: error.message });
  }
};

// Get User details
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: "Profile error", error: error.message });
  }
};
