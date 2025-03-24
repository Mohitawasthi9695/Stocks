// import React, { useEffect, useState } from 'react';
// import { Table, Button, Container, Row, Col } from 'react-bootstrap';
// import { FaPlus, FaTrash } from 'react-icons/fa';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import Swal from 'sweetalert2';

// const ProductCategory = () => {
//   const [categories, setCategories] = useState([]);
//   const [newCategory, setNewCategory] = useState('');

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   const fetchCategories = async () => {
//     try {
//       const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/products/category`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('token')}`,
//           'Content-Type': 'application/json'
//         }
//       });
//       setCategories(response.data.data);
//     } catch (error) {
//       toast.error('Error fetching categories');
//     }
//   };

//   const createCategory = async () => {
//     if (!newCategory.trim()) {
//       toast.error('Please enter a category name');
//       return;
//     }

//     const result = await Swal.fire({
//       title: 'Are you sure?',
//       text: 'Do you want to create this category?',
//       icon: 'question',
//       showCancelButton: true,
//       confirmButtonColor: '#20B2AA',
//       cancelButtonColor: '#d33',
//       confirmButtonText: 'Yes, create it!'
//     });

//     if (!result.isConfirmed) {
//       return;
//     }

//     try {
//       const response = await axios.post(
//         `${import.meta.env.VITE_API_BASE_URL}/api/products/category`,
//         { product_category: newCategory },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`,
//             'Content-Type': 'application/json'
//           }
//         }
//       );
//       const newCat = response.data.data;
//       setCategories([...categories, newCat]);
//       setNewCategory('');
//       toast.success('Category created successfully!');
//       Swal.fire('Created!', 'The category has been added.', 'success');
//     } catch (error) {
//       toast.error('Error creating category');
//       Swal.fire('Error!', 'Failed to create the category.', 'error');
//     }
//   };

//   const deleteCategory = async (id) => {
//     try {
//       // Display confirmation modal
//       const result = await Swal.fire({
//         title: 'Are you sure?',
//         text: "You won't be able to revert this!",
//         icon: 'warning',
//         showCancelButton: true,
//         confirmButtonColor: '#20B2AA',
//         cancelButtonColor: '#d33',
//         confirmButtonText: 'Yes, delete it!'
//       });

//       if (result.isConfirmed) {
//         // Attempt to delete category
//         await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/products/category/${id}`, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`,
//             'Content-Type': 'application/json'
//           }
//         });

//         // Update state on successful deletion
//         setCategories(categories.filter((cat) => cat.id !== id));

//         // Show success messages
//         toast.success('Category deleted successfully');
//         Swal.fire('Deleted!', 'The category has been deleted.', 'success');
//       }
//     } catch (error) {
//       // Log error for debugging
//       console.error('Error deleting category:', error);

//       // Provide user feedback
//       if (error.response?.data?.message) {
//         toast.error(`Failed to delete category: ${error.response.data.message}`);
//       } else {
//         toast.error('An unexpected error occurred while deleting the category.');
//       }

//       // Display error notification
//       Swal.fire('Error!', 'There was a problem deleting the category.', 'error');
//     }
//   };

//   return (
//     <Container fluid className="p-3" style={{ border: '3px dashed #14ab7f', borderRadius: '8px', background: '#ff9d0014' }}>
//       <div className="card shadow-sm border-0 m-1 p-3">
//         {/* Header */}
//         <div
//           style={{
//             backgroundColor: '#20B2AA',
//             padding: '12px',
//             marginBottom: '20px',
//             borderTopLeftRadius: '4px',
//             borderTopRightRadius: '4px'
//           }}
//         >
//           <h3 className="text-white text-center m-0">Product Category</h3>
//         </div>
//         {/* Table Section */}
//         <div className="px-3 pb-3">
//           <Table hover bordered className="mb-0">
//             <thead>
//               <tr>
//                 <th
//                   className="text-center"
//                   style={{
//                     backgroundColor: '#888',
//                     color: 'white',
//                     width: '80px',
//                     padding: '10px'
//                   }}
//                 >
//                   ID
//                 </th>
//                 <th
//                   className="text-center"
//                   style={{
//                     backgroundColor: '#888',
//                     color: 'white',
//                     padding: '10px'
//                   }}
//                 >
//                   Category Name
//                 </th>
                
//               </tr>
//             </thead>
//             <tbody>
//               {categories.map((category) => (
//                 <tr key={category.id}>
//                   <td className="text-center align-middle">{category.id}</td>
//                   <td className="text-center align-middle">{category.product_category}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </Table>
//         </div>
//       </div>
//     </Container>
//   );
// };

// export default ProductCategory;

import React, { useEffect, useState } from 'react';
import { Table, Button, Container, Form } from 'react-bootstrap';
import { FaTrash, FaEdit, FaSave } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const ProductCategory = () => {
  const [categories, setCategories] = useState([]);
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
        <div
          style={{
            backgroundColor: '#20B2AA',
            padding: '12px',
            marginBottom: '20px',
            borderTopLeftRadius: '4px',
            borderTopRightRadius: '4px'
          }}
        >
          <h3 className="text-white text-center m-0">Product Category</h3>
        </div>
        <div className="table-responsive">
          <Table hover bordered className="mb-0">
            <thead>
              <tr>
                <th className="text-center" style={{ backgroundColor: '#888', color: 'white', width: '80px', padding: '10px' }}>
                  ID
                </th>
                <th className="text-center" style={{ backgroundColor: '#888', color: 'white', padding: '10px' }}>
                  Category Name
                </th>
                <th className="text-center" style={{ backgroundColor: '#888', color: 'white', padding: '10px' }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id || category._id}>
                  <td className="text-center align-middle">{category.id || category._id}</td>
                  <td className="text-center align-middle">
                    {editCategoryId === (category.id || category._id) ? (
                      <Form.Control
                        type="text"
                        value={updatedCategory}
                        onChange={(e) => setUpdatedCategory(e.target.value)}
                      />
                    ) : (
                      category.product_category
                    )}
                  </td>
                  <td className="text-center align-middle">
                    {editCategoryId === (category.id || category._id) ? (
                      <Button variant="success" size="sm" onClick={() => updateCategory(category.id || category._id)}>
                        <FaSave />
                      </Button>
                    ) : (
                      <Button variant="warning" size="sm" onClick={() => enableEdit(category.id || category._id, category.product_category)}>
                        <FaEdit />
                      </Button>
                    )}
                    &nbsp;
                    <Button variant="danger" size="sm" onClick={() => deleteCategory(category.id || category._id)}>
                      <FaTrash />
                    </Button>
                  </td>
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
