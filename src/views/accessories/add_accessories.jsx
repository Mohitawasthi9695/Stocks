import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import FormField from '../../components/FormField';
import { FaUser, FaFileExcel, FaDownload, FaUpload, FaIdCard } from 'react-icons/fa';

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

  const [file, setFile] = useState(null);
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const fileExtension = selectedFile.name.split('.').pop().toLowerCase();
      if (!['xls', 'xlsx', 'csv'].includes(fileExtension)) {
        toast.error('Unsupported file format. Please upload an .xls or .xlsx file.');
        setFile(null);
      } else {
        setFile(selectedFile);
      }
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      toast.error('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('csv_file', file);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/accessory/import-excel`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      if (response.status === 201) {
        toast.success('Stock added successfully');
        setFile(null);
        navigate('/shades');
      }
    } catch (error) {
      console.error(error);
      const errorMessage = error.response?.data?.error || 'Error adding stock';
      toast.error(errorMessage);
    }
  };
  return (
    <Container fluid className="pt-4 px-5" style={{ border: '3px dashed #14ab7f', borderRadius: '8px', background: '#ff9d0014' }}>
      <Row className="justify-content-center">
        <h2 className="text-center mb-4 fw-bold text-primary">Product Accessory</h2>

        <div
          className="card shadow-lg border-0 mb-4 mx-auto"
          style={{ borderRadius: '12px', maxWidth: '700px' }}
        >
          <div className="card-body p-4 mx-auto">
            <div className="d-flex flex-column align-items-center">
            <h4 className="text-center fw-bold  mb-4 ">Excel Upload</h4>
              <form onSubmit={handleFileUpload} encType="multipart/form-data" className="w-100">
                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <label
                      htmlFor="excel"
                      className="form-label text-secondary fw-semibold"
                      style={{ fontSize: '0.95rem' }}
                    >
                      Choose File
                    </label>
                    <div className="d-flex align-items-center gap-2">
                      <FaFileExcel className="text-success fs-4" />
                      <a href="/products.csv" download className="text-decoration-none">
                        <FaDownload className="text-success fs-5" style={{ cursor: 'pointer' }} />
                      </a>
                    </div>
                  </div>

                  <div className="input-group">
                    <input
                      type="file"
                      className="form-control form-control-sm rounded-start"
                      name="excel"
                      id="excel"
                      onChange={handleFileChange}
                      style={{ fontSize: '0.9rem' }}
                    />
                    <button
                      type="submit"
                      className="btn btn-success d-flex align-items-center gap-2 px-3"
                      style={{ fontSize: '0.85rem' }}
                    >
                      <FaUpload />
                      Upload
                    </button>
                  </div>
                  <small className="form-text text-muted" style={{ fontSize: '0.8rem' }}>
                    Supported formats: <strong>.xls, .xlsx, .csv</strong>
                  </small>
                </div>
              </form>
            </div>
          </div>
        </div>


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
