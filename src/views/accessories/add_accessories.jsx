import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import FormField from '../../components/FormField';
import { FaUser, FaIdCard } from 'react-icons/fa';

const AddAccessory = () => {
  const [formData, setFormData] = useState({
    product_category_id: '',
    accessory_name: ''
  });

  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/products/category`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data && response.data.data) {
        setCategories(response.data.data);
      } else {
        toast.error('Categories data is not in the expected format');
      }
    } catch (error) {
      toast.error('Error fetching categories');
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log('Submitting data:', formData); // Debugging log

      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/accessory`, formData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      toast.success('Accessory added successfully');
      navigate('/accessories_record');
    } catch (error) {
      console.error('Error adding accessory:', error);
      toast.error(error.response?.data?.message || 'Error adding accessory');
    }
  };

  return (
    <Container fluid className="pt-4 px-5" style={{ border: '3px dashed #14ab7f', borderRadius: '8px', background: '#ff9d0014' }}>
      <Row className="justify-content-center">
        <Col md={12} lg={12}>
          <Card className="shadow-lg border-0" style={{ borderRadius: '15px', overflow: 'hidden' }}>
            <div className="p-4 text-white text-center" style={{ backgroundColor: '#20B2AA' }}>
              <h2 className="m-0 text-white">Add New Accessory</h2>
            </div>
            <Card.Body className="p-5">
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group controlId="product_category_id">
                      <Form.Label>
                        <FaIdCard className="me-2" /> Product Category
                      </Form.Label>
                      <Form.Select name="product_category_id" value={formData.product_category_id} onChange={handleChange} >
                        <option value="">Select a Category</option>
                        {categories.length > 0 ? (
                          categories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.product_category}
                            </option>
                          ))
                        ) : (
                          <option disabled>Loading categories...</option>
                        )}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col>
                  <FormField
                      icon={FaUser}
                      label="Accessory Name"
                      name="accessory_name"
                      value={formData.accessory_name}
                      onChange={handleChange}
                    />
                  </Col>
                </Row>

                {/* Submit Button */}
                <Button variant="primary" type="submit" className="mt-4 d-block m-auto" style={{ width: '10rem' }}>
                  Add Accessory
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AddAccessory;
