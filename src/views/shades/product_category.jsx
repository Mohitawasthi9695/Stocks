import React, { useEffect, useState } from 'react';
import { Table, Button, Container, Row, Col } from 'react-bootstrap';
import { FaPlus, FaTrash } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';

const ProductCategory = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch product categories from the API
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/products/category`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });
      setCategories(response.data.data);
    } catch (error) {
      toast.error('Error fetching categories');
    }
  };

  // Create a new product category
  const createCategory = async () => {
    if (!newCategory.trim()) {
      toast.error('Please enter a category name');
      return;
    }
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/products/category`,
        { product_category: newCategory },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // Add the new category to the state
      const newCat = response.data.data; // Ensure this matches the API response structure
      setCategories([...categories, newCat]);

      setNewCategory(''); // Clear the input field
      toast.success('Category created successfully!');
    } catch (error) {
      toast.error('Error creating category');
    }
  };

  
  const deleteCategory = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/products/category/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });
      setCategories(categories.filter((cat) => cat.id !== id));
      toast.success('Category deleted successfully!');
    } catch (error) {
      toast.error('Error deleting category');
    }
  };

  return (
    <Container fluid className="pt-4 px-2" style={{ border: '3px dashed #14ab7f', borderRadius: '8px', background: '#ff9d0014' }}>
      <Row>
        <Col md={12} lg={12} className="mt-3">
          <div
            className="card shadow-lg border-0 rounded-lg"
            style={{ margin: '50px' }}
          >
            <h3
              className="text-center mb-4"
              style={{
                backgroundColor: 'rgb(32, 178, 170)',
                padding: '20px',
                borderTopLeftRadius: '10px',
                borderTopRightRadius: '10px',
                marginTop: '-5px',
                color: 'white',
              }}
            >
              Product Category
            </h3>
            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  width: '100%',
                }}
              >
                <div style={{ display: 'flex', marginBottom: '20px', width: '200px', padding: '20px' }}>
                  <input
                    placeholder="Enter product category"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    style={{ padding: '8px', marginRight: '10px', height: '45px', borderRadius: '10px' }}
                  />
                  <Button onClick={createCategory} variant="success" style={{ height: '45px' }}>
                    Submit
                  </Button>
                </div>

                <Table striped bordered hover style={{ width: '50%', margin: '25px' }}>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Product Category</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((category) => (
                      <tr key={category.id}>
                        <td>{category.id}</td>
                        <td>{category.product_category}</td>
                        <td>
                          <Button onClick={() => deleteCategory(category.id)} variant="danger">
                            <FaTrash /> Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductCategory;
