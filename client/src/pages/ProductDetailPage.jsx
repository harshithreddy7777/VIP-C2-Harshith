import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Button, Badge, Spinner, Alert } from 'react-bootstrap';
import { CartContext } from '../context/CartContext.jsx';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [addedAlert, setAddedAlert] = useState(false);

  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  useEffect(() => {
    const loadProductDetails = async () => {
      try {
        const res = await axios.get(`/api/products/${id}`);
        setProduct(res.data);
        setActiveImage(res.data.mainImg);
        // Default size selection to the first available size
        if (res.data.sizes && res.data.sizes.length > 0) {
          setSelectedSize(res.data.sizes[0]);
        }
      } catch (error) {
        setError("Error loading product details. It may not exist.");
      } finally {
        setLoading(false);
      }
    };
    loadProductDetails();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, selectedSize, quantity);
    setAddedAlert(true);
    setTimeout(() => {
      setAddedAlert(false);
    }, 2500);
  };

  const handleBuyNow = () => {
    if (!product) return;
    addToCart(product, selectedSize, quantity);
    navigate('/cart');
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2 text-muted">Loading product specifications...</p>
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error || "Product not found."}</Alert>
        <Link to="/products" className="btn btn-primary rounded-pill">Back to Shop</Link>
      </Container>
    );
  }

  const { title, description, price, discount, category, gender, sizes, carousel } = product;
  const originalPrice = price + discount;
  const discountPercentage = discount > 0 ? Math.round((discount / originalPrice) * 100) : 0;

  return (
    <Container className="py-5 fade-in-section">
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/">Home</Link></li>
          <li className="breadcrumb-item"><Link to="/products">Products</Link></li>
          <li className="breadcrumb-item active" aria-current="page">{title}</li>
        </ol>
      </nav>

      {addedAlert && (
        <Alert variant="success" className="mb-4 py-2 text-center shadow-sm">
          🎉 Item successfully added to your shopping cart!
        </Alert>
      )}

      <Row className="g-5">
        {/* Left Side: Image Gallery */}
        <Col md={6}>
          <div className="border rounded bg-white text-center p-3 mb-3 shadow-sm" style={{ height: '400px' }}>
            <img
              src={activeImage}
              alt={title}
              className="w-100 h-100 object-fit-contain"
              style={{ objectFit: 'contain' }}
            />
          </div>
          {carousel && carousel.length > 1 && (
            <Row className="g-2 justify-content-center">
              {carousel.map((img, idx) => (
                <Col key={idx} xs={3} sm={2}>
                  <div
                    className={`border rounded p-1 bg-white cursor-pointer overflow-hidden ${activeImage === img ? 'border-primary border-2' : ''}`}
                    style={{ height: '65px', cursor: 'pointer' }}
                    onClick={() => setActiveImage(img)}
                  >
                    <img src={img} className="w-100 h-100 object-fit-cover" alt="" style={{ objectFit: 'cover' }} />
                  </div>
                </Col>
              ))}
            </Row>
          )}
        </Col>

        {/* Right Side: Product details */}
        <Col md={6}>
          <div>
            <div className="d-flex align-items-center gap-2 mb-2">
              <Badge bg="secondary" className="text-uppercase px-2.5 py-1.5">{category}</Badge>
              <Badge bg="info" className="text-white text-uppercase px-2.5 py-1.5">{gender}</Badge>
            </div>
            
            <h1 className="fw-bold text-dark fs-2 mb-2">{title}</h1>
            
            <div className="d-flex align-items-center mb-3">
              <span className="text-warning fs-5 me-2">★★★★☆</span>
              <span className="text-muted small">(4.0 / 5.0 Rating based on user reviews)</span>
            </div>

            <hr />

            {/* Pricing Section */}
            <div className="my-3">
              <div className="d-flex align-items-baseline gap-3 mb-1">
                <span className="fs-2 fw-bold text-primary">₹ {price}</span>
                {discount > 0 && (
                  <>
                    <span className="text-muted text-decoration-line-through fs-5">
                      ₹ {originalPrice}
                    </span>
                    <Badge bg="danger" className="fs-6 py-1.5 px-2">{discountPercentage}% OFF</Badge>
                  </>
                )}
              </div>
              <small className="text-muted d-block">Inclusive of all local taxes and delivery charges.</small>
            </div>

            <hr />

            {/* Description */}
            <div className="my-3">
              <h6 className="fw-bold text-dark mb-2">Product Description</h6>
              <p className="text-muted" style={{ lineHeight: '1.6' }}>
                {description}
              </p>
            </div>

            {/* Sizes selector */}
            {sizes && sizes.length > 0 && (
              <div className="my-4">
                <h6 className="fw-bold text-dark mb-2">Select Size</h6>
                <div className="d-flex flex-wrap gap-2">
                  {sizes.map((size) => (
                    <Button
                      key={size}
                      variant={selectedSize === size ? 'primary' : 'outline-secondary'}
                      className="px-4 py-2 rounded-3 text-uppercase font-weight-bold"
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity select counter */}
            <div className="my-4 d-flex align-items-center gap-3">
              <h6 className="fw-bold text-dark m-0">Quantity</h6>
              <div className="d-flex align-items-center border rounded-3 bg-white">
                <Button
                  variant="link"
                  className="text-dark p-2 text-decoration-none fw-bold px-3"
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                >
                  -
                </Button>
                <span className="px-3 fw-bold">{quantity}</span>
                <Button
                  variant="link"
                  className="text-dark p-2 text-decoration-none fw-bold px-3"
                  onClick={() => setQuantity(prev => prev + 1)}
                >
                  +
                </Button>
              </div>
            </div>

            {/* CTA Action Buttons */}
            <Row className="g-3 mt-4">
              <Col xs={12} sm={6}>
                <Button
                  variant="outline-primary"
                  className="w-100 py-3 rounded-pill fw-bold shadow-sm"
                  onClick={handleAddToCart}
                >
                  Add to Cart 🛒
                </Button>
              </Col>
              <Col xs={12} sm={6}>
                <Button
                  variant="primary"
                  className="w-100 py-3 rounded-pill fw-bold shadow-sm"
                  onClick={handleBuyNow}
                >
                  Buy Now ⚡
                </Button>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductDetailPage;
