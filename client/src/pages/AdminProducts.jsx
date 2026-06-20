import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Card, Button, Spinner, Alert, Form } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext.jsx';

const AdminProducts = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filter sidebar states
  const [selectedSort, setSelectedSort] = useState('Popular');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedGenders, setSelectedGenders] = useState([]);

  // Route guard
  useEffect(() => {
    if (!user || (user.usertype !== 'Admin' && user.usertype !== 'admin')) {
      navigate('/');
    }
  }, [user, navigate]);

  const loadAllProducts = async () => {
    setLoading(true);
    try {
      let params = new URLSearchParams();
      if (selectedCategories.length > 0) {
        params.append('category', selectedCategories.join(','));
      }
      if (selectedGenders.length > 0) {
        params.append('gender', selectedGenders.join(','));
      }
      
      let sortVal = 'popular';
      if (selectedSort === 'Price (Low to High)') sortVal = 'price-asc';
      if (selectedSort === 'Price (High to Low)') sortVal = 'price-desc';
      params.append('sort', sortVal);

      const res = await axios.get(`/api/products?${params.toString()}`);
      setProducts(res.data);
    } catch (err) {
      console.error("Error loading products:", err);
      setError("Failed to fetch product records from server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllProducts();
  }, [selectedCategories, selectedGenders, selectedSort]);

  const handleDeleteProductClick = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
      try {
        await axios.delete(`/api/products/${productId}`);
        alert("Product deleted successfully!");
        await loadAllProducts();
      } catch (err) {
        console.error("Delete error:", err);
        alert(err.response?.data?.message || "Failed to delete product");
      }
    }
  };

  const handleCategoryChange = (catName) => {
    if (selectedCategories.includes(catName)) {
      setSelectedCategories(selectedCategories.filter(c => c !== catName));
    } else {
      setSelectedCategories([...selectedCategories, catName]);
    }
  };

  const handleGenderChange = (genderName) => {
    if (selectedGenders.includes(genderName)) {
      setSelectedGenders(selectedGenders.filter(g => g !== genderName));
    } else {
      setSelectedGenders([...selectedGenders, genderName]);
    }
  };

  const categoriesList = ["Electronics", "Mobiles", "Fashion", "Groceries", "Sports Equipments"];
  const gendersList = ["Men", "Women", "Unisex"];

  if (loading && products.length === 0) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2 text-muted">Loading product records...</p>
      </Container>
    );
  }

  return (
    <Container className="py-4 fade-in-section">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold text-dark m-0">Catalog Products (Admin)</h4>
          <p className="text-muted small m-0">View all items, edit features, or delete products.</p>
        </div>
        <Button as={Link} to="/admin/new-product" variant="primary" className="rounded-pill px-4 shadow-sm fw-medium">
          + Add New Product
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Row className="g-4">
        {/* Left Filter Sidebar */}
        <Col lg={3} md={4} xs={12}>
          <div className="filter-sidebar">
            <h6 className="fw-bold text-dark border-bottom pb-2 mb-3">Filter Options</h6>

            {/* Sort by */}
            <div className="mb-4">
              <h6 className="fw-bold text-muted small text-uppercase mb-2" style={{ letterSpacing: '0.5px' }}>Sort By</h6>
              {['Popular', 'Price (Low to High)', 'Price (High to Low)'].map((option) => (
                <Form.Check
                  key={option}
                  type="radio"
                  id={`admin-sort-${option}`}
                  label={option}
                  name="admin-sort-option"
                  className="mb-1 small"
                  checked={selectedSort === option}
                  onChange={() => setSelectedSort(option)}
                />
              ))}
            </div>

            {/* Categories */}
            <div className="mb-4">
              <h6 className="fw-bold text-muted small text-uppercase mb-2" style={{ letterSpacing: '0.5px' }}>Categories</h6>
              {categoriesList.map((cat) => (
                <Form.Check
                  key={cat}
                  type="checkbox"
                  id={`admin-cat-${cat}`}
                  label={cat}
                  className="mb-1 small"
                  checked={selectedCategories.includes(cat)}
                  onChange={() => handleCategoryChange(cat)}
                />
              ))}
            </div>

            {/* Gender */}
            <div>
              <h6 className="fw-bold text-muted small text-uppercase mb-2" style={{ letterSpacing: '0.5px' }}>Gender</h6>
              {gendersList.map((gender) => (
                <Form.Check
                  key={gender}
                  type="checkbox"
                  id={`admin-gender-${gender}`}
                  label={gender}
                  className="mb-1 small"
                  checked={selectedGenders.includes(gender)}
                  onChange={() => handleGenderChange(gender)}
                />
              ))}
            </div>
          </div>
        </Col>

        {/* Right Main Grid */}
        <Col lg={9} md={8} xs={12}>
          {products.length === 0 ? (
            <div className="text-center py-5 bg-white border rounded shadow-sm">
              <h5 className="fw-bold text-dark">No Products Found</h5>
              <p className="text-muted small">Try clearing filters or adding products to the catalog.</p>
            </div>
          ) : (
            <Row className="g-4">
              {products.map((prod) => {
                const discountPercentage = prod.discount > 0 ? Math.round((prod.discount / (prod.price + prod.discount)) * 100) : 0;
                return (
                  <Col key={prod._id} xs={12} sm={6} md={6} lg={4}>
                    <Card className="product-card-custom h-100 border-0 shadow-sm">
                      <div className="product-card-img-wrapper">
                        {prod.discount > 0 && (
                          <span className="discount-badge">{discountPercentage}% OFF</span>
                        )}
                        <Card.Img
                          variant="top"
                          src={prod.mainImg}
                          className="product-card-img"
                          style={{ height: '170px', objectFit: 'cover' }}
                        />
                      </div>
                      <Card.Body className="d-flex flex-column justify-content-between p-3">
                        <div>
                          <span className="text-uppercase text-muted fw-bold" style={{ fontSize: '0.7rem' }}>
                            {prod.category} ({prod.gender})
                          </span>
                          <Card.Title className="fs-6 fw-bold mt-1 text-truncate" title={prod.title}>
                            {prod.title}
                          </Card.Title>
                          <div className="d-flex align-items-baseline gap-2 mb-3">
                            <span className="fw-bold text-primary">₹ {prod.price}</span>
                            {prod.discount > 0 && (
                              <span className="text-muted text-decoration-line-through small" style={{ fontSize: '0.75rem' }}>
                                ₹ {prod.price + prod.discount}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="d-flex gap-2">
                          <Button
                            as={Link}
                            to={`/admin/edit-product/${prod._id}`}
                            variant="warning"
                            size="sm"
                            className="flex-grow-1 text-dark rounded-pill fw-bold"
                          >
                            Update
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            className="rounded-circle px-2"
                            onClick={() => handleDeleteProductClick(prod._id)}
                          >
                            🗑️
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default AdminProducts;
