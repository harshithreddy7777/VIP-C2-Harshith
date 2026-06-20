import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import { CartContext } from '../context/CartContext.jsx';
import { Navbar as BNavbar, Nav, Container, Form, InputGroup, Button, Badge } from 'react-bootstrap';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cartCount } = useContext(CartContext);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/products');
    }
  };

  const handleLogoutClick = () => {
    logout();
    navigate('/login');
  };

  const isAdmin = user && (user.usertype === 'Admin' || user.usertype === 'admin');

  return (
    <BNavbar expand="lg" variant="dark" className="shopez-navbar py-3 sticky-top">
      <Container>
        <BNavbar.Brand as={Link} to="/" className="fw-bold fs-3 tracking-wide">
          ShopEZ
        </BNavbar.Brand>
        
        <BNavbar.Toggle aria-controls="shopez-nav-content" />
        
        <BNavbar.Collapse id="shopez-nav-content" className="justify-content-between">
          {/* Search bar in header */}
          <Form onSubmit={handleSearchSubmit} className="d-flex my-2 my-lg-0 mx-lg-4 flex-grow-1" style={{ maxWidth: '600px' }}>
            <InputGroup>
              <Form.Control
                type="search"
                placeholder="Search Electronics, Fashion, Mobiles, Groceries..."
                aria-label="Search"
                className="search-bar-input bg-white text-dark py-2 shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button type="submit" variant="light" className="search-bar-btn border shadow-sm px-3">
                🔍
              </Button>
            </InputGroup>
          </Form>

          {/* Nav links */}
          <Nav className="align-items-center gap-2 gap-lg-3">
            {isAdmin ? (
              // Admin-only Navigation Links (Screenshot 19)
              <>
                <Nav.Link as={Link} to="/admin" className="text-white fw-medium">Admin Dashboard</Nav.Link>
                <Nav.Link as={Link} to="/admin/orders" className="text-white fw-medium">All Orders</Nav.Link>
                <Nav.Link as={Link} to="/admin/products" className="text-white fw-medium">All Products</Nav.Link>
                <Nav.Link as={Link} to="/admin/new-product" className="text-white fw-medium bg-white text-primary px-3 py-1.5 rounded-pill shadow-sm">
                  Add New
                </Nav.Link>
                <Button variant="outline-light" size="sm" onClick={handleLogoutClick} className="rounded-pill px-3 shadow-sm">
                  Logout
                </Button>
              </>
            ) : (
              // General / Customer Navigation Links
              <>
                <Nav.Link as={Link} to="/" className="text-white fw-medium">Home</Nav.Link>
                <Nav.Link as={Link} to="/products" className="text-white fw-medium">Products</Nav.Link>
                <Nav.Link as={Link} to="/cart" className="text-white position-relative d-flex align-items-center gap-1">
                  <span>Cart🛒</span>
                  {cartCount > 0 && (
                    <Badge pill bg="danger" className="align-self-start shadow-sm" style={{ fontSize: '0.7rem' }}>
                      {cartCount}
                    </Badge>
                  )}
                </Nav.Link>
                {user ? (
                  <>
                    <Nav.Link as={Link} to="/profile" className="text-white fw-medium d-flex align-items-center gap-1">
                      <span>👤 {user.username}</span>
                    </Nav.Link>
                    <Button variant="outline-light" size="sm" onClick={handleLogoutClick} className="rounded-pill px-3 shadow-sm ms-2">
                      Logout
                    </Button>
                  </>
                ) : (
                  <Button as={Link} to="/login" variant="light" className="text-primary rounded-pill px-4 shadow-sm fw-medium ms-2">
                    Login
                  </Button>
                )}
              </>
            )}
          </Nav>
        </BNavbar.Collapse>
      </Container>
    </BNavbar>
  );
};

export default Navbar;
