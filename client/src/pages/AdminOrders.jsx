import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Card, Row, Col, Form, Button, Badge, Spinner, Alert } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext.jsx';

const AdminOrders = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Track selected status locally for each order ID: { [orderId]: selectedStatusValue }
  const [statusUpdates, setStatusUpdates] = useState({});

  // Route guard check
  useEffect(() => {
    if (!user || (user.usertype !== 'Admin' && user.usertype !== 'admin')) {
      navigate('/');
    }
  }, [user, navigate]);

  const loadAllOrders = async () => {
    try {
      const res = await axios.get('/api/orders/admin');
      setOrders(res.data);
      // Initialize dropdown state map
      const initialMap = {};
      res.data.forEach(order => {
        initialMap[order._id] = order.orderStatus;
      });
      setStatusUpdates(initialMap);
    } catch (err) {
      console.error("Error loading administrative orders list:", err);
      setError("Failed to load customer orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllOrders();
  }, []);

  const handleDropdownStatusChange = (orderId, val) => {
    setStatusUpdates({ ...statusUpdates, [orderId]: val });
  };

  const handleUpdateStatusClick = async (orderId) => {
    const selectedStatus = statusUpdates[orderId];
    try {
      await axios.put(`/api/orders/${orderId}/status`, { orderStatus: selectedStatus });
      alert("Order status updated successfully!");
      await loadAllOrders();
    } catch (err) {
      console.error("Status update error:", err);
      alert(err.response?.data?.message || "Failed to update order status");
    }
  };

  const handleCancelClick = async (orderId) => {
    if (window.confirm("Are you sure you want to cancel this customer order?")) {
      try {
        await axios.put(`/api/orders/${orderId}/status`, { orderStatus: 'cancelled' });
        alert("Order cancelled successfully!");
        await loadAllOrders();
      } catch (err) {
        console.error("Cancellation error:", err);
        alert(err.response?.data?.message || "Failed to cancel order");
      }
    }
  };

  const orderStatuses = ['order placed', 'packed', 'shipped', 'out for delivery', 'delivered', 'cancelled'];

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2 text-muted">Loading customer logistics records...</p>
      </Container>
    );
  }

  return (
    <Container className="py-4 fade-in-section">
      <div className="mb-4">
        <h4 className="fw-bold text-dark m-0">Customer Orders Logistics</h4>
        <p className="text-muted small">Update product delivery stages or handle customer cancellation inquiries.</p>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {orders.length === 0 ? (
        <div className="text-center py-5 bg-white border rounded shadow-sm">
          <div className="fs-2 mb-2">📋</div>
          <h5 className="fw-bold text-dark">No Orders Placed</h5>
          <p className="text-muted small">Customer transactions list will dynamically log here.</p>
        </div>
      ) : (
        <div>
          {orders.map((order) => {
            const isCancelled = order.orderStatus === 'cancelled';
            const isDelivered = order.orderStatus === 'delivered';
            const totalItemPrice = (order.price - order.discount) * order.quantity;

            let badgeBg = 'warning';
            if (isCancelled) badgeBg = 'danger';
            if (isDelivered) badgeBg = 'success';
            if (order.orderStatus === 'shipped') badgeBg = 'info';

            return (
              <Card key={order._id} className="border-0 shadow-sm p-4 bg-white mb-3 rounded-3">
                <Row className="g-3 align-items-start">
                  {/* Thumbnail */}
                  <Col xs={3} sm={1.5}>
                    <img
                      src={order.mainImg || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=200'}
                      alt=""
                      className="img-fluid rounded border p-1"
                      style={{ maxHeight: '80px', objectFit: 'contain' }}
                    />
                  </Col>

                  {/* Order Details */}
                  <Col xs={9} sm={6.5}>
                    <div className="d-flex justify-content-between align-items-center mb-1 flex-wrap gap-2">
                      <h6 className="fw-bold text-dark m-0">{order.title}</h6>
                      <Badge bg={badgeBg} className="text-uppercase small">{order.orderStatus}</Badge>
                    </div>

                    <div className="small text-muted mb-2">
                      <span>Size: <strong className="text-dark text-uppercase">{order.size}</strong></span>
                      <span className="ms-3">Qty: <strong className="text-dark">{order.quantity}</strong></span>
                      <span className="ms-3">Net: <strong className="text-primary">₹ {totalItemPrice}</strong></span>
                      <span className="ms-3">Method: <strong className="text-dark">{order.paymentMethod}</strong></span>
                    </div>

                    <div className="border-top pt-2 mt-2 bg-light rounded p-2" style={{ fontSize: '0.8rem' }}>
                      <div className="text-dark fw-bold mb-1">Customer & Delivery Details:</div>
                      <div className="text-muted">
                        <span className="fw-semibold">Name:</span> {order.name} | <span className="fw-semibold">Email:</span> {order.email} | <span className="fw-semibold">Mobile:</span> {order.mobile}
                      </div>
                      <div className="text-muted mt-1">
                        <span className="fw-semibold">Address:</span> {order.address}, PIN: {order.pincode}
                      </div>
                      <div className="text-muted mt-1">
                        Ordered on: <strong>{order.orderDate}</strong> | Delivery: <strong>{order.deliveryDate}</strong>
                      </div>
                    </div>
                  </Col>

                  {/* Actions (Screenshot 19) */}
                  <Col xs={12} sm={4} className="text-sm-end text-start">
                    <div className="d-flex flex-column align-items-sm-end gap-2">
                      <Form.Group className="w-100" style={{ maxWidth: '200px' }}>
                        <Form.Label className="small text-muted mb-1 text-start d-block">Update Status</Form.Label>
                        <Form.Select
                          size="sm"
                          value={statusUpdates[order._id] || order.orderStatus}
                          onChange={(e) => handleDropdownStatusChange(order._id, e.target.value)}
                          className="text-capitalize"
                        >
                          {orderStatuses.map((st) => (
                            <option key={st} value={st}>{st}</option>
                          ))}
                        </Form.Select>
                      </Form.Group>

                      <div className="d-flex gap-2 justify-content-sm-end w-100" style={{ maxWidth: '200px' }}>
                        <Button
                          variant="primary"
                          size="sm"
                          className="flex-grow-1"
                          onClick={() => handleUpdateStatusClick(order._id)}
                        >
                          Update
                        </Button>
                        {!isCancelled && !isDelivered && (
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleCancelClick(order._id)}
                          >
                            Cancel
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
    </Container>
  );
};

export default AdminOrders;
