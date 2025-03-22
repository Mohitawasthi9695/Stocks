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
import { color } from 'd3';

const ShowProduct = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStocksData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/stockout`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('stocks data:', response.data);
        setProducts(response.data.data);
        setFilteredProducts(response.data.data);
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
    { name: 'Lot No', selector: (row) => row.lot_no, sortable: true },
    { name: 'Invoice No', selector: (row) => row.invoice_no, sortable: true },
    { name: 'Date', selector: (row) => row.date, sortable: true },
    { name: 'Category', selector: (row) => row.product_category, sortable: true },
    {
      name: 'Stock Code',
      selector: (row) => row.stock_code || 'N/A',
      sortable: true
    },
    { name: 'Shade No', selector: (row) => row.product_shade_no, sortable: true },
    { name: 'Pur. Shade No', selector: (row) => row.product_pur_shade_no, sortable: true },
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
    { name: 'Pcs', selector: (row) => row.pcs, sortable: true },
    { name: 'Rate', selector: (row) => row.rate, sortable: true },
    { name: 'Amount', selector: (row) => row.amount, sortable: true },
    { name: 'Rack', selector: (row) => row.rack, sortable: true },
    { name: 'Area (m²)', selector: (row) => row.area, sortable: true },
    { name: 'Area (sq. ft.)', selector: (row) => row.area_sq_ft, sortable: true },
    {
      name: 'Status',
      selector: (row) => (row.status === 1 ? 'inactive' : 'active'),
      sortable: true,
      cell: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span
            className={`badge ${row.status === 1 ? 'bg-success' : 'bg-danger'}`}
            style={{
              padding: '5px 10px',
              borderRadius: '8px',
              whiteSpace: 'nowrap'
            }}
          >
            {row.status === 1 ? 'Approved' : 'Pending'}
          </span>
        </div>
      )
    }
  ];

  const exportToCSV = () => {
    const csv = Papa.unparse(filteredProducts);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'stocks_list.csv');
  };
  const exportToPDF = () => {
    const doc = new jsPDF('l', 'mm', 'a4'); // Landscape mode for better table fitting
  
    // Add Title
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Stocks List', 14, 15);
  
    // Define Table Headers (Removed "Lot No." and "Area (m²)")
    const headers = [
      [
        'Sr No',
        'Invoice No',
        'Date',
        'Category',
        'Stock Code',
        'Shade No',
        'Pur. Shade No',
        'Length',
        'Width',
        'Pcs',
        'Rate',
        'Amount',
        'Rack',
        'Status'
      ]
    ];
  
    // Map the filteredProducts to rows (Excluded "Lot No." and "Area (m²)")
    const rows = filteredProducts.map((product, index) => [
      index + 1,
      product.invoice_no,
      product.date,
      product.product_category,
      product.stock_code || 'N/A',
      product.product_shade_no,
      product.product_pur_shade_no,
      `${Number(product.length).toFixed(2)} ${product.length_unit}`,
      `${Number(product.width).toFixed(2)} ${product.width_unit}`,
      product.pcs,
      product.rate,
      product.amount,
      product.rack,
      product.status === 1 ? 'Approved' : 'Pending'
    ]);
  
    // Generate the table in the PDF
    doc.autoTable({
      head: headers,
      body: rows,
      startY: 25,
      theme: 'grid',
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [32, 178, 170], textColor: '#FFF', fontStyle: 'bold' }, // LightSeaGreen header
      alternateRowStyles: { fillColor: [240, 255, 244] }, // Alternating row colors for readability
      columnStyles: {
        0: { cellWidth: 12 }, // Sr No
        1: { cellWidth: 20 }, // Invoice No
        2: { cellWidth: 22 }, // Date
        3: { cellWidth: 20 }, // Category
        4: { cellWidth: 20 }, // Stock Code
        5: { cellWidth: 22 }, // Shade No
        6: { cellWidth: 25 }, // Pur. Shade No
        7: { cellWidth: 20 }, // Length
        8: { cellWidth: 20 }, // Width
        9: { cellWidth: 12 }, // Pcs
        10: { cellWidth: 18 }, // Rate
        11: { cellWidth: 25 }, // Amount
        12: { cellWidth: 15 }, // Rack
        13: { cellWidth: 22 } // Status
      }
    });
  
    // Save the PDF
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
            className="form-control"
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
          <div className="card border-0 shadow-none" style={{ background: '#f5f0e6' }}>
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

export default ShowProduct;
