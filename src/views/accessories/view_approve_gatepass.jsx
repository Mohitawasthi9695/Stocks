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
    { name: 'Stock Code', selector: (row) => row.stock_code, sortable: true },
    { name: 'Lot No', selector: (row) => row.lot_no, sortable: true },
    { name: 'Length', selector: (row) => `${row.length}  ${row.length_unit}`, sortable: true },
    { name: 'Pcs', selector: (row) => row.items, sortable: true },
    { name: 'Box/Bundle', selector: (row) => row.box_bundle, sortable: true },
    { name: 'Quantity', selector: (row) => row.quantity, sortable: true },
    { name: 'Out Quantity', selector: (row) => row.out_quantity, sortable: true },
    {
      name: 'Status',
      selector: (row) => row.status, // Keep it numeric for sorting
      sortable: true,
      cell: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span
            className={`badge ${row.status === 1 ? 'bg-success' : row.status === 2 ? 'bg-warning' : 'bg-danger'}`}
            style={{
              padding: '5px 10px',
              borderRadius: '8px',
              whiteSpace: 'nowrap'
            }}
          >
            {row.status === 1 ? 'Approved' : row.status === 2 ? 'Stock Out' : 'Pending'}
          </span>
        </div>
      )
    }
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
  const exportToCSV = () => {
    if (!filteredProducts || filteredProducts.length === 0) {
      toast.error('No data available for export.');
      return;
    }

    // Extract column headers dynamically from `columns` array
    const headers = columns.map((col) => col.name);

    // Prepare CSV data dynamically
    const csvData = filteredProducts.map((row, index) => {
      let rowData = { 'Sr No': index + 1 }; // Add Serial Number manually

      columns.forEach((col) => {
        if (typeof col.selector === 'function') {
          rowData[col.name] = col.selector(row);
        }
      });

      return rowData;
    });

    // Convert to CSV and save
    const csv = Papa.unparse({ fields: headers, data: csvData });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'stock_list.csv');
    toast.success('CSV exported successfully!');
  };

  const exportToPDF = () => {
    if (!filteredProducts || filteredProducts.length === 0) {
      toast.error('No data available for export.');
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text('Stock List', 80, 10);

    // Extract headers from `columns` array
    const headers = columns.map((col) => col.name);

    // Prepare data dynamically
    const body = filteredProducts.map((row, index) => {
      return [
        index + 1, // Sr No
        row.gate_pass_no || 'N/A', // Explicitly include Gate Pass No
        row.date || 'N/A',
        row.stock_code || 'N/A',
        row.lot_no || 'N/A',
        `${row.length} ${row.length_unit}` || 'N/A',
        row.items || 'N/A',
        row.box_bundle || 'N/A',
        row.quantity || 'N/A',
        row.out_quantity || 'N/A',
        row.status === 1 ? 'Approved' : row.status === 2 ? 'Sold Out' : 'Pending'
      ];
    });

    doc.autoTable({
      head: [headers],
      body: body,
      startY: 20,
      theme: 'grid',
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [44, 62, 80], textColor: 255, fontSize: 8 },
      alternateRowStyles: { fillColor: [240, 240, 240] },
      margin: { top: 20 }
    });

    doc.save('stock_list.pdf');
    toast.success('PDF exported successfully!');
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
        <div className="col-md-8">
          <div className="d-flex justify-content-end">
            <button type="button" className="btn btn-info" onClick={exportToCSV}>
              <FaFileCsv className="w-5 h-5 me-1" />
              Export as CSV
            </button>
            <button type="button" className="btn btn-info" onClick={exportToPDF}>
              <AiOutlineFilePdf className="w-5 h-5 me-1" />
              Export as PDF
            </button>
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
