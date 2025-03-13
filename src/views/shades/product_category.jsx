import React, { useEffect, useState } from 'react';
import { Table, Button, Container, Form, Row, Col } from 'react-bootstrap';
import { FaTrash, FaEdit, FaSave, FaPlus } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const ProductCategory = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [updatedCategory, setUpdatedCategory] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/products/category`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      setCategories(response.data.data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error fetching categories');
    }
  };

  const createCategory = async () => {
    if (!newCategory.trim()) {
      toast.error('Please enter a category name');
      return;
    }

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to create this category?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#20B2AA',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, create it!'
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/products/category`,
        { product_category: newCategory },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );
      const newCat = response.data.data;
      setCategories([...categories, newCat]);
      setNewCategory('');
      toast.success('Category created successfully!');
      Swal.fire('Created!', 'The category has been added.', 'success');
    } catch (error) {
      toast.error('Error creating category');
      Swal.fire('Error!', 'Failed to create the category.', 'error');
    }
  };

  const deleteCategory = async (id) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#20B2AA',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      });

      if (!result.isConfirmed) return;

      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/products/category/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      setCategories(categories.filter((cat) => (cat.id || cat._id) !== id));
      toast.success('Category deleted successfully');
      Swal.fire('Deleted!', 'The category has been deleted.', 'success');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error deleting category');
      Swal.fire('Error!', 'There was a problem deleting the category.', 'error');
    }
  };

  const enableEdit = (id, currentCategory) => {
    setEditCategoryId(id);
    setUpdatedCategory(currentCategory);
  };

  const updateCategory = async (id) => {
    if (!updatedCategory.trim()) {
      toast.error('Category name cannot be empty!');
      return;
    }

    try {
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/products/category/${id}`,
        { product_category: updatedCategory },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setCategories(
        categories.map((cat) =>
          (cat.id || cat._id) === id ? { ...cat, product_category: updatedCategory } : cat
        )
      );

      toast.success('Category updated successfully!');
      setEditCategoryId(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error updating category');
    }
  };

  return (
    <Container fluid className="p-3" style={{ border: '3px dashed #14ab7f', borderRadius: '8px', background: '#ff9d0014' }}>
      <div className="card shadow-sm border-0 m-1 p-3">
        <h3 className="text-center" style={{ backgroundColor: '#20B2AA', color: 'white', padding: '12px', borderRadius: '4px' }}>Product Category</h3>
        <Row className="justify-content-center">
          <Col xs={12} md={8} lg={6} className="d-flex">
            <Form.Control
              type="text"
              placeholder="Enter product category"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="form-control"
            />
            <Button onClick={createCategory} variant="success" className="ms-2">
              <FaPlus /> Add
            </Button>
          </Col>
        </Row>
        <Table striped bordered hover className="mt-3">
          <thead>
            <tr>
              <th>ID</th>
              <th>Category Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id || category._id}>
                <td>{category.id || category._id}</td>
                <td>{editCategoryId === (category.id || category._id) ? <Form.Control value={updatedCategory} onChange={(e) => setUpdatedCategory(e.target.value)} /> : category.product_category}</td>
                <td>
                  <Button onClick={() => enableEdit(category.id || category._id, category.product_category)} variant="warning"><FaEdit /></Button>
                  <Button onClick={() => deleteCategory(category.id || category._id)} variant="danger" className="ms-2"><FaTrash /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </Container>
  );
};

export default ProductCategory;