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

const Old_stock = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStocksData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/oldstocks`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        console.log('stocks data:', response.data);
        const productsWithArea = response.data.data.map((product) => {
          // Check for unit type and calculate accordingly
          let areaM2, areaSqFt;
          if (product.unit === 'meter') {
            // Length and width are in meters
            areaM2 = product.length * product.width;
            areaSqFt = areaM2 * 10.7639;
          } else if (product.unit === 'inches') {
            // Convert inches to meters for calculation
            const lengthInMeters = product.length * 0.0254;
            const widthInMeters = product.width * 0.0254;
            areaM2 = lengthInMeters * widthInMeters;
            areaSqFt = areaM2 * 10.7639;
          } else {
            console.warn(`Unknown unit type: ${product.unit}`);
            areaM2 = 0;
            areaSqFt = 0;
          }

          // Return the modified product object
          return {
            ...product,
            area: areaM2.toFixed(3),
            area_sq_ft: areaSqFt.toFixed(3),
          };
        });
        setProducts(productsWithArea);
        setFilteredProducts(productsWithArea);
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
      ['width', 'length', 'invoice_no', 'lot_no']
        .map((key) => product[key]?.toString()?.toLowerCase() || '')
        .some((value) => value.includes(lowercasedQuery))
    );
    setFilteredProducts(filtered);
  }, [searchQuery, products]);

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
      name: 'Shade No',
      selector: (row) => row.product?.shadeNo || 'N/A',
      sortable: true
    },
    {
      name: 'Pur. Shade No',
      selector: (row) => row.product?.purchase_shade_no || 'N/A',
      sortable: true
    },
    {
      name: 'Length',
      selector: (row) => row.length,
      sortable: true
    },
    {
      name: 'Width',
      selector: (row) => row.width,
      sortable: true
    },
    {
      name: 'Unit',
      selector: (row) => row.unit,
      sortable: true
    },
    {
      name: 'Area (m²)',
      selector: (row) => row.area,
      sortable: true
    },
    {
      name: 'Area (sq. ft.)',
      selector: (row) => row.area_sq_ft,
      sortable: true
    }
  ];
  const exportToCSV = () => {
    const csvData = filteredProducts.map((row, index) => ({
      'Sr No': index + 1,
      'User Name': JSON.parse(localStorage.getItem('user')).username || 'N/A',
      'User Email': JSON.parse(localStorage.getItem('user')).email || 'N/A',
      'Lot No': row.lot_no,
      'Stock Code': `${row.product?.shadeNo}-${row.stock_code}` || 'N/A',
      'Invoice No': row.stock_invoice?.invoice_no || 'N/A',
      'Date': row.stock_invoice?.date || 'N/A',
      'Shade No': row.product?.shadeNo || 'N/A',
      'Pur. Shade No': row.product?.purchase_shade_no || 'N/A',
      'Length': row.length,
      'Width': row.width,
      'Unit': row.unit,
      'Area (m²)': row.area,
      'Area (sq. ft.)': row.area_sq_ft
    }));
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'stocks_list.csv');
  };
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text('stocks List', 20, 10);
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
          'Area (m²)',
          'Area (sq. ft.)'
        ]
      ],
      body: filteredProducts.map((row, index) => [
        index + 1,
        JSON.parse(localStorage.getItem('user')).username || 'N/A',
        row.lot_no,
        `${row.product?.shadeNo}-${row.stock_code}` || 'N/A',
        row.stock_invoice?.invoice_no || 'N/A',
        row.stock_invoice?.date || 'N/A',
        row.product?.shadeNo || 'N/A',
        row.product?.purchase_shade_no || 'N/A',
        row.length,
        row.width,
        row.unit,
        row.area,
        row.area_sq_ft
      ])
    });
    doc.save('stocks_list.pdf');
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
        '& svg': {
          fill: 'white',
        },
        '&:focus': {
          outline: 'none',
          boxShadow: '0 0 5px rgba(255,255,255,0.5)',
        },
      },
    },
  };


  return (
    <div className="container-fluid pt-4" style={{ border: '3px dashed #14ab7f', borderRadius: '8px',background: '#ff9d0014' }}>
      <div className="row mb-3">
        <div className="col-md-4">
          <input
            type="text"
            placeholder="Search..."
            id="search"
            value={searchQuery}
            onChange={handleSearch}
            className="form-control"
            style={{ borderRadius: '5px' }}
          />
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <div className="card border-0 shadow-none" style={{ background: '#f5f0e6' }}>
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
            {loading ? (
              <div>
                {[...Array(8)].map((_, index) => (
                  <div key={index} style={{ display: 'flex', gap: '10px', padding: '10px' }}>
                    <Skeleton width={50} height={20} />
                    <Skeleton width={200} height={20} />
                    <Skeleton width={200} height={20} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="card-body p-0">
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

export default Old_stock;
