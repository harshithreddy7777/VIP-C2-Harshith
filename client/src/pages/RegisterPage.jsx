import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import { Form, Button, Card, Container, Alert, Spinner } from 'react-bootstrap';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [usertype, setUsertype] = useState('Customer'); // Default role matching Register dropdown
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!username || !email || !password || !usertype) {
      return setError('Please fill in all input fields');
    }

    if (password.length < 6) {
      return setError('Password must be at least 6 characters long');
    }

    setLoading(true);
    const result = await register(username, email, password, usertype);
    setLoading(false);

    if (result.success) {
      setSuccess('Account created successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } else {
      setError(result.message);
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center py-5 fade-in-section" style={{ minHeight: '80vh' }}>
      <Card className="glass-card shadow border-0 p-4" style={{ width: '100%', maxWidth: '420px' }}>
        <Card.Body>
          <div className="text-center mb-4">
            <h2 className="fw-bold text-primary">Register</h2>
            <p className="text-muted">Create your ShopEZ account below</p>
          </div>

          {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}
          {success && <Alert variant="success" className="py-2 small">{success}</Alert>}

          <Form onSubmit={handleRegisterSubmit}>
            <Form.Group className="mb-3" controlId="reg-username">
              <Form.Label className="small fw-semibold">Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Username"
                className="py-2 rounded-3 border-secondary-subtle"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="reg-email">
              <Form.Label className="small fw-semibold">Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Email address"
                className="py-2 rounded-3 border-secondary-subtle"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="reg-password">
              <Form.Label className="small fw-semibold">Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                className="py-2 rounded-3 border-secondary-subtle"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-4" controlId="reg-usertype">
              <Form.Label className="small fw-semibold">User Type</Form.Label>
              <Form.Select
                className="py-2 rounded-3 border-secondary-subtle"
                value={usertype}
                onChange={(e) => setUsertype(e.target.value)}
              >
                <option value="Customer">Customer</option>
                <option value="Admin">Admin</option>
              </Form.Select>
            </Form.Group>

            <Button
              type="submit"
              disabled={loading}
              variant="primary"
              className="w-100 py-2.5 rounded-pill fw-bold shadow-sm mb-3"
            >
              {loading ? <Spinner animation="border" size="sm" /> : 'Register'}
            </Button>
          </Form>

          <div className="text-center mt-3">
            <span className="text-muted small">Already registered? </span>
            <Link to="/login" className="text-primary small fw-semibold text-decoration-none">
              Login
            </Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default RegisterPage;
