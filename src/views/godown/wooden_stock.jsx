import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import axios from 'axios';
import Papa from 'papaparse';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { FaFileCsv } from 'react-icons/fa';
import { AiOutlineFilePdf } from 'react-icons/ai';
import { FiSave } from 'react-icons/fi';

const ShowProduct = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [rackInputs, setRackInputs] = useState({});

  useEffect(() => {
    const fetchStocksData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/godownwoodenstock`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        console.log('stocks data:', response.data);
        setProducts(response.data);
        setFilteredProducts(response.data);
        const initialRackInputs = {};
        productsWithArea.forEach((product) => {
          initialRackInputs[product.id] = product.rack || '';
        });
        setRackInputs(initialRackInputs);
      } catch (error) {
        console.error('Error fetching stocks data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStocksData();
  }, []);

  useEffect(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = products.filter((product) =>
      Object.values(product).some((value) => value?.toString()?.toLowerCase().includes(lowercasedQuery))
    );
    setFilteredProducts(filtered);
  }, [searchQuery, products]);

  const handleRackChange = (id, value) => {
    setRackInputs((prev) => ({
      ...prev,
      [id]: value
    }));
  };
  const handleRackUpdate = async (id) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/godownrollerstock/${id}`,
        { rack: rackInputs[id] },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200) {
        const updatedProducts = products.map((product) => (product.id === id ? { ...product, rack: rackInputs[id] } : product));
        setProducts(updatedProducts);
        setFilteredProducts(updatedProducts);
        toast.success('Rack updated successfully!');
      }
    } catch (error) {
      console.error('Error updating rack:', error);
      toast.error('Failed to update rack. Please try again.');
    }
  };
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const columns = [
    {
      name: 'Sr No',
      selector: (_, index) => index + 1,
      sortable: true
    },
    {
      name: 'Lot No',
      selector: (row) => row.lot_no,
      sortable: true
    },
    {
      name: 'Stock Code',
      selector: (row) => row.stock_code,
      sortable: true
    },
    {
      name: 'GatePass no',
      selector: (row) => row.gate_pass_no,
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
    { name: 'Length', selector: (row) => `${row.length}  ${row.length_unit}`, sortable: true },
    { name: 'Width', selector: (row) => `${row.width}  ${row.width_unit}`, sortable: true },
    {
      name: 'Pcs',
      selector: (row) => row.pcs,
      sortable: true
    },
    {
      name: 'Sold Pcs',
      selector: (row) => row.out_pcs,
      sortable: true
    },
    ,
    {
      name: 'Avaible Pcs',
      selector: (row) => row.pcs - row.out_pcs,
      sortable: true
    },
    {
      // modified 
      name: 'Rack',
      cell: (row) => (
        <div className="d-flex align-items-center gap-2">
          <input
            type="text"
            value={rackInputs[row.id] || ''}
            onChange={(e) => handleRackChange(row.id, e.target.value)}
            className="form-control form-control-sm"
            style={{ width: '100px' }}
          />
          <button className="btn btn-sm btn-success" onClick={() => handleRackUpdate(row.id)} title="Update Rack">
            <FiSave size={16} />
          </button>
        </div>
      ),
      sortable: false,
      width: '200px'
    },
    {
      name: 'Status',
      selector: (row) => row.status, // Keep it numeric for sorting
      sortable: true,
      cell: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span
            className={`badge ${
              row.status === 1
                ? 'bg-success'
                : row.status === 2
                ? 'bg-warning'
                : 'bg-danger'
            }`}
            style={{
              padding: '5px 10px',
              borderRadius: '8px',
              whiteSpace: 'nowrap'
            }}
          >
            {row.status === 1 ? 'Approved' : row.status === 2 ? 'Sold Out' : 'Pending'}
          </span>
        </div>
      )
    }
    
  ];

  const exportToCSV = () => {
    const csvData = filteredProducts.map((row, index) => ({
      'Sr No': index + 1,
      'User Name': JSON.parse(localStorage.getItem('user')).username || 'N/A',
      'User Email': JSON.parse(localStorage.getItem('user')).email || 'N/A',
      'Lot No': row.lot_no,
      'Stock Code': `${row.stock_product?.shadeNo}-${row.stock_code}` || 'N/A',
      'Invoice No': row.stock_invoice?.invoice_no || 'N/A',
      Date: row.stock_invoice?.date || 'N/A',
      'Shade No': row.stock_product?.shadeNo || 'N/A',
      'Pur. Shade No': row.stock_product?.purchase_shade_no || 'N/A',
      Length: row.length,
      Width: row.width,
      Unit: row.unit
    }));
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'stocks_list.csv');
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text('Stocks List', 20, 10);
    doc.autoTable({
      head: [
        [
          'Sr No',
          'User Name',
          'Lot No',
          'Stock Code',
          'Invoice No',
          'Date',
          'Shade No',
          'Pur. Shade No',
          'Length',
          'Width',
          'Unit',
          'Warehouse'
        ]
      ],
      body: filteredProducts.map((row, index) => [
        index + 1,
        JSON.parse(localStorage.getItem('user')).username || 'N/A',
        row.lot_no,
        `${row.stock_product?.shadeNo}-${row.stock_code}` || 'N/A',
        row.stock_invoice?.invoice_no || 'N/A',
        row.stock_invoice?.date || 'N/A',
        row.stock_product?.shadeNo || 'N/A',
        row.stock_product?.purchase_shade_no || 'N/A',
        row.length,
        row.width,
        row.unit,
        row.warehouse
      ])
    });
    doc.save('stocks_list.pdf');
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
        padding: '10px',
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
        padding: '10px',
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
  const totalBoxes = searchQuery ? filteredProducts.reduce((sum, row) => sum + (row.quantity || 0), 0) : null;

  return (
    <div className="container-fluid pt-4" style={{ border: '3px dashed #14ab7f', borderRadius: '8px', background: '#ff9d0014' }}>
      <div className="row mb-3">
        <div className="col-md-4">
          <input type="text" placeholder="Search..." id="search" value={searchQuery} onChange={handleSearch} className="form-control" />
        </div>
        <div className="col-md-8">
          <div className="d-flex justify-content-end">
            <button className="btn btn-info" onClick={exportToCSV}>
              <FaFileCsv className="w-5 h-5 me-1" /> Export as CSV
            </button>
            <button className="btn btn-info" onClick={exportToPDF}>
              <AiOutlineFilePdf className="w-5 h-5 me-1" /> Export as PDF
            </button>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <div className="card border-0 shadow-none" style={{ background: '#f5f0e6' }}>
            {loading ? (
              <Skeleton count={10} />
            ) : (
              <>
                <DataTable columns={columns} data={filteredProducts} pagination highlightOnHover customStyles={customStyles} />
                {searchQuery && (
                  <div style={{ padding: '10px', textAlign: 'right', fontWeight: 'bold', fontSize: '16px', background: '#ddd' }}>
                    Total Boxes: {totalBoxes}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowProduct;
