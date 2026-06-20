import { Product } from '../models/Schema.js';

// Get all products (supports sorting, filters, search)
export const getAllProducts = async (req, res) => {
  try {
    const { category, gender, sort, search } = req.query;
    let queryObj = {};

    if (category) {
      queryObj.category = { $in: category.split(',') };
    }

    if (gender) {
      queryObj.gender = { $in: gender.split(',') };
    }

    if (search) {
      queryObj.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    let query = Product.find(queryObj);

    if (sort) {
      if (sort === 'Price (Low to High)' || sort === 'price-asc') {
        query = query.sort({ price: 1 });
      } else if (sort === 'Price (High to Low)' || sort === 'price-desc') {
        query = query.sort({ price: -1 });
      } else {
        query = query.sort({ _id: -1 }); // default 'Popular' or new arrivals
      }
    } else {
      query = query.sort({ _id: -1 });
    }

    const products = await query;
    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ message: "Error loading products", error: error.message });
  }
};

// Get single product details
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({ message: "Error loading product details", error: error.message });
  }
};

// Add a product (Admin only)
export const addProduct = async (req, res) => {
  try {
    const { title, description, mainImg, carousel, sizes, category, gender, price, discount } = req.body;

    const newProduct = new Product({
      title,
      description,
      mainImg,
      carousel: Array.isArray(carousel) && carousel.length > 0 ? carousel : [mainImg],
      sizes: Array.isArray(sizes) && sizes.length > 0 ? sizes : ['S', 'M', 'L', 'XL'],
      category,
      gender,
      price: Number(price),
      discount: Number(discount) || 0
    });

    await newProduct.save();
    return res.status(201).json({ message: "Product added successfully", product: newProduct });
  } catch (error) {
    return res.status(500).json({ message: "Error adding product", error: error.message });
  }
};

// Update product data (Admin only)
export const updateProduct = async (req, res) => {
  try {
    const { title, description, mainImg, carousel, sizes, category, gender, price, discount } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.title = title || product.title;
    product.description = description || product.description;
    product.mainImg = mainImg || product.mainImg;
    product.carousel = carousel || product.carousel;
    product.sizes = sizes || product.sizes;
    product.category = category || product.category;
    product.gender = gender || product.gender;
    product.price = price !== undefined ? Number(price) : product.price;
    product.discount = discount !== undefined ? Number(discount) : product.discount;

    await product.save();
    return res.status(200).json({ message: "Product updated successfully", product });
  } catch (error) {
    return res.status(500).json({ message: "Error updating product", error: error.message });
  }
};

// Delete product (Admin only)
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting product", error: error.message });
  }
};
