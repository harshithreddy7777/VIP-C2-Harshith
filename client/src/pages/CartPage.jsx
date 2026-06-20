import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { CartContext } from '../context/CartContext.jsx';
import { AuthContext } from '../context/AuthContext.jsx';

const CartPage = () => {
  const { cart, updateCartQuantity, removeFromCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  // Calculate pricing values
  const totalMRP = cart.reduce((sum, item) => sum + (item.price + item.discount) * item.quantity, 0);
  const totalDiscount = cart.reduce((sum, item) => sum + item.discount * item.quantity, 0);
  const finalPrice = totalMRP - totalDiscount;
  const deliveryCharge = finalPrice > 500 || finalPrice === 0 ? 0 : 40;
  const grandTotal = finalPrice + deliveryCharge;

  const handleQtyChange = (itemId, currentQty, amount) => {
    updateCartQuantity(itemId, currentQty + amount);
  };

  if (cart.length === 0) {
    return (
      <Container className="py-5 text-center fade-in-section">
        <div className="fs-1 mb-3">🛒</div>
        <h3 className="fw-bold text-dark">Your Cart is Empty</h3>
        <p className="text-muted small">You haven't added any products to your cart yet.</p>
        <Link to="/products" className="btn btn-primary rounded-pill px-4 py-2 mt-3">
          Explore Products
        </Link>
      </Container>
    );
  }

  return (
    <Container className="py-5 fade-in-section">
      <h3 className="fw-bold text-dark mb-4">Shopping Cart ({cart.length} items)</h3>
      <Row className="g-4">
        {/* Left Side: Cart Items list */}
        <Col lg={8}>
          {cart.map((item) => {
            const itemPrice = item.price;
            const itemOriginalPrice = item.price + item.discount;
            return (
              <Card key={item._id} className="border-0 shadow-sm rounded-3 mb-3 p-3 bg-white">
                <Row className="g-3 align-items-center">
                  <Col xs={4} sm={2.5}>
                    <img
                      src={item.mainImg || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=200'}
                      alt={item.title}
                      className="img-fluid rounded border p-1"
                      style={{ maxHeight: '90px', objectFit: 'contain' }}
                    />
                  </Col>
                  
                  <Col xs={8} sm={6.5}>
                    <h6 className="fw-bold text-dark mb-1">{item.title}</h6>
                    <p className="text-muted small mb-2 text-truncate" style={{ maxWidth: '350px' }}>
                      {item.description}
                    </p>
                    
                    <div className="d-flex align-items-center flex-wrap gap-3 mb-2">
                      <div className="small">
                        <span className="text-muted">Size: </span>
                        <span className="fw-bold text-uppercase bg-light border px-2 py-0.5 rounded">{item.size}</span>
                      </div>
                      
                      {/* Quantity counter */}
                      <div className="d-flex align-items-center border rounded bg-light" style={{ height: '30px' }}>
                        <Button
                          variant="link"
                          className="text-dark p-0 px-2 text-decoration-none fw-bold small"
                          onClick={() => handleQtyChange(item._id, item.quantity, -1)}
                        >
                          -
                        </Button>
                        <span className="px-2 small fw-bold">{item.quantity}</span>
                        <Button
                          variant="link"
                          className="text-dark p-0 px-2 text-decoration-none fw-bold small"
                          onClick={() => handleQtyChange(item._id, item.quantity, 1)}
                        >
                          +
                        </Button>
                      </div>
                    </div>

                    <button
                      className="btn btn-link btn-sm text-danger p-0 text-decoration-none small fw-medium"
                      onClick={() => removeFromCart(item._id)}
                    >
                      Remove
                    </button>
                  </Col>

                  <Col xs={12} sm={3} className="text-sm-end text-start mt-2 mt-sm-0">
                    <div className="fw-bold text-primary fs-5">₹ {itemPrice * item.quantity}</div>
                    {item.discount > 0 && (
                      <div className="text-muted text-decoration-line-through small">
                        ₹ {itemOriginalPrice * item.quantity}
                      </div>
                    )}
                  </Col>
                </Row>
              </Card>
            );
          })}
        </Col>

        {/* Right Side: Pricing Card (Screenshot 19) */}
        <Col lg={4}>
          <Card className="border-0 shadow-sm rounded-3 p-4 bg-white sticky-top" style={{ top: '100px' }}>
            <h5 className="fw-bold text-dark pb-3 border-bottom">Price Details</h5>
            
            <div className="d-flex justify-content-between mb-2 mt-3 small text-muted">
              <span>Total Price (MRP)</span>
              <span>₹ {totalMRP}</span>
            </div>

            <div className="d-flex justify-content-between mb-2 small text-success">
              <span>Discount on MRP</span>
              <span>- ₹ {totalDiscount}</span>
            </div>

            <div className="d-flex justify-content-between mb-3 pb-3 border-bottom small text-muted">
              <span>Delivery Charges</span>
              <span>{deliveryCharge === 0 ? 'Free' : `₹ ${deliveryCharge}`}</span>
            </div>

            <div className="d-flex justify-content-between mb-4 fw-bold fs-5 text-dark">
              <span>Final Price</span>
              <span>₹ {grandTotal}</span>
            </div>

            {user ? (
              <Button
                as={Link}
                to="/checkout"
                variant="primary"
                className="w-100 py-2.5 rounded-pill fw-bold shadow-sm"
              >
                Place Order
              </Button>
            ) : (
              <div>
                <Button
                  as={Link}
                  to="/login?redirect=checkout"
                  variant="primary"
                  className="w-100 py-2.5 rounded-pill fw-bold shadow-sm mb-2"
                >
                  Log In to Checkout
                </Button>
                <small className="text-muted d-block text-center" style={{ fontSize: '0.75rem' }}>
                  An account is required to place orders.
                </small>
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CartPage;
