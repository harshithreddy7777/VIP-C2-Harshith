import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Container, Card, Form, Button, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext.jsx';
import { sanitizeImageUrl } from '../utils/imageSanitizer.js';

const AdminNewProduct = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { id } = useParams(); // populated if in edit mode (/admin/edit-product/:id)
  const isEditMode = !!id;

  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Form State
  const [form, setForm] = useState({
    title: '',
    description: '',
    mainImg: '',
    carouselInput: '', // comma separated values
    category: 'Fashion',
    gender: 'Unisex',
    price: '',
    discount: ''
  });

  // Size Checkbox selections
  const [selectedSizes, setSelectedSizes] = useState({
    S: true,
    M: true,
    L: true,
    XL: true
  });

  // Route Guard
  useEffect(() => {
    if (!user || (user.usertype !== 'Admin' && user.usertype !== 'admin')) {
      navigate('/');
    }
  }, [user, navigate]);

  // Load product if in edit mode
  useEffect(() => {
    if (isEditMode) {
      const loadProductForEdit = async () => {
        setDataLoading(true);
        try {
          const res = await axios.get(`/api/products/${id}`);
          const p = res.data;
          
          setForm({
            title: p.title,
            description: p.description,
            mainImg: p.mainImg,
            carouselInput: p.carousel ? p.carousel.join(', ') : p.mainImg,
            category: p.category || 'Fashion',
            gender: p.gender || 'Unisex',
            price: p.price,
            discount: p.discount || '0'
          });

          // Match sizes
          const sizesMap = { S: false, M: false, L: false, XL: false };
          if (p.sizes) {
            p.sizes.forEach(sz => {
              if (sz in sizesMap || sz.toUpperCase() in sizesMap) {
                sizesMap[sz.toUpperCase()] = true;
              }
            });
            setSelectedSizes(sizesMap);
          }
        } catch (err) {
          console.error("Error loading product for edit:", err);
          setMessage({ type: 'danger', text: 'Error loading product details for edit.' });
        } finally {
          setDataLoading(false);
        }
      };
      loadProductForEdit();
    }
  }, [id, isEditMode]);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSizeCheckboxChange = (e) => {
    setSelectedSizes({ ...selectedSizes, [e.target.name]: e.target.checked });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    const { title, description, mainImg, carouselInput, category, gender, price, discount } = form;
    if (!title || !description || !mainImg || !price) {
      return setMessage({ type: 'danger', text: 'Please fill in all required fields (Name, Description, Thumbnail, Price)' });
    }

    const sanitizedMainImg = sanitizeImageUrl(mainImg);

    // Compile sizes array
    const sizesArray = Object.keys(selectedSizes).filter(sz => selectedSizes[sz]);
    if (sizesArray.length === 0) {
      sizesArray.push("One Size");
    }

    // Parse and sanitize carousel images
    const carouselArray = carouselInput
      ? carouselInput.split(',').map(img => sanitizeImageUrl(img.trim())).filter(Boolean)
      : [sanitizedMainImg];

    // Update form state with sanitized values so it updates in UI
    setForm(prev => ({
      ...prev,
      mainImg: sanitizedMainImg,
      carouselInput: carouselInput ? carouselArray.join(', ') : sanitizedMainImg
    }));

    const payload = {
      title,
      description,
      mainImg: sanitizedMainImg,
      carousel: carouselArray,
      sizes: sizesArray,
      category,
      gender,
      price: Number(price),
      discount: Number(discount) || 0
    };

    setLoading(true);
    try {
      if (isEditMode) {
        await axios.put(`/api/products/${id}`, payload);
        setMessage({ type: 'success', text: 'Product updated successfully!' });
      } else {
        await axios.post('/api/products', payload);
        setMessage({ type: 'success', text: 'Product added successfully!' });
        // Reset form
        setForm({
          title: '',
          description: '',
          mainImg: '',
          carouselInput: '',
          category: 'Fashion',
          gender: 'Unisex',
          price: '',
          discount: ''
        });
      }
      setTimeout(() => {
        navigate('/admin/products');
      }, 1000);
    } catch (err) {
      console.error("Submission failed:", err);
      setMessage({ type: 'danger', text: err.response?.data?.message || 'Error processing catalog request.' });
    } finally {
      setLoading(false);
    }
  };

  const categoryOptions = ["Fashion", "Electronics", "Mobiles", "Groceries", "Sports Equipments"];
  const genderOptions = ["Men", "Women", "Unisex"];

  if (dataLoading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2 text-muted">Retrieving catalog records...</p>
      </Container>
    );
  }

  return (
    <Container className="py-4 fade-in-section" style={{ maxWidth: '720px' }}>
      <Card className="border-0 shadow-sm p-4 bg-white rounded-3">
        <Card.Body>
          <div className="mb-4 text-center">
            <h4 className="fw-bold text-dark m-0">{isEditMode ? 'Update Product Catalog' : 'Add New Product'}</h4>
            <p className="text-muted small mt-1">
              {isEditMode ? 'Make corrections to active catalog elements.' : 'Specify details to release a new catalog product.'}
            </p>
          </div>

          {message.text && (
            <Alert variant={message.type} className="py-2 text-center small shadow-sm mb-4">
              {message.text}
            </Alert>
          )}

          <Form onSubmit={handleFormSubmit}>
            {/* Product Name */}
            <Form.Group className="mb-3" controlId="prod-title">
              <Form.Label className="small fw-semibold">Product Name *</Form.Label>
              <Form.Control
                type="text"
                name="title"
                required
                placeholder="e.g. iPhone 12"
                value={form.title}
                onChange={handleInputChange}
              />
            </Form.Group>

            {/* Product Description */}
            <Form.Group className="mb-3" controlId="prod-desc">
              <Form.Label className="small fw-semibold">Product Description *</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                rows={4}
                required
                placeholder="Provide a detailed overview of the product specifications..."
                value={form.description}
                onChange={handleInputChange}
              />
            </Form.Group>

            {/* Thumbnail URL */}
            <Form.Group className="mb-3" controlId="prod-mainImg">
              <Form.Label className="small fw-semibold">Thumbnail / Img URL *</Form.Label>
              <Form.Control
                type="text"
                name="mainImg"
                required
                placeholder="Paste main display image URL"
                value={form.mainImg}
                onChange={handleInputChange}
              />
            </Form.Group>

            {/* Carousel URLs */}
            <Form.Group className="mb-3" controlId="prod-carousel">
              <Form.Label className="small fw-semibold">Add Carousel Img URL(s)</Form.Label>
              <Form.Control
                type="text"
                name="carouselInput"
                placeholder="Comma separated image URLs (leaves blank to use main display image)"
                value={form.carouselInput}
                onChange={handleInputChange}
              />
              <Form.Text className="text-muted small">
                Separate multiple image links with commas.
              </Form.Text>
            </Form.Group>

            {/* Select options: category & gender */}
            <Row className="g-3 mb-3">
              <Col md={6}>
                <Form.Group controlId="prod-category">
                  <Form.Label className="small fw-semibold">Category Selection</Form.Label>
                  <Form.Select
                    name="category"
                    value={form.category}
                    onChange={handleInputChange}
                  >
                    {categoryOptions.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group controlId="prod-gender">
                  <Form.Label className="small fw-semibold">Gender Tag</Form.Label>
                  <Form.Select
                    name="gender"
                    value={form.gender}
                    onChange={handleInputChange}
                  >
                    {genderOptions.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            {/* Checkbox sizes selection */}
            <Form.Group className="mb-3">
              <Form.Label className="small fw-semibold d-block">Available Sizes</Form.Label>
              <div className="d-flex gap-4">
                {Object.keys(selectedSizes).map((sz) => (
                  <Form.Check
                    key={sz}
                    type="checkbox"
                    id={`size-check-${sz}`}
                    label={sz}
                    name={sz}
                    checked={selectedSizes[sz]}
                    onChange={handleSizeCheckboxChange}
                  />
                ))}
              </div>
            </Form.Group>

            {/* Pricing columns */}
            <Row className="g-3 mb-4">
              <Col md={6}>
                <Form.Group controlId="prod-price">
                  <Form.Label className="small fw-semibold">MRP Price (₹) *</Form.Label>
                  <Form.Control
                    type="number"
                    name="price"
                    required
                    min="1"
                    placeholder="Enter sales price after discount"
                    value={form.price}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group controlId="prod-discount">
                  <Form.Label className="small fw-semibold">Discount Amount (₹)</Form.Label>
                  <Form.Control
                    type="number"
                    name="discount"
                    min="0"
                    placeholder="e.g. 500"
                    value={form.discount}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Buttons */}
            <div className="d-flex gap-3 justify-content-end mt-4 pt-3 border-top">
              <Button as={Link} to="/admin/products" variant="light" className="px-4 py-2 rounded-pill">
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={loading} className="px-5 py-2 rounded-pill fw-bold shadow-sm">
                {loading ? <Spinner animation="border" size="sm" /> : isEditMode ? 'Save Product Changes' : 'Add Product'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AdminNewProduct;
