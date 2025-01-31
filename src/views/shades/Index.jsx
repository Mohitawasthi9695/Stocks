// import React, { useEffect, useState } from 'react';
// import DataTable from 'react-data-table-component';
// import { Button, Modal, Form } from 'react-bootstrap';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { MdEdit, MdDelete, MdPersonAdd } from 'react-icons/md';
// import { toast } from 'react-toastify';
// import Skeleton from 'react-loading-skeleton';
// import 'react-loading-skeleton/dist/skeleton.css';
// import Swal from 'sweetalert2';

// import Papa from 'papaparse';
// import { saveAs } from 'file-saver';
// import jsPDF from 'jspdf';
// import 'jspdf-autotable';
// import { FaFileCsv } from 'react-icons/fa';
// import { AiOutlineFilePdf } from 'react-icons/ai';

// const ProductsPage = () => {
//   const [products, setProducts] = useState([]);
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [selectedProduct, setSelectedProduct] = useState(null);

//   const handleToggleStatus = async (productId, currentStatus) => {
//     try {
//       const updatedStatus = currentStatus === 1 ? 0 : 1; // Toggle status
  
//       // Make the API call to update status
//       await axios.put(
//         `${import.meta.env.VITE_API_BASE_URL}/api/products/${productId}`,
//         { status: updatedStatus },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`,
//             'Content-Type': 'application/json'
//           }
//         }
//       );
  
//       toast.success('Status updated successfully!');
  
//       // Update state for both Products and filteredProducts
//       setProducts((prevProducts) =>
//         prevProducts.map((product) =>
//           product.id === productId ? { ...product, status: updatedStatus } : product
//         )
//       );
  
//       setFilteredProducts((prevFilteredProducts) =>
//         prevFilteredProducts.map((product) =>
//           product.id === productId ? { ...product, status: updatedStatus } : product
//         )
//       );
//     } catch (error) {
//       toast.error('Failed to update status!');
//       console.error(error);
//     }
//   };
  
//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/products`, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`,
//             'Content-Type': 'application/json'
//           }
//         });
//         setProducts(response.data.data);
//         setFilteredProducts(response.data.data);
//       } catch (error) {
//         console.error('Error fetching products:', error);
//       }
//     };
//     fetchProducts();
//   }, []);

//   useEffect(() => {
//     const lowercasedQuery = searchQuery.toLowerCase();
//     const filtered = products.filter((product) => {
//       return (
//         product.name.toLowerCase().includes(lowercasedQuery) ||
//         product.shadeNo.toLowerCase().includes(lowercasedQuery) ||
//         product.code.toLowerCase().includes(lowercasedQuery) ||
//         product.purchase_shade_no.toLowerCase().includes(lowercasedQuery)
//       );
//     });
//     setFilteredProducts(filtered);
//   }, [searchQuery, products]);

//   const handleSearch = (e) => {
//     setSearchQuery(e.target.value);
//   };

//   const navigate = useNavigate();

//   const columns = [
//     {
//       name: 'Sr No',
//       selector: (_, index) => index + 1,
//       sortable: true
//     },
//     {
//       name: 'Shade No',
//       selector: (row) => row.shadeNo,
//       sortable: true
//     },
//     {
//       name: 'Code',
//       selector: (row) => row.code,
//       sortable: true
//     },
//     {
//       name: 'Purchase Shade No',
//       selector: (row) => row.purchase_shade_no,
//       sortable: true
//     },
//     {
//       name: 'Status',
//       selector: (row) => (row.status === 1 ? 'inactive' : 'active'),
//       sortable: true,
//       cell: (row) => (
//         <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
//           {/* Toggle Switch */}
//           <label style={{ position: 'relative', display: 'inline-block', width: '34px', height: '20px' , marginBottom:'0'}}>
//             <input
//               type="checkbox"
//               checked={row.status === 0} // Active if 0
//               onChange={() => handleToggleStatus(row.id, row.status)}
//               style={{ opacity: 0, width: 0, height: 0 }}
//             />
//             <span
//               style={{
//                 position: 'absolute',
//                 cursor: 'pointer',
//                 top: 0,
//                 left: 0,
//                 right: 0,
//                 bottom: 0,
//                 backgroundColor: row.status === 0 ? '#4caf50' : '#ccc',
//                 transition: '0.4s',
//                 borderRadius: '20px',
//               }}
//             ></span>
//             <span
//               style={{
//                 position: 'absolute',
//                 content: '',
//                 height: '14px',
//                 width: '14px',
//                 left: row.status === 0 ? '18px' : '3px',
//                 bottom: '3px',
//                 backgroundColor: 'white',
//                 transition: '0.4s',
//                 borderRadius: '50%',
//               }}
//             ></span>
//           </label>
      
