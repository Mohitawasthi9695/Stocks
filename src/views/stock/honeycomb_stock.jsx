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

const ShowProduct = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStocksData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/category/getstock/4`, {
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
    const filtered = products.filter((product) => {
      const formattedDate = product.date ? new Date(product.date).toLocaleDateString('en-GB') : 'N/A';
      return Object.values(product).some((value) => {
        if (value === product.date) return formattedDate.includes(lowercasedQuery);
        return value?.toString()?.toLowerCase().includes(lowercasedQuery);
      });
    });
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
      name: 'Date',
      selector: (row) => 
        row.date ? new Date(row.date).toLocaleDateString('en-GB') : 'N/A', 
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
      name: 'Date',
      selector: (row) => row.date,
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
      name: 'box',
      selector: (row) => row.quantity,
      sortable: true
    },
    {
      name: 'Out box',
      selector: (row) => row.out_quantity ?? 0,
      sortable: true
    },
    {
      name: 'Balance boxes',
      selector: (row) => row.quantity - row.out_quantity,
      sortable: true
    }
  ];

  const exportToCSV = () => {
      if (filteredProducts.length === 0) {
        alert('No data available for export.');
        return;
      }
  
      // ✅ Define CSV Headers (Same as PDF for consistency)
      const csvHeaders = [
        'Sr No',
        'Invoice No',
        'Date',
        'Lot No',
        'Stock Code',
        'Shade No',
        'Pur. Shade No',
        'Length',
        'Width',
        // 'Unit',
        'Quantity',
        'Out Quantity',
        'Balance boxes',

      ];
  
      // ✅ Convert Data to CSV Format
      const csvData = filteredProducts.map((row, index) => ({
        'Sr No': index + 1,
        'Invoice No': row.invoice_no ?? 'N/A',
        Date: row.date ? new Date(row.date).toLocaleDateString('en-GB') : 'N/A',
        'Lot No': row.lot_no ?? 'N/A',
        'Stock Code': `${row.stock_product?.shadeNo ?? 'N/A'}-${row.stock_code ?? 'N/A'}`,
        'Shade No': row.shadeNo ?? 'N/A',
        'Pur. Shade No': row.purchase_shade_no ?? 'N/A',
        Length: row.length ?? 'N/A',
        Width: row.width ?? 'N/A',
        Unit: row.unit ?? 'N/A',
        Quantity: row.quantity ?? 'N/A',
        'Out Quantity': row.out_quantity ?? 0,
        'Balance boxes': row.quantity - row.out_quantity ?? 0,

      }));
  
      // ✅ Convert to CSV String and Trigger Download
      const csvString = Papa.unparse({
        fields: csvHeaders,
        data: csvData
      });
  
      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.setAttribute('download', 'stocks_list.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
    const exportToPDF = () => {
      if (filteredProducts.length === 0) {
        alert('No data available for export.');
        return;
      }
    
      const doc = new jsPDF({
        orientation: 'landscape', // Landscape for better table fitting
        unit: 'mm',
        format: 'a4'
      });
    
      doc.text('Stocks List', 14, 10);
    
      const tableColumn = [
        'Sr No', 'Invoice No', 'Date', 'Lot No', 'Stock Code', 'Shade No', 
        'Pur. Shade No', 'Length', 'Width', 'Quantity', 'Out Qty', 'Avail Qty'
      ];
    
      const tableRows = filteredProducts.map((row, index) => [
        index + 1,
        row.invoice_no ?? 'N/A',
        row.date ? new Date(row.date).toLocaleDateString('en-GB') : 'N/A',
        row.lot_no ?? 'N/A',
        `${row.stock_product?.shadeNo ?? 'N/A'}-${row.stock_code ?? 'N/A'}`,
        row.shadeNo ?? 'N/A',
        row.purchase_shade_no ?? 'N/A',
        row.length ?? 'N/A',
        row.width ?? 'N/A',
        row.quantity ?? 'N/A',
        row.out_quantity ?? 0,
        row.quantity - row.out_quantity ?? 0,
      ]);
    
      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 20,
        styles: {
          fontSize: 8,
          cellPadding: 1.5,
          valign: 'middle',
          halign: 'center',
          overflow: 'linebreak',
          lineWidth: 0.2, // ✅ Ensures vertical and horizontal lines
          lineColor: [0, 0, 0] // ✅ Black border color
        },
        headStyles: {
          fillColor: [22, 160, 133],
          textColor: [255, 255, 255],
          fontSize: 9,
          halign: 'center',
          lineWidth: 0.4
        },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        tableLineColor: [0, 0, 0], // ✅ Black grid lines
        tableLineWidth: 0.2, // ✅ Thin grid lines
        columnStyles: {
          0: { cellWidth: 'auto' },
          1: { cellWidth: 'auto' },
          2: { cellWidth: 'auto' },
          3: { cellWidth: 'auto' },
          4: { cellWidth: 'auto' },
          5: { cellWidth: 'auto' },
          6: { cellWidth: 'auto' },
          7: { cellWidth: 'auto' },
          8: { cellWidth: 'auto' },
          9: { cellWidth: 'auto' },
          10: { cellWidth: 'auto' },
          11: { cellWidth: 'auto' }
        },
        margin: { top: 20, left: 10, right: 10 }
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
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <div className="card border-0 shadow-none" style={{ background: '#f5f0e6' }}>
            {loading ? (
              <Skeleton count={10} />
            ) :
              (
                <>
                  <DataTable columns={columns} data={filteredProducts} pagination highlightOnHover customStyles={customStyles} />
                  {searchQuery && (
                    <div style={{ padding: '10px', textAlign: 'right', fontWeight: 'bold', fontSize: '16px', background: '#ddd' }}>
                      Total Boxes: {totalBoxes}
                    </div>
                  )}
                </>
              )
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowProduct;