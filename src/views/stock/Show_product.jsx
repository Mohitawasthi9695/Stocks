// import React, { useEffect, useState } from 'react';
// import DataTable from 'react-data-table-component';
// import { Button, Modal, Form } from 'react-bootstrap';
// import { useNavigate, useParams } from 'react-router-dom';
// import axios from 'axios';
// import { MdEdit, MdDelete, MdPersonAdd } from 'react-icons/md';
// import { toast } from 'react-toastify';
// import Skeleton from 'react-loading-skeleton';
// import 'react-loading-skeleton/dist/skeleton.css';
// import DataTableExtensions from 'react-data-table-component-extensions';
// import Swal from 'sweetalert2';
// import * as XLSX from 'xlsx';
// import { MdFileDownload } from 'react-icons/md';

// const Show_product = () => {
//   const [products, setProducts] = useState([]);
//   const [filteredProducts, setFilteredProducts] = useState([]); // For search
//   const [searchQuery, setSearchQuery] = useState(''); // Search query
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [showEditModal, setShowEditModal] = useState(false);

//   const [loading, setLoading] = useState(true);
//   const { id } = useParams();

//   useEffect(() => {
//     const fetchProductData = async () => {
//       try {
//         const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/stocks/${id}`, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`,
//             'Content-Type': 'application/json'
//           }
//         });
//         console.log(response.data);
//         setProducts(response.data);
//         setFilteredProducts(response.data);
//       } catch (err) {
//         console.log(err);
//       } finally {
//         setLoading(false); // Stop loading
//       }
//     };
//     fetchProductData();
//   }, [id]);
//   useEffect(() => {
//     const lowercasedQuery = searchQuery.toLowerCase();
//     const filtered = products.filter(
//       (product) =>
//         product.width.toLowerCase().includes(lowercasedQuery) ||
//         product.length.toLowerCase().includes(lowercasedQuery) ||
//         product.invoice_no.toLowerCase().includes(lowercasedQuery) ||
//         product.lot_no.toString().toLowerCase().includes(lowercasedQuery)
//     );
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
//       name: 'Date',
//       selector: (row) => row.date,
//       sortable: true
//     },
//     {
//       name: 'Lot No',
//       selector: (row) => row.lot_no,
//       sortable: true
//     },
//     {
//       name: 'Invoice no',
//       selector: (row) => row.invoice_no,
//       sortable: true
//     },
//     {
//       name: 'Product Category',
//       selector: (row) => row.product_category_name,
//       sortable: true
//     },
//     {
//       name: 'Shade no',
//       selector: (row) => row.shadeNo,
//       sortable: true
//     },
//     {
//       name: 'Pur. Shade no',
//       selector: (row) => row.purchase_shade_no,
//       sortable: true
//     },
//     {
//       name: 'Length',
//       selector: (row) => `${Number(row.length).toFixed(2)} ${row.length_unit}`,
//       sortable: true
//     },
//     {
//       name: 'Width',
//       selector: (row) =>`${Number(row.width).toFixed(2)} ${row.width_unit}`,
//       sortable: true
//     },
//     {
//       name: 'Pcs',
//       selector: (row) => row.pcs,
//       sortable: true
//     },
//     {
//       name: 'Quantity',
//       selector: (row) => row.quantity,
//       sortable: true
//     },
//     {
//       name: 'Action',
//       cell: (row) => (
//         <div className="d-flex">
//           <Button variant="outline-danger" size="sm" onClick={() => handleDelete(row.id)}>
//             <MdDelete />
//           </Button>
//           <Button variant="outline-success" size="sm" onClick={() => handleDownloadExcel(row)}>
//           <MdFileDownload />
//         </Button>
//         </div>
//       )
//     }
//   ];
//   const handleDownloadExcel = (row) => {
//     const worksheet = XLSX.utils.json_to_sheet([row]); // Convert single row to Excel format
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, 'Product Data');

//     // Create an Excel file and download
//     XLSX.writeFile(workbook, `Product_${row.lot_no}.xlsx`);
//   };

