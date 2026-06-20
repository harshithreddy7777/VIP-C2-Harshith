import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { CartContext } from '../context/CartContext.jsx';
import { AuthContext } from '../context/AuthContext.jsx';

const CheckoutPage = () => {
  const { cart, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Step state: 1 (Shipping), 2 (Payment), 3 (Processing), 4 (Success)
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');

  // Shipping details form state
  const [shippingInfo, setShippingInfo] = useState({
    name: user?.username || '',
    email: user?.email || '',
    mobile: '',
    address: '',
    pincode: ''
  });

  // Payment form state
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [placedOrders, setPlacedOrders] = useState([]);

  // Calculate prices
  const totalMRP = cart.reduce((sum, item) => sum + (item.price + item.discount) * item.quantity, 0);
  const totalDiscount = cart.reduce((sum, item) => sum + item.discount * item.quantity, 0);
  const finalPrice = totalMRP - totalDiscount;
  const deliveryCharge = finalPrice > 500 ? 0 : 40;
  const grandTotal = finalPrice + deliveryCharge;

  const handleShippingChange = (e) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    setError('');

    const { name, email, mobile, address, pincode } = shippingInfo;
    if (!name || !email || !mobile || !address || !pincode) {
      return setError('Please fill in all shipping details');
    }

    if (mobile.length < 10) {
      return setError('Mobile number must be at least 10 digits long');
    }

    setStep(2);
  };

  const handlePlaceOrderSubmit = async () => {
    setError('');
    setStep(3); // Start simulated loading screen

    try {
      // Simulate transaction processing delay (1.5 seconds)
      await new Promise(resolve => setTimeout(resolve, 1500));

      const payload = {
        name: shippingInfo.name,
        email: shippingInfo.email,
        mobile: shippingInfo.mobile,
        address: shippingInfo.address,
        pincode: shippingInfo.pincode,
        paymentMethod,
        items: cart.map(item => ({
          title: item.title,
          description: item.description,
          mainImg: item.mainImg,
          size: item.size,
          quantity: item.quantity,
          price: item.price,
          discount: item.discount
        }))
      };

      const res = await axios.post('/api/orders', payload);
      setPlacedOrders(res.data.orders);
      
      // Clear cart
      await clearCart();
      setStep(4); // Move to Success Screen
    } catch (err) {
      console.error("Order submission failed:", err);
      setError(err.response?.data?.message || 'Failed to submit order. Please try again.');
      setStep(2); // Go back to payment step on failure
    }
  };

  // Redirect if cart is empty and not on Success screen
  if (cart.length === 0 && step !== 4) {
    return (
      <Container className="py-5 text-center">
        <h4 className="fw-bold">No active checkout session</h4>
        <p className="text-muted">Your cart is empty. Please add items before checking out.</p>
        <Link to="/products" className="btn btn-primary rounded-pill px-4">Browse Catalog</Link>
      </Container>
    );
  }

  return (
    <Container className="py-5 fade-in-section">
      {/* Checkout step progress indicators */}
      <div className="d-flex justify-content-center mb-5" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <Row className="w-100 text-center">
          <Col xs={3}>
            <div className={`checkout-step-dot ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
              {step > 1 ? '✓' : '1'}
            </div>
            <span className="small fw-semibold text-muted">Shipping</span>
          </Col>
          <Col xs={3}>
            <div className={`checkout-step-dot ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
              {step > 2 ? '✓' : '2'}
            </div>
            <span className="small fw-semibold text-muted">Payment</span>
          </Col>
          <Col xs={3}>
            <div className={`checkout-step-dot ${step === 3 ? 'active' : ''} ${step > 3 ? 'completed' : ''}`}>
              {step > 3 ? '✓' : '3'}
            </div>
            <span className="small fw-semibold text-muted">Processing</span>
          </Col>
          <Col xs={3}>
            <div className={`checkout-step-dot ${step === 4 ? 'active' : ''} ${step === 4 ? 'completed' : ''}`}>
              {step === 4 ? '✓' : '4'}
            </div>
            <span className="small fw-semibold text-muted">Done</span>
          </Col>
        </Row>
      </div>

      {error && <Alert variant="danger" className="text-center">{error}</Alert>}

      <Row className="g-4">
        {/* Main interactive panel */}
        <Col lg={8}>
          {step === 1 && (
            <Card className="border-0 shadow-sm p-4 bg-white">
              <h5 className="fw-bold text-dark mb-4">1. Delivery Address Information</h5>
              <Form onSubmit={handleShippingSubmit}>
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Group controlId="ship-name">
                      <Form.Label className="small fw-semibold">Contact Person Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        required
                        className="py-2"
                        value={shippingInfo.name}
                        onChange={handleShippingChange}
                      />
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group controlId="ship-email">
                      <Form.Label className="small fw-semibold">Email Address</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        required
                        className="py-2"
                        value={shippingInfo.email}
                        onChange={handleShippingChange}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group controlId="ship-mobile">
                      <Form.Label className="small fw-semibold">Mobile Number</Form.Label>
                      <Form.Control
                        type="tel"
                        name="mobile"
                        required
                        placeholder="10 digit mobile number"
                        className="py-2"
                        value={shippingInfo.mobile}
                        onChange={handleShippingChange}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group controlId="ship-pincode">
                      <Form.Label className="small fw-semibold">PIN Code</Form.Label>
                      <Form.Control
                        type="text"
                        name="pincode"
                        required
                        placeholder="6 digit PIN code"
                        className="py-2"
                        value={shippingInfo.pincode}
                        onChange={handleShippingChange}
                      />
                    </Form.Group>
                  </Col>

                  <Col xs={12}>
                    <Form.Group controlId="ship-address">
                      <Form.Label className="small fw-semibold">Residential Address</Form.Label>
                      <Form.Control
                        as="textarea"
                        name="address"
                        rows={3}
                        required
                        placeholder="Flat no, Street Name, City, State"
                        className="py-2"
                        value={shippingInfo.address}
                        onChange={handleShippingChange}
                      />
                    </Form.Group>
                  </Col>

                  <Col xs={12} className="text-end mt-4">
                    <Button type="submit" variant="primary" className="px-5 py-2 rounded-pill fw-bold">
                      Continue to Payment
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Card>
          )}

          {step === 2 && (
            <Card className="border-0 shadow-sm p-4 bg-white">
              <h5 className="fw-bold text-dark mb-4">2. Select Payment Method</h5>
              <Form>
                {['Cash on Delivery', 'Credit/Debit Card', 'UPI Payment'].map((method) => (
                  <Card key={method} className={`border p-3 mb-3 cursor-pointer ${paymentMethod === method ? 'border-primary bg-light-subtle' : ''}`} style={{ cursor: 'pointer' }} onClick={() => setPaymentMethod(method)}>
                    <Form.Check
                      type="radio"
                      id={`pay-${method}`}
                      label={
                        <div className="ms-2">
                          <span className="fw-bold d-block text-dark">{method}</span>
                          <span className="small text-muted">
                            {method === 'Cash on Delivery' && 'Pay with cash upon package delivery to your address.'}
                            {method === 'Credit/Debit Card' && 'Simulate secure card gateway processing.'}
                            {method === 'UPI Payment' && 'Mock mobile UPI (Google Pay, PhonePe, Paytm).'}
                          </span>
                        </div>
                      }
                      name="payment-method"
                      checked={paymentMethod === method}
                      onChange={() => setPaymentMethod(method)}
                    />
                  </Card>
                ))}

                <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
                  <Button variant="link" className="text-decoration-none fw-semibold" onClick={() => setStep(1)}>
                    ← Back to Shipping
                  </Button>
                  <Button variant="primary" className="px-5 py-2 rounded-pill fw-bold" onClick={handlePlaceOrderSubmit}>
                    Pay & Place Order (₹ {grandTotal})
                  </Button>
                </div>
              </Form>
            </Card>
          )}

          {step === 3 && (
            <Card className="border-0 shadow-sm p-5 bg-white text-center">
              <Spinner animation="border" variant="primary" className="mb-4" style={{ width: '4rem', height: '4rem' }} />
              <h4 className="fw-bold text-dark">Processing Payment Transaction</h4>
              <p className="text-muted small mx-auto" style={{ maxWidth: '350px' }}>
                Please do not close this window, refresh the page, or click the back button. We are securely validating your transaction details...
              </p>
            </Card>
          )}

          {step === 4 && (
            <Card className="border-0 shadow-sm p-5 bg-white text-center">
              <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4" style={{ width: '70px', height: '70px', fontSize: '2rem' }}>
                ✓
              </div>
              <h3 className="fw-bold text-success mb-2">Order Confirmed!</h3>
              <p className="text-muted mb-4">
                Thank you for shopping with ShopEZ. Your order has been placed successfully and is currently being processed.
              </p>
              
              <div className="border rounded bg-light p-4 mb-4 text-start" style={{ maxWidth: '500px', margin: '0 auto' }}>
                <h6 className="fw-bold border-bottom pb-2 mb-3 text-dark">Order Details Summary</h6>
                <div className="small text-muted mb-1">
                  <span className="fw-medium">Recipient Name:</span> {shippingInfo.name}
                </div>
                <div className="small text-muted mb-1">
                  <span className="fw-medium">Delivery Address:</span> {shippingInfo.address}, {shippingInfo.pincode}
                </div>
                <div className="small text-muted mb-1">
                  <span className="fw-medium">Payment Mode:</span> {paymentMethod}
                </div>
                <div className="small text-muted">
                  <span className="fw-medium">Estimated Arrival:</span> {placedOrders[0]?.deliveryDate || 'Within 5 Days'}
                </div>
              </div>

              <div className="d-flex justify-content-center gap-3">
                <Button as={Link} to="/profile" variant="primary" className="rounded-pill px-4 py-2">
                  View My Orders
                </Button>
                <Button as={Link} to="/products" variant="outline-primary" className="rounded-pill px-4 py-2">
                  Continue Shopping
                </Button>
              </div>
            </Card>
          )}
        </Col>

        {/* Right Side order summary - hide on Success screen */}
        {step !== 4 && (
          <Col lg={4}>
            <Card className="border-0 shadow-sm p-4 bg-white sticky-top" style={{ top: '100px' }}>
              <h5 className="fw-bold text-dark pb-3 border-bottom">Order Items ({cart.length})</h5>
              
              <div className="my-3 overflow-auto" style={{ maxHeight: '200px' }}>
                {cart.map((item) => (
                  <div key={item._id} className="d-flex align-items-center gap-3 mb-3">
                    <img src={item.mainImg} className="img-thumbnail" alt="" style={{ width: '45px', height: '45px', objectFit: 'contain' }} />
                    <div className="text-truncate flex-grow-1" style={{ maxWidth: '160px' }}>
                      <span className="fw-bold d-block text-dark small text-truncate">{item.title}</span>
                      <span className="text-muted small">Qty: {item.quantity} | Size: {item.size}</span>
                    </div>
                    <span className="fw-bold text-dark small">₹ {item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <hr />

              <div className="d-flex justify-content-between mb-2 small text-muted">
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

              <div className="d-flex justify-content-between fw-bold text-dark fs-5">
                <span>Final Price</span>
                <span>₹ {grandTotal}</span>
              </div>
            </Card>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default CheckoutPage;