//           {/* Status Badge */}
//           <span
//             className={`badge ${row.status === 0 ? 'bg-success' : 'bg-danger'}`}
//             style={{
//               padding: '5px 10px',
//               borderRadius: '8px',
//               whiteSpace: 'nowrap', // Prevents text wrapping
//             }}
//           >
//             {row.status === 0 ? 'Active' : 'Inactive'}
//           </span>
//         </div>
//       )
//     },
//     {
//       name: 'Action',
//       cell: (row) => (
//         <div className="d-flex">
//           <Button variant="outline-success" size="sm" className="me-2" onClick={() => handleEdit(row)}>
//             <MdEdit />
//           </Button>
//           <Button variant="outline-danger" size="sm" onClick={() => handleDelete(row.id)}>
//             <MdDelete />
//           </Button>
//         </div>
//       )
//     }
//   ];

//   const handleDelete = async (productId) => {
//     try {
//       // Display confirmation modal
//       const result = await Swal.fire({
//         title: 'Are you sure?',
//         text: "You won't be able to revert this!",
//         icon: 'warning',
//         showCancelButton: true,
//         confirmButtonColor: '#3085d6',
//         cancelButtonColor: '#d33',
//         confirmButtonText: 'Yes, delete it!'
//       });
  
//       if (result.isConfirmed) {
//         // Attempt to delete product
//         await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/products/${productId}`, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`
//           }
//         });
  
//         // Update state on successful deletion
//         setProducts((prevProducts) => prevProducts.filter((product) => product.id !== productId));
//         setFilteredProducts((prevFilteredProducts) => prevFilteredProducts.filter((product) => product.id !== productId));
  
//         toast.success('Product deleted successfully');
//         Swal.fire('Deleted!', 'The product has been deleted.', 'success');
//       }
//     } catch (error) {
//       // Log error for debugging and notify user
//       console.error('Error deleting product:', error);
  
//       // Provide user feedback
//       if (error.response && error.response.data && error.response.data.message) {
//         toast.error(`Failed to delete product: ${error.response.data.message}`);
//       } else {
//         toast.error('An unexpected error occurred while deleting the product.');
//       }
  
//       // Display error notification in confirmation dialog
//       Swal.fire('Error!', 'There was a problem deleting the product.', 'error');
//     }
//   };
  


//   const handleEdit = (product) => {
//     setSelectedProduct(product);
//     setShowEditModal(true);
//   };

//   const handleUpdateProduct = async () => {
//     try {
//       if (!selectedProduct || !selectedProduct.id) {
//         toast.error('Invalid product selected for update!');
//         return;
//       }

//       const response = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/products/${selectedProduct.id}`, selectedProduct, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('token')}`,
//           'Content-Type': 'application/json'
//         }
//       });

//       if (response.status === 200) {
//         toast.success('Product updated successfully!');
//         setProducts((prev) => prev.map((prod) => (prod.id === selectedProduct.id ? selectedProduct : prod)));
//         setFilteredProducts((prev) => prev.map((prod) => (prod.id === selectedProduct.id ? selectedProduct : prod)));
//         setShowEditModal(false);
//       } else {
//         throw new Error('Unexpected response status');
//       }
//     } catch (error) {
//       console.error('Error during update:', error);
//       toast.error('Error updating product!');
//     }
//   };

