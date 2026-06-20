import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import ProductCard from '../components/ProductCard.jsx';

const LandingPage = () => {
  const [products, setProducts] = useState([]);
  const [storeConfig, setStoreConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const configRes = await axios.get('/api/admin/config');
        setStoreConfig(configRes.data);

        const productsRes = await axios.get('/api/products');
        // Get first 4 products for featured listing
        setProducts(productsRes.data.slice(0, 4));
      } catch (error) {
        console.error("Error loading landing page resources:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const categories = [
    { name: 'Fashion', img: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=200' },
    { name: 'Electronics', img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=200' },
    { name: 'Mobiles', img: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=200' },
    { name: 'Groceries', img: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=200' },
    { name: 'Sports Equipments', img: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=200' }
  ];

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2 text-muted">Loading ShopEZ catalog...</p>
      </Container>
    );
  }

  const activeBanner = storeConfig?.banner || "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=1200";

  return (
    <div className="fade-in-section pb-5">
      {/* Dynamic Store Banner (Screenshot 19) */}
      <div className="w-100 overflow-hidden shadow-sm" style={{ maxHeight: '420px' }}>
        <img
          src={activeBanner}
          className="w-100 h-100 object-fit-cover"
          style={{ maxHeight: '420px', minHeight: '220px', objectFit: 'cover' }}
          alt="ShopEZ Store Promotion Banner"
        />
      </div>

      {/* Circle Categories Section (Screenshot 19) */}
      <Container className="mt-5 text-center">
        <h4 className="fw-bold mb-4 text-dark text-start">Browse Categories</h4>
        <Row className="justify-content-center g-4">
          {categories.map((cat, idx) => (
            <Col key={idx} xs={6} sm={4} md={2} className="d-flex justify-content-center">
              <Link to={`/products?category=${encodeURIComponent(cat.name)}`} className="category-circle-card text-center d-block">
                <img
                  src={cat.img}
                  alt={cat.name}
                  className="category-circle-img mb-2"
                />
                <div className="small fw-semibold mt-1">{cat.name}</div>
              </Link>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Featured Products list */}
      <Container className="mt-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="fw-bold m-0 text-dark">Trending Now</h4>
          <Link to="/products" className="text-primary fw-semibold text-decoration-none small">
            View All Products →
          </Link>
        </div>
        
        {products.length === 0 ? (
          <div className="text-center py-4 border rounded bg-white text-muted">
            No products available. Please check back later.
          </div>
        ) : (
          <Row className="g-4">
            {products.map((prod) => (
              <Col key={prod._id} xs={12} sm={6} md={4} lg={3}>
                <ProductCard product={prod} />
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </div>
  );
};

export default LandingPage;
