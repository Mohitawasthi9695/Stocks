import React, { useEffect, useState } from 'react';
import { Table, Button, Container, Row, Col } from 'react-bootstrap';
import { FaPlus, FaTrash } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const ProductCategory = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');

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
      toast.error('Error fetching categories');
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
      // Display confirmation modal
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#20B2AA',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      });

      if (result.isConfirmed) {
        // Attempt to delete category
        await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/products/category/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });

        // Update state on successful deletion
        setCategories(categories.filter((cat) => cat.id !== id));

        // Show success messages
        toast.success('Category deleted successfully');
        Swal.fire('Deleted!', 'The category has been deleted.', 'success');
      }
    } catch (error) {
      // Log error for debugging
      console.error('Error deleting category:', error);

      // Provide user feedback
      if (error.response?.data?.message) {
        toast.error(`Failed to delete category: ${error.response.data.message}`);
      } else {
        toast.error('An unexpected error occurred while deleting the category.');
      }

      // Display error notification
      Swal.fire('Error!', 'There was a problem deleting the category.', 'error');
    }
  };

  return (
    <Container fluid className="p-3">
      <div className="card shadow-sm border-0">
        {/* Header */}
        <div
          style={{
            backgroundColor: '#20B2AA',
            padding: '12px',
            borderTopLeftRadius: '4px',
            borderTopRightRadius: '4px'
          }}
        >
          <h4 className="text-white text-center m-0">Product Category</h4>
        </div>

        {/* Input Section */}
        <div className="px-3 py-3">
          <Row className="justify-content-center g-0">
            <Col xs={12} md={8} lg={6}>
              {/* <div className="d-flex">
                <input
                  type="text"
                  placeholder="Enter product category"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="form-control"
                  style={{
                    height: '38px',
                    borderRadius: '4px 0 0 4px'
                  }}
                />
                <Button
                  onClick={createCategory}
                  variant="success"
                  style={{
                    borderRadius: '0 4px 4px 0',
                    backgroundColor: '#20B2AA',
                    border: 'none',
                    height: '38px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                >
                  <FaPlus size={14} /> Add
                </Button>
              </div> */}
            </Col>
          </Row>
        </div>

        {/* Table Section */}
        <div className="px-3 pb-3">
          <Table hover bordered className="mb-0">
            <thead>
              <tr>
                <th
                  className="text-center"
                  style={{
                    backgroundColor: '#20B2AA',
                    color: 'white',
                    width: '80px',
                    padding: '10px'
                  }}
                >
                  ID
                </th>
                <th
                  className="text-center"
                  style={{
                    backgroundColor: '#20B2AA',
                    color: 'white',
                    padding: '10px'
                  }}
                >
                  Category Name
                </th>
                <th
                  className="text-center"
                  style={{
                    backgroundColor: '#20B2AA',
                    color: 'white',
                    width: '120px',
                    padding: '10px'
                  }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id}>
                  <td className="text-center align-middle">{category.id}</td>
                  <td className="text-center align-middle">{category.product_category}</td>
                  {/* <td className="text-center" style={{ padding: "6px" }}>
                    <Button
                      onClick={() => deleteCategory(category.id)}
                      variant="danger"
                      size="sm"
                      style={{
                        padding: '4px 8px',
                        fontSize: '14px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}
                    >
                      <FaTrash size={12} /> Delete
                    </Button>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </Container>
  );
};

export default ProductCategory;
