import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Card, Button, Form, Spinner, Alert, Modal, Badge } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext.jsx';
import { sanitizeImageUrl } from '../utils/imageSanitizer.js';

// Import Chart.js components
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title as ChartTitle,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ChartTitle,
  Tooltip,
  Legend,
  ArcElement
);

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [storeConfig, setStoreConfig] = useState(null);
  const [bannerInput, setBannerInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Registered users state
  const [showUsersModal, setShowUsersModal] = useState(false);
  const [usersList, setUsersList] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);

  const handleViewUsersClick = async () => {
    setShowUsersModal(true);
    setUsersLoading(true);
    try {
      const res = await axios.get('/api/admin/users');
      setUsersList(res.data);
    } catch (err) {
      console.error("Failed to load user list:", err);
    } finally {
      setUsersLoading(false);
    }
  };

  // Guard routing
  useEffect(() => {
    if (!user || (user.usertype !== 'Admin' && user.usertype !== 'admin')) {
      navigate('/');
    }
  }, [user, navigate]);

  const loadDashboardData = async () => {
    try {
      const statsRes = await axios.get('/api/admin/stats');
      setStats(statsRes.data);

      const configRes = await axios.get('/api/admin/config');
      setStoreConfig(configRes.data);
      setBannerInput(configRes.data.banner || '');
    } catch (err) {
      console.error("Error loading dashboard metrics:", err);
      setMessage({ type: 'danger', text: 'Error fetching metrics from server.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleBannerUpdateSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    
    const sanitizedBanner = sanitizeImageUrl(bannerInput);
    if (!sanitizedBanner) {
      return setMessage({ type: 'danger', text: 'Banner URL cannot be empty.' });
    }
    setBannerInput(sanitizedBanner);

    setActionLoading(true);
    try {
      const res = await axios.put('/api/admin/config', { banner: sanitizedBanner });
      setStoreConfig(res.data.config);
      setMessage({ type: 'success', text: 'Banner image updated successfully.' });
    } catch (err) {
      console.error("Banner update failed:", err);
      setMessage({ type: 'danger', text: 'Failed to update storefront banner.' });
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2 text-muted">Analyzing dashboard metrics...</p>
      </Container>
    );
  }

  // Chart Data preparation
  const salesBarData = {
    labels: stats?.productSales?.map(item => item._id) || [],
    datasets: [
      {
        label: 'Revenue (₹)',
        data: stats?.productSales?.map(item => item.revenue) || [],
        backgroundColor: 'rgba(59, 130, 246, 0.75)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1
      }
    ]
  };

  const statusPieData = {
    labels: stats?.ordersByStatus?.map(item => item._id) || [],
    datasets: [
      {
        data: stats?.ordersByStatus?.map(item => item.count) || [],
        backgroundColor: [
          'rgba(245, 158, 11, 0.75)', // placed
          'rgba(16, 185, 129, 0.75)', // delivered
          'rgba(59, 130, 246, 0.75)', // shipped
          'rgba(239, 68, 68, 0.75)',  // cancelled
          'rgba(139, 92, 246, 0.75)'  // default/others
        ],
        borderWidth: 1
      }
    ]
  };

  return (
    <Container className="py-4 fade-in-section">
      <div className="mb-4">
        <h3 className="fw-bold text-dark m-0">ShopEZ (Admin Dashboard)</h3>
        <p className="text-muted small">Manage portal sales, configurations, and logistics details.</p>
      </div>

      {message.text && (
        <Alert variant={message.type} className="py-2 text-center small shadow-sm mb-4">
          {message.text}
        </Alert>
      )}

      {/* Stats Summary Cards (Screenshot 19) */}
      <Row className="g-3 mb-5">
        <Col md={3} sm={6}>
          <Card className="admin-stat-card users p-3">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className="small text-muted text-uppercase fw-bold">Total Users</span>
                <h3 className="fw-bold text-dark mt-1 mb-2">{stats?.totalUsers || 0}</h3>
              </div>
              <span className="fs-2">👥</span>
            </div>
            <Button variant="link" onClick={handleViewUsersClick} className="p-0 text-start text-decoration-none small text-primary fw-medium">
              View details
            </Button>
          </Card>
        </Col>

        <Col md={3} sm={6}>
          <Card className="admin-stat-card products p-3">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className="small text-muted text-uppercase fw-bold">All Products</span>
                <h3 className="fw-bold text-dark mt-1 mb-2">{stats?.totalProducts || 0}</h3>
              </div>
              <span className="fs-2">📦</span>
            </div>
            <Button as={Link} to="/admin/products" variant="link" className="p-0 text-start text-decoration-none small text-success fw-medium">
              View all
            </Button>
          </Card>
        </Col>

        <Col md={3} sm={6}>
          <Card className="admin-stat-card orders p-3">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className="small text-muted text-uppercase fw-bold">All Orders</span>
                <h3 className="fw-bold text-dark mt-1 mb-2">{stats?.totalOrders || 0}</h3>
              </div>
              <span className="fs-2">📋</span>
            </div>
            <Button as={Link} to="/admin/orders" variant="link" className="p-0 text-start text-decoration-none small text-warning fw-medium">
              View all
            </Button>
          </Card>
        </Col>

        <Col md={3} sm={6}>
          <Card className="admin-stat-card revenue p-3">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className="small text-muted text-uppercase fw-bold">Total Revenue</span>
                <h3 className="fw-bold text-dark mt-1 mb-2">₹ {stats?.totalRevenue || 0}</h3>
              </div>
              <span className="fs-2">💰</span>
            </div>
            <span className="text-muted small">Active earnings</span>
          </Card>
        </Col>
      </Row>

      {/* Banner Setup Form and Graphical Charts */}
      <Row className="g-4 mb-4">
        {/* Banner Section */}
        <Col lg={5} md={12}>
          <Card className="border-0 shadow-sm p-4 bg-white h-100">
            <h5 className="fw-bold text-dark mb-3">Update Store Banner</h5>
            <Form onSubmit={handleBannerUpdateSubmit}>
              <Form.Group className="mb-3" controlId="banner-url">
                <Form.Label className="small text-muted">Landing Page Hero Banner URL</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Paste banner image URL"
                  className="py-2"
                  value={bannerInput}
                  onChange={(e) => setBannerInput(e.target.value)}
                />
              </Form.Group>

              <div className="mb-3 border rounded overflow-hidden" style={{ height: '140px' }}>
                <img
                  src={bannerInput || "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=1200"}
                  alt="Banner preview"
                  className="w-100 h-100 object-fit-cover"
                  style={{ objectFit: 'cover' }}
                />
              </div>

              <Button type="submit" variant="primary" disabled={actionLoading} className="w-100 py-2.5 rounded-pill fw-bold">
                {actionLoading ? <Spinner animation="border" size="sm" /> : 'Update Banner'}
              </Button>
            </Form>
          </Card>
        </Col>

        {/* Sales by Item Chart */}
        <Col lg={7} md={12}>
          <Card className="border-0 shadow-sm p-4 bg-white h-100">
            <h5 className="fw-bold text-dark mb-4">Top 5 Product Revenue</h5>
            <div style={{ position: 'relative', height: '230px' }}>
              <Bar
                data={salesBarData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } }
                }}
              />
            </div>
          </Card>
        </Col>

        {/* Orders status distribution Chart */}
        <Col xs={12}>
          <Card className="border-0 shadow-sm p-4 bg-white">
            <h5 className="fw-bold text-dark mb-4">Orders Status Distribution</h5>
            <Row className="align-items-center">
              <Col md={5} className="d-flex justify-content-center mb-3 mb-md-0">
                <div style={{ width: '220px', height: '220px' }}>
                  <Pie data={statusPieData} options={{ responsive: true, maintainAspectRatio: false }} />
                </div>
              </Col>
              <Col md={7}>
                <div className="table-responsive">
                  <table className="table table-sm border align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th className="small">Status Role</th>
                        <th className="small text-center">Orders Count</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats?.ordersByStatus?.map((stat, idx) => (
                        <tr key={idx}>
                          <td className="small text-capitalize fw-bold">{stat._id}</td>
                          <td className="small text-center">{stat.count}</td>
                        </tr>
                      ))}
                      {(!stats?.ordersByStatus || stats.ordersByStatus.length === 0) && (
                        <tr>
                          <td colSpan="2" className="text-center small text-muted py-2">No status records yet.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {/* Registered Users Modal */}
      <Modal show={showUsersModal} onHide={() => setShowUsersModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold text-dark">Registered Customer Accounts</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {usersLoading ? (
            <div className="text-center py-4">
              <Spinner animation="border" variant="primary" />
              <p className="text-muted small mt-2">Fetching user registry...</p>
            </div>
          ) : usersList.length === 0 ? (
            <div className="text-center py-4 text-muted">
              No registered customer profiles found.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Username</th>
                    <th>Email Address</th>
                    <th>Account Type</th>
                  </tr>
                </thead>
                <tbody>
                  {usersList.map((usr, idx) => (
                    <tr key={usr._id}>
                      <td>{idx + 1}</td>
                      <td className="fw-bold text-dark">{usr.username}</td>
                      <td>{usr.email}</td>
                      <td>
                        <Badge bg="secondary" className="text-uppercase">{usr.usertype}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUsersModal(false)} className="rounded-pill px-4">
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminDashboard;
