import jwt from 'jsonwebtoken';

// Verify JWT token from authorization header and attach to request
export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: "Access Denied: Token missing" });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || 'btech_project_shopez_secret_key');
    req.user = verified; // verified payload has id, email, usertype
    next();
  } catch (error) {
    return res.status(403).json({ message: "Access Denied: Invalid or expired token" });
  }
};

// Check if user has admin privileges
export const isAdmin = (req, res, next) => {
  if (req.user && (req.user.usertype === 'Admin' || req.user.usertype === 'admin')) {
    next();
  } else {
    return res.status(403).json({ message: "Access Denied: Admins only" });
  }
};
