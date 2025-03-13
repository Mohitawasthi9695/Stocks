import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import axios from 'axios';
import Papa from 'papaparse';
import { saveAs } from 'file-saver';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { FaFileCsv } from 'react-icons/fa';
import { AiOutlineFilePdf } from 'react-icons/ai';
import { FiSave, FiPlus } from 'react-icons/fi';
import Swal from 'sweetalert2';
import { FiEdit } from 'react-icons/fi';

const ShowProduct = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [rackInputs, setRackInputs] = useState({});
  const categoryId = 5; // Hardcoded for now
  useEffect(() => {
    const fetchStocksData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/godownstock`, {
          params: {
            category_id: categoryId
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        console.log('stocks data:', response.data);
        const productsWithArea = response.data.map((product) => {
          const areaM2 = product.length * product.width;
          const areaSqFt = areaM2 * 10.7639;
          return {
            ...product,
            area: areaM2.toFixed(3),
            area_sq_ft: areaSqFt.toFixed(3)
          };
        });
        setProducts(productsWithArea);
        setFilteredProducts(productsWithArea);
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

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };
  const handleRackChange = (id, value) => {
    setRackInputs((prev) => ({
      ...prev,
      [id]: value
    }));
  };
  const handleRackUpdate = async (id, currentRack) => {
    Swal.fire({
      title: 'Update Rack',
      input: 'text',
      inputPlaceholder: 'Enter new rack value...',
      inputValue: currentRack, // Set default value to current rack
      showCancelButton: true,
      confirmButtonText: 'Save',
      cancelButtonText: 'Cancel',
      preConfirm: (value) => {
        if (!value) {
          Swal.showValidationMessage('Rack value cannot be empty!');
        }
        return value;
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.put(
            `${import.meta.env.VITE_API_BASE_URL}/api/godownstock/${id}`,
            { rack: result.value },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
              }
            }
          );

          if (response.status === 200) {
            setProducts((prevProducts) =>
              prevProducts.map((product) => (product.id === id ? { ...product, rack: result.value } : product))
            );
            toast.success('Rack updated successfully!');
          }
        } catch (error) {
          console.error('Error updating rack:', error);
          toast.error('Failed to update rack. Please try again.');
        }
      }
    });
  };
  const columns = [
    {
      name: 'Sr No',
      selector: (_, index) => index + 1,
      sortable: true
    },
    {
      name: 'Stock Code',
      selector: (row) => row.stock_code,
      sortable: true
    },
    {
      name: 'Lot No',
      selector: (row) => row.lot_no,
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
    { name: 'Width', selector: (row) => `${row.width}  ${row.width_unit}`, sortable: true },
    { name: 'Total Length', selector: (row) => `${row.length}  ${row.length_unit}`, sortable: true },
    { name: 'Length', selector: (row) => `${row.out_length}  ${row.length_unit}`, sortable: true },
    {
      name: 'Area (m²)',
      selector: (row) => row.area,
      sortable: true
    },
    {
      name: 'Area (sq. ft.)',
      selector: (row) => row.area_sq_ft,
      sortable: true
    },
    {
      name: 'Wastage',
      selector: (row) => row.wastage,
      sortable: true
    },
    {
      name: 'Rack',
      cell: (row) => (
        <div className="d-flex align-items-center w-100" style={{ justifyContent: row.rack ? 'space-between' : 'center' }}>
          {row.rack ? (
            <>
              <span style={{ paddingLeft: '15px', minWidth: '50px', textAlign: 'left' }}>{row.rack}</span>
              <button className="btn btn-sm btn-warning" onClick={() => handleRackUpdate(row.id, row.rack)} title="Edit Rack">
                <FiEdit /> {/* Pencil Icon */}
              </button>
            </>
          ) : (
            <button className="btn btn-sm btn-success" onClick={() => handleRackUpdate(row.id, row.rack)} title="Add Rack">
              <FiPlus /> {/* Add Icon */}
            </button>
          )}
        </div>
      ),
      sortable: false,
      width: '150px'
    },
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
            {row.status === 1 ? 'Approved' : row.status === 2 ? 'Sold Out' : 'Pending'}
          </span>
        </div>
      )
    }
  ];
  const exportToCSV = () => {
    const csvData = filteredProducts.map((row, index) => ({
      'Sr No': index + 1,
      'User Name': JSON.parse(localStorage.getItem('user'))?.username || 'N/A',
      'User Email': JSON.parse(localStorage.getItem('user'))?.email || 'N/A',
      'Lot No': row.lot_no || 'N/A',
      'Stock Code': row.stock_code || 'N/A',
      'Invoice No': row.gate_pass_no,
      Date: row.stock_invoice?.date || 'N/A',
      'Shade No': row.shadeNo || 'N/A',
      'Pur. Shade No': row.purchase_shade_no || 'N/A',
      Width: row.width || 'N/A',
      Length: row.length || 'N/A',
      Unit: row.unit || 'N/A',
      'Area (m²)': row.area || 'N/A',
      'Area (sq. ft.)': row.area_sq_ft || 'N/A',
      Wastage: row.wastage || 'N/A',
      Rack: row.rack || 'N/A',
      Status: row.status === 1 ? 'Approved' : row.status === 2 ? 'Sold Out' : 'Pending'
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'stocks_list.csv');
  };



  const exportToPDF = () => {
    if (filteredProducts.length === 0) {
      // toast
      alert('No data available for export.');
      return;
    }

    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    const tableColumn = [
      'Sr No',
      'User Name',
      'Lot No',
      'Stock Code',
      'Gate pass No',
      'Date',
      'Shade No',
      'Pur. Shade No',
      'Width',
      'Length',
      'Area (m²)',
      'Area (sq. ft.)',
      'Wastage',
      'Rack',
      'Status'
    ];

    const tableRows = filteredProducts.map((row, index) => [
      index + 1,
      JSON.parse(localStorage.getItem('user'))?.username || 'N/A',
      row.lot_no || 'N/A',
      row.stock_code || 'N/A',
      row.gate_pass_no,
      row.date ? new Date(row.date).toLocaleDateString('en-GB') : 'N/A',
      row.shadeNo || 'N/A',
      row.purchase_shade_no || 'N/A',
      row.width || 'N/A',
      row.length || 'N/A',
      row.area || 'N/A',
      row.area_sq_ft || 'N/A',
      row.wastage || 'N/A',
      row.rack || 'N/A',
      row.status === 1 ? 'Approved' : row.status === 2 ? 'Sold Out' : 'Pending'
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [22, 160, 133], textColor: [255, 255, 255] },
      columnStyles: { 16: { cellWidth: 15 }, 17: { cellWidth: 15 } }, // Force columns to fit
      theme: 'grid',
    });
    doc.save('stocks_list.pdf')
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
              <>
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
                  {searchQuery && (
                    <div style={{ padding: '10px', textAlign: 'right', fontWeight: 'bold', fontSize: '16px', background: '#ddd' }}>
                      Total Boxes: {totalBoxes}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowProduct;
