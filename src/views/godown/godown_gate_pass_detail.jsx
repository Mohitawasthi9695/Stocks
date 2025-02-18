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
  const [filteredProducts, setFilteredProducts] = useState([]); 
  const [searchQuery, setSearchQuery] = useState(''); 
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const { id } = useParams();

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/godowns/getStockgatepass/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });

        console.log(response.data.data);
        const godownData = response.data.data.flatMap((item) =>
          item.all_stocks.map((all_stocks) => {
            const width = parseFloat(all_stocks.width).toFixed(2);
            const length = parseFloat(all_stocks.length).toFixed(2);
            return {
              id: all_stocks.id,
              gate_pass_no: item.gate_pass_no,
              gate_pass_date: item.gate_pass_date,
              lot_no: all_stocks.lot_no,
              stock_code: all_stocks.stock_code,
              stockin_code:all_stocks.stockin_code,
              width :width || "N/A",
              length:length || "N/A",
              pcs:all_stocks.pcs,
              quantity: all_stocks.quantity,
              length_unit: all_stocks.length_unit,
              width_unit: all_stocks.width_unit|| "N/A",
              type: all_stocks.type,
              rack: all_stocks.rack || "N/A",
            };
          })
        );
       
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
  }, [id]); // Ensure this effect re-runs when `id` changes

  // Update filtered Products when the search query changes
  useEffect(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = products.filter(
      (product) =>
        product.lot_no.toLowerCase().includes(lowercasedQuery) ||
        product.type.toLowerCase().includes(lowercasedQuery) ||
        product.unit.toLowerCase().includes(lowercasedQuery)
    );
    setFilteredProducts(filtered);
  }, [searchQuery, products]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const navigate = useNavigate();
  const unitText = '4 feet';
  const columns = [
    { name: "Sr No", selector: (_, index) => index + 1, sortable: true},
    { name: "Gate Pass No", selector: (row) => row.gate_pass_no, sortable: true},
    { name: "Gate Pass Date", selector: (row) => row.gate_pass_date, sortable: true},
    { name: "Warehouse Code", selector: (row) => row.stockin_code, sortable: true},
    { name: "Stock Code", selector: (row) => row.stock_code, sortable: true },
    { name: "Lot No", selector: (row) => row.lot_no, sortable: true },
    { name: "Length", selector: (row) => `${row.length}  ${row.length_unit}`, sortable: true },
    { name: "Width", selector: (row) => `${row.width}  ${row.width_unit}`, sortable: true },
    { name: "Pcs", selector: (row) => row.pcs ?? 1, sortable: true },
    { name: "Quantity", selector: (row) => row.quantity, sortable: true },
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

  const handleUpdateProduct = async () => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/all_stocks/updateStock/${selectedProduct.id}`,
        selectedProduct,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.status === 200) {
        setProducts((prev) => prev.map((prod) => (prod.id === selectedProduct.id ? { ...prod, ...selectedProduct } : prod)));
        setFilteredProducts((prev) => prev.map((prod) => (prod.id === selectedProduct.id ? { ...prod, ...selectedProduct } : prod)));
        toast.success('Product updated successfully!');
        setShowEditModal(false);
      } else {
        throw new Error('Update failed');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error updating product!');
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
      return; // Exit if user cancels
    }

    try {
      const response = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/all_stocks/getStockgatepass${productId}`, {
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