//   const handleEdit = (product) => {
//     setSelectedProduct(product);
//     setShowEditModal(true);
//   };
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setSelectedProduct((prevProduct) => ({
//       ...prevProduct,
//       [name]: value
//     }));
//   };
//   const handleUpdateProduct = async () => {
//     try {
//       console.log(selectedProduct);
//       const response = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/stocks/${selectedProduct.id}`, selectedProduct, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('token')}`
//         }
//       });
//       console.log(response.data);
//       setProducts((prevProducts) => prevProducts.map((products) => (products.id === selectedProduct.id ? selectedProduct : products)));
//       toast.success('Product updated successfully!');
//       setShowEditModal(false);
//     } catch (error) {
//       toast.error('Error updating Product!');
//     }
//   };

//   const handleDelete = async (productId) => {
//     const result = await Swal.fire({
//       title: 'Are you sure?',
//       text: "You won't be able to revert this!",
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonColor: '#3085d6',
//       cancelButtonColor: '#d33',
//       confirmButtonText: 'Yes, delete it!'
//     });

//     if (!result.isConfirmed) {
//       return;
//     }

//     try {
//       const response = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/stocks/${productId}`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('token')}`
//         }
//       });
//       console.log(response.data);
//       toast.success('Product deleted successfully');
//       setProducts((prev) => prev.filter((product) => product.id !== productId));
//       setFilteredProducts((prev) => prev.filter((product) => product.id !== productId));
//     } catch (error) {
//       console.error(error);
//       toast.error('Failed to delete Product');
//     }
//   };

//   const customStyles = {
//     table: {
//       style: {
//         borderCollapse: 'separate', // Ensures border styles are separate
//         borderSpacing: 0 // Removes spacing between cells
//       }
//     },
//     header: {
//       style: {
//         backgroundColor: '#2E8B57',
//         color: '#fff',
//         fontSize: '18px',
//         fontWeight: 'bold',
//         padding: '15px',
//         borderRadius: '8px 8px 0 0' // Adjusted to only affect top corners
//       }
//     },
//     rows: {
//       style: {
//         backgroundColor: '#f0fff4',
//         borderBottom: '1px solid #e0e0e0',
//         transition: 'background-color 0.3s ease',
//         '&:hover': {
//           backgroundColor: '#e6f4ea',
//           boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
//         }
//       }
//     },
//     headCells: {
//       style: {
//         backgroundColor: '#20B2AA',
//         color: '#fff',
//         fontSize: '12px',
//         fontWeight: 'bold',
//         textTransform: 'uppercase',
//         padding: '15px',
//         borderRight: '1px solid #e0e0e0' // Vertical lines between header cells
//       },
//       lastCell: {
//         style: {
//           borderRight: 'none' // Removes border for the last cell
//         }
//       }
//     },
//     cells: {
//       style: {
//         fontSize: '14px',
//         color: '#333',
//         padding: '12px',
//         borderRight: '1px solid grey' // Vertical lines between cells
//       }
//     },
//     pagination: {
//       style: {
//         backgroundColor: '#3f4d67',
//         color: '#fff',
//         borderRadius: '0 0 8px 8px'
//       },
//       pageButtonsStyle: {
//         backgroundColor: 'transparent',
//         color: 'black', // Makes the arrows white
//         border: 'none',
//         '&:hover': {
//           backgroundColor: 'rgba(255,255,255,0.2)'
//         },
//         '& svg': {
//           fill: 'white'
//         },
//         '&:focus': {
//           outline: 'none',
//           boxShadow: '0 0 5px rgba(255,255,255,0.5)'
//         }
//       }
//     }
//   };

//   return (
//     <div className="container-fluid pt-4 " style={{ border: '3px dashed #14ab7f', borderRadius: '8px', background: '#ff9d0014' }}>
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

//       </div>
//       <div className="row">
//         <div className="col-12">
//           <div className="card shadow-lg border-0 rounded-lg">
//             {loading ? (
//               <div>
//                 {[...Array(8)].map((_, index) => (
//                   <div key={index} style={{ display: 'flex', gap: '10px', padding: '10px' }}>
//                     <Skeleton width={50} height={20} />
//                     <Skeleton width={200} height={20} />
//                     <Skeleton width={200} height={20} />
//                     <Skeleton width={200} height={20} />
//                     <Skeleton width={200} height={20} />
//                     <Skeleton width={200} height={20} />
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div className="card-body p-0" style={{ borderRadius: '8px' }}>
//                 <DataTable
//                   columns={columns}
//                   data={filteredProducts}
//                   pagination
//                   highlightOnHover
//                   striped
//                   responsive
//                   customStyles={customStyles}
//                   defaultSortFieldId={1}
//                 />
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//       {/* Edit Product Modal */}
//       <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
//         <Modal.Header closeButton>
//           <Modal.Title>Edit Product</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form>
//             <Form.Group className="mb-3">
//               <Form.Label>Lot Number</Form.Label>
//               <Form.Control type="text" name="lot_no" value={selectedProduct?.lot_no || ''} onChange={handleChange} />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Length</Form.Label>
//               <Form.Control type="number" step="0.01" name="length" value={selectedProduct?.length || ''} onChange={handleChange} />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Width</Form.Label>
//               <Form.Control type="number" step="0.01" name="width" value={selectedProduct?.width || ''} onChange={handleChange} />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Unit</Form.Label>
//               <Form.Control type="read-only" name="unit" value={selectedProduct?.unit || ''} disabled={true} />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Type</Form.Label>
//               <Form.Control type="text" name="type" value={selectedProduct?.type || ''} onChange={handleChange} />
//             </Form.Group>
//           </Form>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowEditModal(false)}>
//             Close
//           </Button>
//           <Button variant="primary" onClick={handleUpdateProduct}>
//             Save Changes
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// };

// export default Show_product;

import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Button, Modal, Form } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { MdEdit, MdDelete, MdPersonAdd } from 'react-icons/md';
import { toast } from 'react-toastify';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import DataTableExtensions from 'react-data-table-component-extensions';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { MdFileDownload } from 'react-icons/md';
import { FaFileCsv } from 'react-icons/fa';
import { AiOutlineFilePdf } from 'react-icons/ai';
import Papa from 'papaparse';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Show_product = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]); // For search
  const [searchQuery, setSearchQuery] = useState(''); // Search query
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/stocks/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        console.log(response.data);
        setProducts(response.data);
        setFilteredProducts(response.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false); // Stop loading
      }
    };
    fetchProductData();
  }, [id]);
  useEffect(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = products.filter((product) =>
      Object.values(product).some((value) => value && value.toString().toLowerCase().includes(lowercasedQuery))
    );
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
      name: 'Date',
      selector: (row) => row.date,
      sortable: true
    },
    {
      name: 'Ware Code',
      selector: (row) => row.stock_code,
      sortable: true
    },
    {
      name: 'Lot No',
      selector: (row) => row.lot_no,
      sortable: true
    },
    {
      name: 'Invoice no',
      selector: (row) => row.invoice_no,
      sortable: true
    },
    {
      name: 'Product Category',
      selector: (row) => row.product_category_name,
      sortable: true
    },
    {
      name: 'Shade no',
      selector: (row) => row.shadeNo,
      sortable: true
    },
    {
      name: 'Pur. Shade no',
      selector: (row) => row.purchase_shade_no,
      sortable: true
    },
    {
      name: 'Length',
      selector: (row) => `${Number(row.length).toFixed(2)} ${row.length_unit}`,
      sortable: true
    },
    {
      name: 'Width',
      selector: (row) => `${Number(row.width).toFixed(2)} ${row.width_unit}`,
      sortable: true
    },
    {
      name: 'Pcs',
      selector: (row) => row.pcs,
      sortable: true
    },
    {
      name: 'Quantity',
      selector: (row) => row.quantity,
      sortable: true
    },
    {
      name: 'Action',
      cell: (row) => (
        <div className="d-flex">
          <Button variant="outline-danger" size="sm" onClick={() => handleDelete(row.id)}>
            <MdDelete />
          </Button>
          <Button variant="outline-success" size="sm" onClick={() => handleDownloadExcel(row)}>
            <MdFileDownload />
          </Button>
        </div>
      )
    }
  ];
  const handleDownloadExcel = (row) => {
    const worksheet = XLSX.utils.json_to_sheet([row]); // Convert single row to Excel format
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Product Data');

    // Create an Excel file and download
    XLSX.writeFile(workbook, `Product_${row.lot_no}.xlsx`);
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setShowEditModal(true);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value
    }));
  };
  const handleUpdateProduct = async () => {
    try {
      console.log(selectedProduct);
      const response = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/stocks/${selectedProduct.id}`, selectedProduct, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      console.log(response.data);
      setProducts((prevProducts) => prevProducts.map((products) => (products.id === selectedProduct.id ? selectedProduct : products)));
      toast.success('Product updated successfully!');
      setShowEditModal(false);
    } catch (error) {
      toast.error('Error updating Product!');
    }
  };

  const handleDelete = async (productId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      const response = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/stocks/${productId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      console.log(response.data);
      toast.success('Product deleted successfully');
      setProducts((prev) => prev.filter((product) => product.id !== productId));
      setFilteredProducts((prev) => prev.filter((product) => product.id !== productId));
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete Product');
    }
  };

  const customStyles = {
    table: {
      style: {
        borderCollapse: 'separate', // Ensures border styles are separate
        borderSpacing: 0 // Removes spacing between cells
      }
    },
    header: {
      style: {
        backgroundColor: '#2E8B57',
        color: '#fff',
        fontSize: '18px',
        fontWeight: 'bold',
        padding: '15px',
        borderRadius: '8px 8px 0 0' // Adjusted to only affect top corners
      }
    },
    rows: {
      style: {
        backgroundColor: '#f0fff4',
        borderBottom: '1px solid #e0e0e0',
        transition: 'background-color 0.3s ease',
        '&:hover': {
          backgroundColor: '#e6f4ea',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }
      }
    },
    headCells: {
      style: {
        backgroundColor: '#20B2AA',
        color: '#fff',
        fontSize: '12px',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        padding: '15px',
        borderRight: '1px solid #e0e0e0' // Vertical lines between header cells
      },
      lastCell: {
        style: {
          borderRight: 'none' // Removes border for the last cell
        }
      }
    },
    cells: {
      style: {
        fontSize: '14px',
        color: '#333',
        padding: '12px',
        borderRight: '1px solid grey' // Vertical lines between cells
      }
    },
    pagination: {
      style: {
        backgroundColor: '#3f4d67',
        color: '#fff',
        borderRadius: '0 0 8px 8px'
      },
      pageButtonsStyle: {
        backgroundColor: 'transparent',
        color: 'black', // Makes the arrows white
        border: 'none',
        '&:hover': {
          backgroundColor: 'rgba(255,255,255,0.2)'
        },
        '& svg': {
          fill: 'white'
        },
        '&:focus': {
          outline: 'none',
          boxShadow: '0 0 5px rgba(255,255,255,0.5)'
        }
      }
    }
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
    <div className="container-fluid pt-4 " style={{ border: '3px dashed #14ab7f', borderRadius: '8px', background: '#ff9d0014' }}>
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
      </div>
      <div className="row">
        <div className="col-12">
          <div className="card shadow-lg border-0 rounded-lg">
            {loading ? (
              <div>
                {[...Array(8)].map((_, index) => (
                  <div key={index} style={{ display: 'flex', gap: '10px', padding: '10px' }}>
                    <Skeleton width={50} height={20} />
                    <Skeleton width={200} height={20} />
                    <Skeleton width={200} height={20} />
                    <Skeleton width={200} height={20} />
                    <Skeleton width={200} height={20} />
                    <Skeleton width={200} height={20} />
                  </div>
                ))}
              </div>
            ) : null}{' '}
            {/* Remove duplicate DataTable */}
          </div>
        </div>
      </div>

      {/* Edit Product Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Lot Number</Form.Label>
              <Form.Control type="text" name="lot_no" value={selectedProduct?.lot_no || ''} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Length</Form.Label>
              <Form.Control type="number" step="0.01" name="length" value={selectedProduct?.length || ''} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Width</Form.Label>
              <Form.Control type="number" step="0.01" name="width" value={selectedProduct?.width || ''} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Unit</Form.Label>
              <Form.Control type="read-only" name="unit" value={selectedProduct?.unit || ''} disabled={true} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Type</Form.Label>
              <Form.Control type="text" name="type" value={selectedProduct?.type || ''} onChange={handleChange} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdateProduct}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Show_product;