//   const handleAddProduct = () => {
//     navigate('/add-shades');
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setSelectedProduct((prevProduct) => ({
//       ...prevProduct,
//       [name]: value
//     }));
//   };

//   const customStyles = {
//     table: {
//       style: {
//         borderCollapse: 'separate', // Ensures border styles are separate
//         borderSpacing: 0, // Removes spacing between cells
//       },
//     },
//     header: {
//       style: {
//         backgroundColor: '#2E8B57',
//         color: '#fff',
//         fontSize: '18px',
//         fontWeight: 'bold',
//         padding: '15px',
//         borderRadius: '8px 8px 0 0', // Adjusted to only affect top corners
//       },
//     },
//     rows: {
//       style: {
//         backgroundColor: '#f0fff4',
//         borderBottom: '1px solid #e0e0e0',
//         transition: 'background-color 0.3s ease',
//         '&:hover': {
//           backgroundColor: '#e6f4ea',
//           boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
//         },
//       },
//     },
//     headCells: {
//       style: {
//         backgroundColor: '#20B2AA',
//         color: '#fff',
//         fontSize: '12px',
//         fontWeight: 'bold',
//         textTransform: 'uppercase',
//         padding: '15px',
//         borderRight: '1px solid #e0e0e0', // Vertical lines between header cells
//       },
//       lastCell: {
//         style: {
//           borderRight: 'none', // Removes border for the last cell
//         },
//       },
//     },
//     cells: {
//       style: {
//         fontSize: '14px',
//         color: '#333',
//         padding: '12px',
//         borderRight: '1px solid grey', // Vertical lines between cells
//       },
//     },
//     pagination: {
//       style: {
//         backgroundColor: '#3f4d67',
//         color: '#fff',
//         borderRadius: '0 0 8px 8px',
//       },
//       pageButtonsStyle: {
//         backgroundColor: 'transparent',
//         color: 'black', // Makes the arrows white
//         border: 'none',
//         '&:hover': {
//           backgroundColor: 'rgba(255,255,255,0.2)',
//         },
//         '& svg':{
//           fill: 'white',
//         },
//         '&:focus': {
//           outline: 'none',
//           boxShadow: '0 0 5px rgba(255,255,255,0.5)',
//         },
//       },
//     },
//   };
  

//   const exportToCSV = () => {
//     const csv = Papa.unparse(filteredProducts);
//     const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
//     saveAs(blob, 'Products_list.csv');
//   };
//   const exportToPDF = () => {
//     const doc = new jsPDF();
//     doc.text('Banks List', 20, 10);
//     doc.autoTable({
//       head: [['Shade No', 'Code', 'Purchase Shade No', 'Status']],
//       body: filteredProducts.map((row) => [row.shadeNo, row.code, row.purchase_shade_no, row.status === 1 ? 'Active' : 'Inactive'])
//     });
//     doc.save('Products_list.pdf');
//   };
//   return (
//     <div className="container-fluid pt-4" style={{ border: '3px dashed #14ab7f', borderRadius: '8px', background: '#ff9d0014' }}>
//       <div className="row mb-3">
//         <div className="col-md-4">
//           <input
//             type="text"
//             placeholder="Search..."
//             id="search"
//             value={searchQuery}
//             onChange={handleSearch}
//             className="pe-5 ps-2 py-2"
//             style={{ borderRadius: '5px' }}
//           />
//         </div>
//         <div className="col-md-8 text-end">
//           <Button variant="primary" onClick={handleAddProduct}>
//             <MdPersonAdd className="me-2" /> Add Product
//           </Button>
//         </div>
//       </div>
//       <div className="row">
//         <div className="col-12">
//           <div className="card rounded-lg shadow-none" style={{ background: '#f5f0e6' }}>
//             <div className="card-body p-0" style={{ borderRadius: '8px' }}>
//               <div className="d-flex justify-content-end">
//                 <button type="button" className="btn btn-sm btn-info" onClick={exportToCSV}>
//                   <FaFileCsv className="w-5 h-5 me-1" />
//                   Export as CSV
//                 </button>
//                 <button type="button" className="btn btn-sm btn-info" onClick={exportToPDF}>
//                   <AiOutlineFilePdf className="w-5 h-5 me-1" />
//                   Export as PDF
//                 </button>
//               </div>
//               <DataTable
//                 columns={columns}
//                 data={filteredProducts} // Use filteredProducts
//                 pagination
//                 highlightOnHover
//                 striped
//                 responsive
//                 customStyles={customStyles}
//                 defaultSortFieldId={1}
//               />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Edit Product Modal */}
//       {showEditModal && (
//         <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
//           <Modal.Header closeButton style={{ backgroundColor: '#3f4d67' }}>
//             <Modal.Title className="text-white">Edit Product</Modal.Title>
//           </Modal.Header>
//           <Modal.Body style={{ backgroundColor: '#f0fff4' }}>
//             <Form>
//               <Form.Group className="mb-3">
//                 <Form.Label>Product Name</Form.Label>
//                 <Form.Control
//                   type="text"
//                   name="name"
//                   value={selectedProduct.name || ''}
//                   onChange={handleChange}
//                   className="bg-white shadow-sm"
//                 />
//               </Form.Group>

//               <Form.Group className="mb-3">
//                 <Form.Label>Shade No</Form.Label>
//                 <Form.Control
//                   type="text"
//                   name="shadeNo"
//                   value={selectedProduct.shadeNo || ''}
//                   onChange={handleChange}
//                   className="bg-white shadow-sm"
//                 />
//               </Form.Group>

//               <Form.Group className="mb-3">
//                 <Form.Label>Code</Form.Label>
//                 <Form.Control
//                   type="text"
//                   name="code"
//                   value={selectedProduct.code || ''}
//                   onChange={handleChange}
//                   className="bg-white shadow-sm"
//                 />
//               </Form.Group>

//               <Form.Group className="mb-3">
//                 <Form.Label>Purchase Shade No</Form.Label>
//                 <Form.Control
//                   type="text"
//                   name="purchase_shade_no"
//                   value={selectedProduct.purchase_shade_no || ''}
//                   onChange={handleChange}
//                   className="bg-white shadow-sm"
//                 />
//               </Form.Group>
//               <Form.Group className="mb-3">
//                 <Form.Label>Status</Form.Label>
//                 <Form.Select name="status" value={selectedProduct.status || ''} onChange={handleChange} className="bg-white shadow-sm">
//                   <option value={1}>Active</option>
//                   <option value={0}>Inactive</option>
//                 </Form.Select>
//               </Form.Group>
//             </Form>
//           </Modal.Body>
//           <Modal.Footer style={{ backgroundColor: '#f0fff4' }}>
//             <Button variant="secondary" onClick={() => setShowEditModal(false)}>
//               Close
//             </Button>
//             <Button variant="success" onClick={handleUpdateProduct}>
//               Update
//             </Button>
//           </Modal.Footer>
//         </Modal>
//       )}
//     </div>
//   );
// };

// export default ProductsPage;



import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Button, Modal, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MdEdit, MdDelete, MdPersonAdd } from 'react-icons/md';
import { toast } from 'react-toastify';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import Swal from 'sweetalert2';

import Papa from 'papaparse';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { FaFileCsv } from 'react-icons/fa';
import { AiOutlineFilePdf } from 'react-icons/ai';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleToggleStatus = async (receiverId, currentStatus) => {
    try {
      const updatedStatus = currentStatus === 1 ? 0 : 1; // Toggle status
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/receiver/${receiverId}`,
        { status: updatedStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      toast.success('Status updated successfully!');
      setProducts((prevReceivers) =>
        prevReceivers.map((receiver) => (receiver.id === receiverId ? { ...receiver, status: updatedStatus } : receiver))
      );

      setFilteredProducts((prevFilteredReceivers) =>
        prevFilteredReceivers.map((receiver) => (receiver.id === receiverId ? { ...receiver, status: updatedStatus } : receiver))
      );
    } catch (error) {
      toast.error('Failed to update status!');
      console.error(error);
    }
  };
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/products`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        console.log('Products:', response.data.data);
        setProducts(response.data.data);
        setFilteredProducts(response.data.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = products.filter((product) => {
      return (
        product.shadeNo.toLowerCase().includes(lowercasedQuery) ||
        product.code.toLowerCase().includes(lowercasedQuery) ||
        product.purchase_shade_no.toLowerCase().includes(lowercasedQuery)
      );
    });
    setFilteredProducts(filtered);
  }, [searchQuery, products]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const navigate = useNavigate();

  const columns = [
    {
      name: 'Sr No',
      selector: (_, index) => index + 1,
      sortable: true
    },
    {
      name: 'Product Category',
      selector: (row) => row.product_category.product_category,
      sortable: true
    },
    {
      name: 'Name',
      selector: (row) => row.name,
      sortable: true
    },
    {
      name: 'Shade No',
      selector: (row) => row.shadeNo,
      sortable: true
    },
    {
      name: 'Purchase Shade No',
      selector: (row) => row.purchase_shade_no,
      sortable: true
    },
    {
      name: 'Status',
      selector: (row) => (row.status === 1 ? 'inactive' : 'active'),
      sortable: true,
      cell: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Toggle Switch */}
          <label style={{ position: 'relative', display: 'inline-block', width: '34px', height: '20px' , marginBottom:'0'}}>
            <input
              type="checkbox"
              checked={row.status === 0} // Active if 0
              onChange={() => handleToggleStatus(row.id, row.status)}
              style={{ opacity: 0, width: 0, height: 0 }}
            />
            <span
              style={{
                position: 'absolute',
                cursor: 'pointer',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: row.status === 0 ? '#4caf50' : '#ccc',
                transition: '0.4s',
                borderRadius: '20px',
              }}
            ></span>
            <span
              style={{
                position: 'absolute',
                content: '',
                height: '14px',
                width: '14px',
                left: row.status === 0 ? '18px' : '3px',
                bottom: '3px',
                backgroundColor: 'white',
                transition: '0.4s',
                borderRadius: '50%',
              }}
            ></span>
          </label>
      
          {/* Status Badge */}
          <span
            className={`badge ${row.status === 0 ? 'bg-success' : 'bg-danger'}`}
            style={{
              padding: '5px 10px',
              borderRadius: '8px',
              whiteSpace: 'nowrap', // Prevents text wrapping
            }}
          >
            {row.status === 0 ? 'Active' : 'Inactive'}
          </span>
        </div>
      )
    },
    {
      name: 'Action',
      cell: (row) => (
        <div className="d-flex">
          <Button variant="outline-success" size="sm" className="me-2" onClick={() => handleEdit(row)}>
            <MdEdit />
          </Button>
          <Button variant="outline-danger" size="sm" onClick={() => handleDelete(row.id)}>
            <MdDelete />
          </Button>
        </div>
      )
    }
  ];
  const handleDelete = async (receiverId) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      });

      if (result.isConfirmed) {
        await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/products/${receiverId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setProducts((prevReceivers) => prevReceivers.filter((Receivers) => Receivers.id !== receiverId));
        setFilteredProducts((prevFilteredReceivers) => prevFilteredReceivers.filter((Receivers) => Receivers.id !== receiverId));

        toast.success('Receiver deleted successfully');
        Swal.fire('Deleted!', 'The Receiver has been deleted.', 'success');
      }
    } catch (error) {
      console.error('Error deleting Receiver:', error);
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(`Failed to delete Receiver: ${error.response.data.message}`);
      } else {
        toast.error('An unexpected error occurred while deleting the Receiver.');
      }
      Swal.fire('Error!', 'There was a problem deleting the Receiver.', 'error');
    }
  };


  const handleEdit = (product) => {
    setSelectedProduct(product);
    setShowEditModal(true);
  };

  const handleUpdateProduct = async () => {
    try {
      if (!selectedProduct || !selectedProduct.id) {
        toast.error('Invalid product selected for update!');
        return;
      }
      const response = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/products/${selectedProduct.id}`, selectedProduct, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.status === 200) {
        toast.success('Product updated successfully!');
        setProducts((prev) => prev.map((prod) => (prod.id === selectedProduct.id ? selectedProduct : prod)));
        setFilteredProducts((prev) => prev.map((prod) => (prod.id === selectedProduct.id ? selectedProduct : prod)));
        setShowEditModal(false);
      } else {
        throw new Error('Unexpected response status');
      }
    } catch (error) {
      console.error('Error during update:', error);
      toast.error('Error updating product!');
    }
  };

  const handleAddProduct = () => {
    navigate('/add-shades');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value
    }));
  };

  const customStyles = {
    table: {
      style: {
        borderCollapse: 'separate', 
        borderSpacing: 0, 
      },
    },
    header: {
      style: {
        backgroundColor: '#2E8B57',
        color: '#fff',
        fontSize: '18px',
        fontWeight: 'bold',
        padding: '15px',
        borderRadius: '8px 8px 0 0', 
      },
    },
    rows: {
      style: {
        backgroundColor: '#f0fff4',
        borderBottom: '1px solid #e0e0e0',
        transition: 'background-color 0.3s ease',
        '&:hover': {
          backgroundColor: '#e6f4ea',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        },
      },
    },
    headCells: {
      style: {
        backgroundColor: '#20B2AA',
        color: '#fff',
        fontSize: '12px',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        padding: '15px',
        borderRight: '1px solid #e0e0e0', 
      },
      lastCell: {
        style: {
          borderRight: 'none', 
        },
      },
    },
    cells: {
      style: {
        fontSize: '14px',
        color: '#333',
        padding: '12px',
        borderRight: '1px solid grey', 
      },
    },
    pagination: {
      style: {
        backgroundColor: '#3f4d67',
        color: '#fff',
        borderRadius: '0 0 8px 8px',
      },
      pageButtonsStyle: {
        backgroundColor: 'transparent',
        color: 'black', 
        border: 'none',
        '&:hover': {
          backgroundColor: 'rgba(255,255,255,0.2)',
        },
        '& svg':{
          fill: 'white',
        },
        '&:focus': {
          outline: 'none',
          boxShadow: '0 0 5px rgba(255,255,255,0.5)',
        },
      },
    },
  };
  

  const exportToCSV = () => {
    const csv = Papa.unparse(filteredProducts);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'Products_list.csv');
  };
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text('Banks List', 20, 10);
    doc.autoTable({
      head: [['Shade No', 'Code', 'Purchase Shade No', 'Status']],
      body: filteredProducts.map((row) => [row.shadeNo, row.code, row.purchase_shade_no, row.status === 1 ? 'Active' : 'Inactive'])
    });
    doc.save('Products_list.pdf');
  };
  return (
    <div className="container-fluid pt-4" style={{ border: '3px dashed #14ab7f', borderRadius: '8px', background: '#ff9d0014' }}>
      <div className="row mb-3">
        <div className="col-md-4">
          <input
            type="text"
            placeholder="Search..."
            id="search"
            value={searchQuery}
            onChange={handleSearch}
            className="pe-5 ps-2 py-2"
            style={{ borderRadius: '5px' }}
          />
        </div>
        <div className="col-md-8 text-end">
          <Button variant="primary" onClick={handleAddProduct}>
            <MdPersonAdd className="me-2" /> Add Product
          </Button>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <div className="card rounded-lg shadow-none" style={{ background: '#f5f0e6' }}>
            <div className="card-body p-0" style={{ borderRadius: '8px' }}>
              <div className="d-flex justify-content-end">
                <button type="button" className="btn btn-sm btn-info" onClick={exportToCSV}>
                  <FaFileCsv className="w-5 h-5 me-1" />
                  Export as CSV
                </button>
                <button type="button" className="btn btn-sm btn-info" onClick={exportToPDF}>
                  <AiOutlineFilePdf className="w-5 h-5 me-1" />
                  Export as PDF
                </button>
              </div>
              <DataTable
                columns={columns}
                data={filteredProducts} // Use filteredProducts
                pagination
                highlightOnHover
                striped
                responsive
                customStyles={customStyles}
                defaultSortFieldId={1}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Edit Product Modal */}
      {showEditModal && (
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
          <Modal.Header closeButton style={{ backgroundColor: '#3f4d67' }}>
            <Modal.Title className="text-white">Edit Product</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ backgroundColor: '#f0fff4' }}>
            <Form>
              {/* <Form.Group className="mb-3">
                <Form.Label>Product Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={selectedProduct.name || ''}
                  onChange={handleChange}
                  className="bg-white shadow-sm"
                />
              </Form.Group> */}

              <Form.Group className="mb-3">
                <Form.Label>Shade No</Form.Label>
                <Form.Control
                  type="text"
                  name="shadeNo"
                  value={selectedProduct.shadeNo || ''}
                  onChange={handleChange}
                  className="bg-white shadow-sm"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Code</Form.Label>
                <Form.Control
                  type="text"
                  name="code"
                  value={selectedProduct.code || ''}
                  onChange={handleChange}
                  className="bg-white shadow-sm"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Purchase Shade No</Form.Label>
                <Form.Control
                  type="text"
                  name="purchase_shade_no"
                  value={selectedProduct.purchase_shade_no || ''}
                  onChange={handleChange}
                  className="bg-white shadow-sm"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Select name="status" value={selectedProduct.status || ''} onChange={handleChange} className="bg-white shadow-sm">
                  <option value={1}>Active</option>
                  <option value={0}>Inactive</option>
                </Form.Select>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer style={{ backgroundColor: '#f0fff4' }}>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Close
            </Button>
            <Button variant="success" onClick={handleUpdateProduct}>
              Update
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default ProductsPage;

