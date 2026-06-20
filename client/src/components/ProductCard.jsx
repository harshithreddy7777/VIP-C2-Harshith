import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const { _id, title, mainImg, price, discount, category } = product;

  // Calculate discount percentage
  const discountPercentage = discount > 0 ? Math.round((discount / (price + discount)) * 100) : 0;
  const currentPrice = price;
  const originalPrice = price + discount;

  return (
    <Card className="product-card-custom h-100 border-0 shadow-sm">
      <div className="product-card-img-wrapper">
        {discount > 0 && (
          <span className="discount-badge">{discountPercentage}% OFF</span>
        )}
        <Card.Img
          variant="top"
          src={mainImg || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=400'}
          className="product-card-img"
          alt={title}
          style={{ height: '200px', objectFit: 'cover' }}
        />
      </div>
      <Card.Body className="d-flex flex-column justify-content-between p-3">
        <div>
          <span className="text-uppercase text-muted fw-bold" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>
            {category}
          </span>
          <Card.Title className="fs-6 fw-bold mt-1 text-truncate" title={title}>
            {title}
          </Card.Title>
          <div className="d-flex align-items-center my-2">
            {/* Display static mock rating stars for visual appeal */}
            <span className="text-warning me-1">★★★★☆</span>
            <span className="text-muted" style={{ fontSize: '0.8rem' }}>(4.0)</span>
          </div>
        </div>

        <div>
          <div className="d-flex align-items-baseline gap-2 mb-3">
            <span className="fs-5 fw-bold text-primary">₹ {currentPrice}</span>
            {discount > 0 && (
              <span className="text-muted text-decoration-line-through" style={{ fontSize: '0.85rem' }}>
                ₹ {originalPrice}
              </span>
            )}
          </div>

          <Button
            as={Link}
            to={`/products/${_id}`}
            variant="primary"
            className="w-100 rounded-pill py-2 fw-medium shadow-sm transition-smooth"
            style={{ fontSize: '0.9rem' }}
          >
            Shop Now
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;
