import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Card, Button, Spinner, Alert, Badge } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext.jsx';

const ProfilePage = () => {
  const { user, logout } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchUserOrders = async () => {
    try {
      const res = await axios.get('/api/orders');
      setOrders(res.data);
    } catch (err) {
      console.error("Error loading user orders:", err);
      setError("Failed to load your purchase history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserOrders();
    }
  }, [user]);

  const handleCancelOrderClick = async (orderId) => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      try {
        await axios.put(`/api/orders/${orderId}/cancel`);
        // Refresh orders list
        await fetchUserOrders();
      } catch (err) {
        console.error("Cancellation error:", err);
        alert(err.response?.data?.message || "Failed to cancel order");
      }
    }
  };

  const handleLogoutClick = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return (
      <Container className="py-5 text-center">
        <h4 className="fw-bold">Access Denied</h4>
        <p className="text-muted">Please log in to view your profile settings.</p>
        <Button onClick={() => navigate('/login')} variant="primary" className="rounded-pill px-4">
          Go to Login
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-5 fade-in-section">
      <Row className="g-4">
        {/* Left Panel: User Profile Details Card (Screenshot 19) */}
        <Col lg={4} md={5}>
          <Card className="border-0 shadow-sm p-4 bg-white text-center">
            <div
              className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
              style={{ width: '80px', height: '80px', fontSize: '2.5rem' }}
            >
              {user.username.charAt(0).toUpperCase()}
            </div>
            
            <h4 className="fw-bold text-dark mb-1">{user.username}</h4>
            <Badge bg="secondary" className="mb-3 text-uppercase">{user.usertype}</Badge>
            
            <div className="text-start border-top pt-3 mt-2">
              <div className="mb-2">
                <span className="small text-muted d-block">Email Address</span>
                <span className="fw-medium text-dark">{user.email}</span>
              </div>
              <div className="mb-3">
                <span className="small text-muted d-block">Total Placed Orders</span>
                <span className="fw-medium text-dark">{orders.length} orders</span>
              </div>
            </div>

            <Button
              variant="outline-danger"
              className="w-100 rounded-pill py-2.5 mt-3 fw-bold shadow-sm"
              onClick={handleLogoutClick}
            >
              Logout
            </Button>
          </Card>
        </Col>

        {/* Right Panel: Orders History Listing (Screenshot 19) */}
        <Col lg={8} md={7}>
          <h4 className="fw-bold text-dark mb-4">My Orders</h4>
          
          {error && <Alert variant="danger">{error}</Alert>}

          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2 text-muted">Loading purchase history...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-5 bg-white border rounded shadow-sm">
              <div className="fs-2 mb-2">📦</div>
              <h5 className="fw-bold text-dark">No Orders Yet</h5>
              <p className="text-muted small">You haven't placed any purchases yet. Your active orders list will show here.</p>
              <Button onClick={() => navigate('/products')} variant="primary" size="sm" className="rounded-pill px-3">
                Shop Now
              </Button>
            </div>
          ) : (
            <div>
              {orders.map((order) => {
                const isPending = order.orderStatus === 'order placed';
                const isCancelled = order.orderStatus === 'cancelled';
                const isDelivered = order.orderStatus === 'delivered';
                const totalItemPrice = (order.price - order.discount) * order.quantity;

                // Status Badge color mapping
                let statusBg = 'warning';
                if (isCancelled) statusBg = 'danger';
                if (isDelivered) statusBg = 'success';
                if (order.orderStatus === 'shipped') statusBg = 'info';

                return (
                  <Card key={order._id} className="border-0 shadow-sm p-4 bg-white mb-3 rounded-3">
                    <Row className="g-3">
                      <Col xs={4} sm={2.5}>
                        <img
                          src={order.mainImg || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=200'}
                          alt={order.title}
                          className="img-fluid rounded border p-1"
                          style={{ maxHeight: '90px', objectFit: 'contain' }}
                        />
                      </Col>

                      <Col xs={8} sm={9.5}>
                        <div className="d-flex justify-content-between align-items-start mb-1 flex-wrap gap-2">
                          <h6 className="fw-bold text-dark m-0">{order.title}</h6>
                          <Badge bg={statusBg} className="text-uppercase px-2.5 py-1.5">{order.orderStatus}</Badge>
                        </div>

                        <div className="d-flex flex-wrap gap-x-4 gap-y-1 mb-2 text-muted" style={{ fontSize: '0.85rem' }}>
                          <span>Size: <strong className="text-dark text-uppercase">{order.size}</strong></span>
                          <span className="ms-2">Qty: <strong className="text-dark">{order.quantity}</strong></span>
                          <span className="ms-2">Paid: <strong className="text-primary">₹ {totalItemPrice}</strong></span>
                          <span className="ms-2">Method: <strong className="text-dark">{order.paymentMethod}</strong></span>
                        </div>

                        <div className="border-top pt-2 mt-2" style={{ fontSize: '0.8rem' }}>
                          <div className="text-muted">
                            <span className="fw-medium">Delivery Address:</span> {order.address}, PIN: {order.pincode}
                          </div>
                          <div className="d-flex justify-content-between mt-2 flex-wrap gap-2">
                            <div className="text-muted">
                              Ordered: <strong className="text-dark">{order.orderDate}</strong> | Expected: <strong className="text-dark">{order.deliveryDate}</strong>
                            </div>

                            {isPending && (
                              <Button
                                variant="outline-danger"
                                size="sm"
                                className="px-3 rounded-pill py-0.5"
                                style={{ fontSize: '0.75rem' }}
                                onClick={() => handleCancelOrderClick(order._id)}
                              >
                                Cancel Order
                              </Button>
                            )}
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </Card>
                );
              })}
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ProfilePage;
