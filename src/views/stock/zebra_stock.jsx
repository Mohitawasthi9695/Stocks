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
import 'jspdf-autotable';
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
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/category/getstock/5`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        console.log('stocks data:', response.data);
        const productsWithArea = response.data.map((product) => {
          const areaM2 = product.length * product.width * product.quantity;
          const areaSqFt = areaM2 * 10.7639;
          const dateLocal = new Date(product.date).toLocaleDateString('en-GB'); // Convert date to local date format
          return {
            ...product,
            area: areaM2.toFixed(3),
            area_sq_ft: areaSqFt.toFixed(3),
            dateLocal, // Add new property to product object
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
      Object.values(product).some((value) => value?.toString()?.toLowerCase().includes(lowercasedQuery))
    );
    setFilteredProducts(filtered);
  }, [searchQuery, products]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const searchFields = [
    'dateLocal',
    'invoice_no',
    'purchase_shade_no',
    'shadeNo',
    'lot_no',
    'length',
    'width',
    'invoice_no',
    'lot_no',
    'product_category_name',
    'shadeNo',
    'purchase_shade_no',
  ];
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
      selector: (row) => (row.date ? new Date(row.date).toLocaleDateString('en-GB') : 'N/A'),
      sortable: true
    },
    {
      id: 'stock_code',
      name: 'Stock Code',
      selector: (row) => row.stock_code,
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
      id: 'product_category',
      name: 'Product Category',
      selector: (row) => row.product_category_name,
      sortable: true
    },
    {
      id: 'shade_no',
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
      name: 'Avaible Quantity',
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
      id: 'area_m2',
      name: 'm²',
      selector: (row) => row.area,
      sortable: true
    },
    {
      id: 'area_ft2',
      name: 'ft²',
      selector: (row) => row.area_sq_ft,
      sortable: true
    },
    {
      id: 'remark',
      name: 'Remark',
      selector: (row) => row.remark,
      sortable: true
    }
  ];


  const exportToCSV = () => {
    if (filteredProducts.length === 0) {
      alert('No data available for export.');
      return;
    }

   
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
      'Unit',
      'Quantity',
      'Out Quantity',
      'Available Quantity',
      'Area (m²)',
      'Area (sq. ft.)'
    ];


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
      'Available Quantity': row.quantity - row.out_quantity ?? 0,
      'Area (m²)': row.area ?? 'N/A',
      'Area (sq. ft.)': row.area_sq_ft ?? 'N/A'
    }));

    
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
      orientation: 'landscape', // Keeps a wider layout
      unit: 'mm',
      format: 'a4'
    });

    doc.text('Stocks List', 14, 10);

    const tableColumn = [
      'Sr No',
      'Invoice No',
      'Date',
      'Lot No',
      'Stock Code',
      'Shade No',
      'Pur. Shade No',
      'Length',
      'Width',
      'Unit',
      'Quantity',
      'Out Qty',
      'Avail Qty',
      'Area (m²)',
      'Area (sq. ft.)'
    ];

    const tableRows = filteredProducts.map((row, index) => [
      index + 1,
      row.invoice_no ?? 'N/A',
      row.date ? new Date(row.date).toLocaleDateString('en-GB') : 'N/A',
      row.lot_no ?? 'N/A',
      `${row.stock_code ?? 'N/A'}`,
      row.shadeNo ?? 'N/A',
      row.purchase_shade_no ?? 'N/A',
      row.length ?? 'N/A',
      row.width ?? 'N/A',
      row.unit ?? 'N/A',
      row.quantity ?? 'N/A',
      row.out_quantity ?? 0,
      (row.quantity - row.out_quantity) ?? 0,
      row.area ?? 'N/A',
      row.area_sq_ft ?? 'N/A'
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: {
        fontSize: 8, // ⬇️ Slightly reduced font size for better fit
        cellPadding: 1.5, // ⬇️ Reduced padding to fit more content
        valign: 'middle',
        halign: 'center',
        overflow: 'linebreak',
        lineWidth: 0.2,
        lineColor: [0, 0, 0]
      },
      headStyles: {
        fillColor: [22, 160, 133],
        textColor: [255, 255, 255],
        fontSize: 9,
        halign: 'center',
        lineWidth: 0.4
      },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      tableLineColor: [0, 0, 0],
      tableLineWidth: 0.2,
      columnStyles: {
        0: { cellWidth: 10 }, // Sr No
        1: { cellWidth: 20 }, // Invoice No
        2: { cellWidth: 18 }, // Date
        3: { cellWidth: 18 }, // Lot No
        4: { cellWidth: 25 }, // Stock Code
        5: { cellWidth: 20 }, // Shade No
        6: { cellWidth: 20 }, // Purchase Shade No
        7: { cellWidth: 15 }, // Length
        8: { cellWidth: 15 }, // Width
        9: { cellWidth: 15 }, // Unit
        10: { cellWidth: 15 }, // Quantity
        11: { cellWidth: 18 }, // Out Quantity
        12: { cellWidth: 18 }, // Available Quantity
        13: { cellWidth: 22 }, // Area (m²) - FIXED LINE ISSUE HERE
        14: { cellWidth: 22 } // Area (sq. ft.)
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


  useEffect(() => {
    setSelectedColumns(columns.map((col) => col.id));
  }, []);

  const filteredColumns = columns.filter((col) => selectedColumns.includes(col.id));
  const handleColumnToggle = (columnId) => {
    setSelectedColumns((prev) => (prev.includes(columnId) ? prev.filter((id) => id !== columnId) : [...prev, columnId]));
  };

  return (
    <div className="container-fluid pt-4" style={{ border: '3px dashed #14ab7f', borderRadius: '8px', background: '#ff9d0014' }}>
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
              <>
                <DataTable
                  columns={filteredColumns}
                  data={filteredProducts}
                  pagination
                  highlightOnHover
                  striped
                  responsive
                  customStyles={customStyles}
                  defaultSortFieldId={1}
                />
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
