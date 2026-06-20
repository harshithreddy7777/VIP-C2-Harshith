import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Form, Spinner } from 'react-bootstrap';
import ProductCard from '../components/ProductCard.jsx';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [selectedSort, setSelectedSort] = useState('Popular');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedGenders, setSelectedGenders] = useState([]);
  
  const location = useLocation();
  const navigate = useNavigate();

  // Parse query params from URL
  const queryParams = new URLSearchParams(location.search);
  const searchParam = queryParams.get('search') || '';
  const categoryParam = queryParams.get('category') || '';

  // Handle Initial parameters
  useEffect(() => {
    if (categoryParam) {
      setSelectedCategories([categoryParam]);
    } else {
      setSelectedCategories([]);
    }
  }, [categoryParam]);

  // Fetch products whenever filters or search parameters change
  useEffect(() => {
    const fetchFilteredProducts = async () => {
      setLoading(true);
      try {
        let params = new URLSearchParams();
        
        if (selectedCategories.length > 0) {
          params.append('category', selectedCategories.join(','));
        }
        if (selectedGenders.length > 0) {
          params.append('gender', selectedGenders.join(','));
        }
        if (searchParam) {
          params.append('search', searchParam);
        }
        
        // Map sort labels to backend values
        let sortVal = 'popular';
        if (selectedSort === 'Price (Low to High)') sortVal = 'price-asc';
        if (selectedSort === 'Price (High to Low)') sortVal = 'price-desc';
        params.append('sort', sortVal);

        const res = await axios.get(`/api/products?${params.toString()}`);
        setProducts(res.data);
      } catch (error) {
        console.error("Error loading products catalog:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredProducts();
  }, [selectedCategories, selectedGenders, selectedSort, searchParam]);

  // Handler for category checkbox change
  const handleCategoryChange = (catName) => {
    if (selectedCategories.includes(catName)) {
      setSelectedCategories(selectedCategories.filter(c => c !== catName));
    } else {
      setSelectedCategories([...selectedCategories, catName]);
    }
  };

  // Handler for gender checkbox change
  const handleGenderChange = (genderName) => {
    if (selectedGenders.includes(genderName)) {
      setSelectedGenders(selectedGenders.filter(g => g !== genderName));
    } else {
      setSelectedGenders([...selectedGenders, genderName]);
    }
  };

  const categoriesList = ["Electronics", "Mobiles", "Fashion", "Groceries", "Sports Equipments"];
  const gendersList = ["Men", "Women", "Unisex"];

  return (
    <Container className="py-4 fade-in-section">
      <Row className="g-4">
        {/* Left Filter Sidebar (Screenshot 19) */}
        <Col lg={3} md={4} xs={12}>
          <div className="filter-sidebar">
            <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
              <h5 className="fw-bold m-0 text-dark">Filters</h5>
              {(selectedCategories.length > 0 || selectedGenders.length > 0 || selectedSort !== 'Popular') && (
                <button
                  className="btn btn-link btn-sm text-primary p-0 text-decoration-none fw-semibold"
                  onClick={() => {
                    setSelectedCategories([]);
                    setSelectedGenders([]);
                    setSelectedSort('Popular');
                    navigate('/products');
                  }}
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Sort by */}
            <div className="mb-4">
              <h6 className="fw-bold text-muted small text-uppercase mb-2" style={{ letterSpacing: '0.5px' }}>Sort By</h6>
              {['Popular', 'Price (Low to High)', 'Price (High to Low)'].map((option) => (
                <Form.Check
                  key={option}
                  type="radio"
                  id={`sort-${option}`}
                  label={option}
                  name="sort-option"
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
                  id={`cat-${cat}`}
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
                  id={`gender-${gender}`}
                  label={gender}
                  className="mb-1 small"
                  checked={selectedGenders.includes(gender)}
                  onChange={() => handleGenderChange(gender)}
                />
              ))}
            </div>
          </div>
        </Col>

        {/* Right Main Product Grid (Screenshot 19) */}
        <Col lg={9} md={8} xs={12}>
          <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
            <div>
              <h4 className="fw-bold text-dark m-0">All Products</h4>
              {searchParam && (
                <span className="text-muted small">
                  Showing results for "<span className="text-primary fw-medium">{searchParam}</span>"
                </span>
              )}
            </div>
            <div className="small text-muted fw-medium mt-2 mt-sm-0">
              {products.length} Products Found
            </div>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2 text-muted">Refreshing list...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-5 bg-white border rounded shadow-sm">
              <div className="fs-3 mb-2">🔍</div>
              <h5 className="fw-bold text-dark">No Products Found</h5>
              <p className="text-muted small mx-auto" style={{ maxWidth: '300px' }}>
                We couldn't find matches for your selection. Try clearing filters or searching for something else.
              </p>
            </div>
          ) : (
            <Row className="g-4">
              {products.map((prod) => (
                <Col key={prod._id} xs={12} sm={6} md={6} lg={4}>
                  <ProductCard product={prod} />
                </Col>
              ))}
            </Row>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ProductsPage;
