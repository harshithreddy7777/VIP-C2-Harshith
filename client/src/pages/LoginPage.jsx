import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import { Form, Button, Card, Container, Alert, Spinner } from 'react-bootstrap';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      return setError('Please fill in all fields');
    }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      // Check user role to redirect appropriately
      // Since AuthContext handles state, let's load it and redirect
      // Wait, we can fetch profile details in AuthContext or just check user roles
      // To ensure user is populated before navigate, let's wait a brief moment or navigate directly
      // Since login returns success, we can redirect to '/' which will load route guard
      navigate('/');
    } else {
      setError(result.message);
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center py-5 fade-in-section" style={{ minHeight: '80vh' }}>
      <Card className="glass-card shadow border-0 p-4" style={{ width: '100%', maxWidth: '420px' }}>
        <Card.Body>
          <div className="text-center mb-4">
            <h2 className="fw-bold text-primary">ShopEZ</h2>
            <p className="text-muted">Welcome back! Please enter your details.</p>
          </div>

          {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}

          <Form onSubmit={handleLoginSubmit}>
            <Form.Group className="mb-3" controlId="login-email">
              <Form.Label className="small fw-semibold">Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="enter your email"
                className="py-2 rounded-3 border-secondary-subtle"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-4" controlId="login-password">
              <Form.Label className="small fw-semibold">Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="••••••••"
                className="py-2 rounded-3 border-secondary-subtle"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="w-100 py-2.5 rounded-pill fw-bold shadow-sm mb-3"
            >
              {loading ? <Spinner animation="border" size="sm" /> : 'Log In'}
            </Button>
          </Form>

          <div className="text-center mt-3">
            <span className="text-muted small">Don't have an account? </span>
            <Link to="/register" className="text-primary small fw-semibold text-decoration-none">
              Register here
            </Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default LoginPage;
