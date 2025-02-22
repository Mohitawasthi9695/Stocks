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
// import { BiBorderLeft } from 'react-icons/bi';
// import { text } from 'd3';

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
//         const response = await axios.get(
//           `${import.meta.env.VITE_API_BASE_URL}/api/godownAccessory`,
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("token")}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );
//         console.log(response.data.data);
//         const godownData = response.data.data;
//         setProducts(godownData);
//         setFilteredProducts(godownData);
//       } catch (err) {
//         console.error(err);
//         toast.error("Failed to fetch data.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProductData();
//   }, []);

//   useEffect(() => {
//     const lowercasedQuery = searchQuery.toLowerCase();
//     const filtered = products.filter(
//       (product) =>
//         product.lot_no.toLowerCase().includes(lowercasedQuery) ||
//         product.length_unit.toLowerCase().includes(lowercasedQuery)
//     );
//     setFilteredProducts(filtered);
//   }, [searchQuery, products]);

//   const handleSearch = (e) => {
//     setSearchQuery(e.target.value);
//   };

//   const navigate = useNavigate();

//   const columns = [
//     { name: "Sr No", selector: (_, index) => index + 1, sortable: true },
//     { name: "Gate Pass No", selector: (row) => row.gate_pass_no, sortable: true },
//     { name: "Date", selector: (row) => row.date, sortable: true },
//     // { name: "Warehouse Supervisor", selector: (row) => row.warehouse_supervisor, sortable: true },
//     // { name: "Godown Supervisor", selector: (row) => row.godown_supervisor, sortable: true },
//     { name: "Stock Code", selector: (row) => row.stock_code, sortable: true },
//     { name: "Lot No", selector: (row) => row.lot_no, sortable: true },
//     { name: "Length", selector: (row) => `${row.length}  ${row.length_unit}`, sortable: true },
//     { name: "Pcs", selector: (row) => row.items, sortable: true },
//     { name: "Box/Bundle", selector: (row) => row.box_bundle, sortable: true },
//     { name: "Quantity", selector: (row) => row.quantity, sortable: true },
//     { name: "Out Quantity", selector: (row) => row.out_quantity, sortable: true },
//   ];

//   const handleEdit = (product) => {
//     setSelectedProduct(product);
//     setShowEditModal(true);
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setSelectedProduct((prevProduct) => ({
//       ...prevProduct,
//       [name]: value,
//     }));
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
//       return; // Exit if user cancels
//     }

//     try {
//       const response = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/godowns/getStockgatepass${productId}`, {
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
//     header: {
//       style: {
//         backgroundColor: '#2E8B57',
//         color: '#fff',
//         fontSize: '18px',
//         fontWeight: 'bold',
//         padding: '15px',
//         borderRadius: '8px 8px 8px 8px',
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
//         borderRight: '1px solid #e0e0e0',
//       },
//     },
//     cells: {
//       style: {
//         fontSize: '14px',
//         color: '#333',
//         padding: '12px',
//         borderRight: '1px solid #e0e0e0',
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
//         color: '#fff',
//         '&:hover': {
//           backgroundColor: 'rgba(255,255,255,0.2)',
//         },
//       },
//     },
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
import { BiBorderLeft } from 'react-icons/bi';
import { text } from 'd3';

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
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/godownAccessory`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        console.log(response.data.data);
        const godownData = response.data.data;
        setProducts(godownData);
        setFilteredProducts(godownData);
      } catch (err) {
        console.error(err);
        toast.error('Failed to fetch data.');
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, []);

  useEffect(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = products.filter(
      (product) => product.lot_no.toLowerCase().includes(lowercasedQuery) || product.length_unit.toLowerCase().includes(lowercasedQuery)
    );
    setFilteredProducts(filtered);
  }, [searchQuery, products]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const navigate = useNavigate();

  const columns = [
    { name: 'Sr No', selector: (_, index) => index + 1, sortable: true },
    { name: 'Gate Pass No', selector: (row) => row.gate_pass_no, sortable: true },
    { name: 'Date', selector: (row) => row.date, sortable: true },
    // { name: "Warehouse Supervisor", selector: (row) => row.warehouse_supervisor, sortable: true },
    // { name: "Godown Supervisor", selector: (row) => row.godown_supervisor, sortable: true },
    { name: 'Stock Code', selector: (row) => row.stock_code, sortable: true },
    { name: 'Lot No', selector: (row) => row.lot_no, sortable: true },
    { name: 'Length', selector: (row) => `${row.length}  ${row.length_unit}`, sortable: true },
    { name: 'Pcs', selector: (row) => row.items, sortable: true },
    { name: 'Box/Bundle', selector: (row) => row.box_bundle, sortable: true },
    { name: 'Quantity', selector: (row) => row.quantity, sortable: true },
    { name: 'Out Quantity', selector: (row) => row.out_quantity, sortable: true }
  ];

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
      return; // Exit if user cancels
    }

    try {
      const response = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/godowns/getStockgatepass${productId}`, {
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
    header: {
      style: {
        backgroundColor: '#2E8B57',
        color: '#fff',
        fontSize: '18px',
        fontWeight: 'bold',
        padding: '15px',
        borderRadius: '8px 8px 8px 8px'
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
        borderRight: '1px solid #e0e0e0'
      }
    },
    cells: {
      style: {
        fontSize: '14px',
        color: '#333',
        padding: '12px',
        borderRight: '1px solid #e0e0e0'
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
        color: '#fff',
        '&:hover': {
          backgroundColor: 'rgba(255,255,255,0.2)'
        }
      }
    }
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
            ) : (
              <div className="card-body p-0" style={{ borderRadius: '8px' }}>
                <DataTable
                  columns={columns}
                  data={filteredProducts}
                  pagination
                  highlightOnHover
                  striped
                  responsive
                  customStyles={customStyles}
                  defaultSortFieldId={1}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Show_product;
