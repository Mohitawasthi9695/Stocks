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
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/category/getstock/2`, {
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

  const columns = [
    {
      id: 'sr_no',
      name: 'Sr No',
      selector: (_, index) => index + 1,
      sortable: true
    },
    {
      id: 'date',
      name: 'Date',
      selector: (row) => 
        row.date ? new Date(row.date).toLocaleDateString('en-GB') : 'N/A', 
      sortable: true
    },
    {
      id: 'stock_code',
      name: 'Stock Code',
      selector: (row) => row.stock_code,
      sortable: true
    },
    {
      id: 'vendor_name',
      name: 'Vendor name',
      selector: (row) => row.supplier,
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
      id: 'lot_no',
      name: 'Lot No',
      selector: (row) => row.lot_no,
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
      id :'width',
      name: 'Width',
      selector: (row) => `${Number(row.width).toFixed(2)} ${row.width_unit}`,
      sortable: true
    },
    {
      id: 'pcs',
      name: 'Pcs',
      selector: (row) => row.pcs,
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
      id: 'avaible_quantity',
      name: 'Avaible Quantity',
      selector: (row) => row.quantity - row.out_quantity,
      sortable: true
    },
    {
      id: 'remark',
      name: 'Remark',
      selector: (row) => row.remark,
      sortable: true
    }
  ];

  useEffect(() => {
    setSelectedColumns(columns.map((col) => col.id));
  }, []);

  const filteredColumns = columns.filter((col) => selectedColumns.includes(col.id));

  const handleColumnToggle = (columnId) => {
    setSelectedColumns((prev) => (prev.includes(columnId) ? prev.filter((id) => id !== columnId) : [...prev, columnId]));
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
 const exportToCSV = () => {
    const csvData = filteredProducts.map((row, index) => ({
      'Sr No': index + 1,
      'Date':row.date ? new Date(row.date).toLocaleDateString('en-GB') : 'N/A', 
      'Vendor name':row.supplier??'N/A',
      'User Name': JSON.parse(localStorage.getItem('user'))?.username ?? 'N/A',
      'User Email': JSON.parse(localStorage.getItem('user'))?.email ?? 'N/A',
      'Lot No': row.lot_no ?? 'N/A',
      'Stock Code': `${row.stock_product?.shadeNo ?? 'N/A'}-${row.stock_code ?? 'N/A'}`,
      'Invoice No': row.invoice_no ?? 'N/A',
      'date': row.date ? new Date(row.date).toLocaleDateString('en-GB') : 'N/A',
      'Shade No': row.shadeNo ?? 'N/A',
      'Pur. Shade No': row.purchase_shade_no ?? 'N/A',
      'Length': row.length ?? 'N/A',
      'Width': row.width ?? 'N/A',
      'Quantity': row.quantity ?? 'N/A',
      'Out Quantity': row.out_quantity ?? 0,
      'Available Quantity': row.quantity - row.out_quantity,
      'Total Length': Number(row.length * row.quantity).toFixed(2),
      'Issue Length': Number(row.length * row.out_quantity).toFixed(2),
      'Area (m²)': row.area ?? 'N/A',
      'Area (sq. ft.)': row.area_sq_ft ?? 'N/A'
    }));

    if (csvData.length === 0) {
      alert('No data available for export.');
      return;
    }

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'stocks_list.csv');
  };

  const exportToPDF = () => {
    if (filteredProducts.length === 0) {
      alert('No data available for export.');
      return;
    }
  
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });
  
    doc.text('Stocks List', 14, 10);
  
    const tableColumn = [
      'Sr No','Date' ,'Vendor name','User Name', 'Lot No', 'Stock Code', 'Invoice No', 'Date',
      'Shade No', 'Pur. Shade No', 'Length', 'Width', 'Unit', 'Quantity',
      'Out Quantity', 'Available Quantity', 'Total Length', 'Issue Length',
    ];
  
    const tableRows = filteredProducts.map((row, index) => [
      index + 1,
      row.date ? new Date(row.date).toLocaleDateString('en-GB') : 'N/A', 
      row.supplier ??'N/A',
      JSON.parse(localStorage.getItem('user'))?.username ?? 'N/A',
      row.lot_no ?? 'N/A',
      `${row.stock_product?.shadeNo ?? 'N/A'}-${row.stock_code ?? 'N/A'}`,
      row.invoice_no ?? 'N/A',
      row.date ? new Date(row.date).toLocaleDateString('en-GB') : 'N/A',
      row.shadeNo ?? 'N/A',
      row.purchase_shade_no ?? 'N/A',
      row.length ?? 'N/A',
      row.width ?? 'N/A',
      row.unit || 'N/A',  // ✅ Fixed: Unit now included
      row.quantity ?? 'N/A',
      row.out_quantity ?? 0,
      row.quantity - row.out_quantity,
      Number(row.length * row.quantity).toFixed(2),
      Number(row.length * row.out_quantity).toFixed(2),
  
    ]);
  
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: { fontSize: 6 },
      headStyles: { fillColor: [22, 160, 133], textColor: [255, 255, 255] },
      columnStyles: { 16: { cellWidth: 15 }, 17: { cellWidth: 15 } }, // Force columns to fit
      theme: 'grid',
    });
  
    doc.save('stocks_list.pdf');
  };
  
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
                {columns.map((col) => (
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
              <>
                <DataTable columns={filteredColumns} data={filteredProducts} pagination highlightOnHover customStyles={customStyles} />
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