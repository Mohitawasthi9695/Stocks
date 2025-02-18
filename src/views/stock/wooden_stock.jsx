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
import { Dropdown, DropdownButton } from 'react-bootstrap';

const ShowProduct = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedColumns, setSelectedColumns] = useState([]);

  useEffect(() => {
    const fetchStocksData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/category/woodenstock`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        console.log('stocks data:', response.data);
        setProducts(response.data);
        setFilteredProducts(response.data);
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

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const allColumns = [
    {
      id: 'sr_no',
      name: 'Sr No',
      selector: (_, index) => index + 1,
      sortable: true
    },
    {
      id: 'date',
      name: 'Date',
      selector: (row) => (row.date ? new Date(row.date).toLocaleDateString('en-GB') : 'N/A'),
      sortable: true
    },
    {
      id: 'lot_no',
      name: 'Lot No',
      selector: (row) => row.lot_no,
      sortable: true
    },
    {
      id: 'invoice_no',
      name: 'Invoice no',
      selector: (row) => row.invoice_no,
      sortable: true
    },
    {
      id: 'product_category_name',
      name: 'Product Category',
      selector: (row) => row.product_category_name,
      sortable: true
    },
    {
      id: 'shadeNo',
      name: 'Shade no',
      selector: (row) => row.shadeNo,
      sortable: true
    },
    {
      id: 'purchase_shade_no',
      name: 'Pur. Shade no',
      selector: (row) => row.purchase_shade_no,
      sortable: true
    },
    {
      id: 'length',
      name: 'Length',
      selector: (row) => `${Number(row.length).toFixed(2)} ${row.length_unit}`,
      sortable: true
    },
    {
      id: 'width',
      name: 'Width',
      selector: (row) => `${Number(row.width).toFixed(2)} ${row.width_unit}`,
      sortable: true
    },
    {
      id: 'quantity',
      name: 'Quantity',
      selector: (row) => row.quantity,
      sortable: true
    },
    {
      id: 'out_quantity',
      name: 'Out Quantity',
      selector: (row) => row.out_quantity ?? 0,
      sortable: true
    },
    {
      id: 'available_quantity',
      name: 'Available Quantity',
      selector: (row) => row.quantity - row.out_quantity,
      sortable: true
    },
    {
      id: 'total_length',
      name: 'Total Length',
      selector: (row) => Number(row.length * row.quantity).toFixed(2),
      sortable: true
    },
    {
      id: 'issue_length',
      name: 'Issue Length',
      selector: (row) => Number(row.length * row.out_quantity).toFixed(2),
      sortable: true
    },
    {
      id: 'area',
      name: 'Area (m²)',
      selector: (row) => row.area,
      sortable: true
    },
    {
      id: 'area_sq_ft',
      name: 'Area (sq. ft.)',
      selector: (row) => row.area_sq_ft,
      sortable: true
    }
  ];

  useEffect(() => {
    setSelectedColumns(allColumns.map((col) => col.id));
  }, []);

  const filteredColumns = allColumns.filter((col) => selectedColumns.includes(col.id));

  const handleColumnToggle = (columnId) => {
    setSelectedColumns((prev) => (prev.includes(columnId) ? prev.filter((id) => id !== columnId) : [...prev, columnId]));
  };

  const exportToCSV = () => {
    const csvData = filteredProducts.map((row, index) => ({
      'Sr No': index + 1,
      'User Name': JSON.parse(localStorage.getItem('user')).username || 'N/A',
      'User Email': JSON.parse(localStorage.getItem('user')).email || 'N/A',
      Vendor: row.supplier,
      'Lot No': row.lot_no,
      'Shade number': row.shadeNo,
      // 'Stock Code': `${row.stock_product?.shadeNo}-${row.stock_code}` || 'N/A',
      'Purchase Shade no.': row.purchase_shade_no,
      'Invoice No': row.invoice_no,
      Date: row.date,
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
      head: [['Sr No', 'User Name', 'Lot No', 'Stock Code', 'Invoice No', 'Date', 'Shade No', 'Pur. Shade No', 'Length', 'Width', 'Unit']],
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
          <div className="col-md-0 d-flex justify-content-end">
            <DropdownButton title="Display Columns" variant="secondary">
              <Dropdown.Menu style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {allColumns.map((col) => (
                  <Dropdown.Item key={col.id} as="div" onClick={(e) => e.stopPropagation()}>
                    <label className="d-flex align-items-center" style={{ cursor: 'pointer' }}>
                      <input type="checkbox" checked={selectedColumns.includes(col.id)} onChange={() => handleColumnToggle(col.id)} />
                      <span className="ms-2">{col.name}</span>
                    </label>
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </DropdownButton>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <div className="card border-0 shadow-none" style={{ background: '#f5f0e6' }}>
            {loading ? (
              <Skeleton count={10} />
            ) : (
              <DataTable columns={filteredColumns} data={filteredProducts} pagination highlightOnHover customStyles={customStyles} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowProduct;
