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
import { FiPlus } from 'react-icons/fi';
import { FiEdit } from 'react-icons/fi';
import 'jspdf-autotable';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';

const ShowProduct = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [rackInputs, setRackInputs] = useState({});
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);

  const categoryId = 2; // Wooden category ID
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
        setProducts(response.data);
        setFilteredProducts(response.data);

        // Correct rack initialization
        const initialRackInputs = {};
        response.data.forEach((product) => {
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

  const handleRackUpdate = async (id, currentRack) => {
    Swal.fire({
      title: 'Update Rack',
      input: 'text',
      inputPlaceholder: 'Enter new rack value...',
      inputValue: currentRack || '', // Ensure empty string if undefined
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
            setRackInputs((prev) => ({
              ...prev,
              [id]: result.value
            }));
            toast.success('Rack updated successfully!');
          }
        } catch (error) {
          console.error('Error updating rack:', error);
          toast.error('Failed to update rack. Please try again.');
        }
      }
    });
  };

  const handleRackChange = (id, value) => {
    setRackInputs((prev) => ({
      ...prev,
      [id]: value
    }));
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
      name: 'date',
      selector: (row) => row.date,
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
    {
      name: 'Transfer Pcs',
      selector: (row) => row.transfer,
      sortable: true
    },
    {
      name: 'Avaible Pcs',
      selector: (row) => (row.pcs - (row.out_pcs + row.transfer)) ?? 0, 
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
            <button className="btn btn-sm btn-success" onClick={() => handleRackUpdate(row.id, '')} title="Add Rack">
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
  ]

  const exportToCSV = () => {
    const csvData = filteredProducts.map((row, index) => ({
      'Sr No': index + 1,
      'Date': row.date,
      'User Name': JSON.parse(localStorage.getItem('user')).username || 'N/A',
      'User Email': JSON.parse(localStorage.getItem('user')).email || 'N/A',
      'Lot No': row.lot_no,
      'Stock Code': `${row.stock_product?.shadeNo}-${row.stock_code}` || 'N/A',
      'Invoice No': row.gate_pass_no,
      'Shade No':  row.shadeNo,
      'Pur. Shade No': row.purchase_shade_no,
      Length: row.length,
      Width: row.width,
      Unit: row.unit
    }));
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
      'Sr No',
      'Date',
      'User Name',
      'Lot No',
      'Stock Code',
      'Invoice No',
      'Date',
      'Shade No',
      'Pur. Shade No',
      'Length',
      'Width',
      'Rack'
    ];

    const tableRows = filteredProducts.map((row, index) => [
      index + 1,
      row.date,
      JSON.parse(localStorage.getItem('user')).username || 'N/A',
      row.lot_no,
      row.stock_code,
      row.gate_pass_no,
      row.date ? new Date(row.date).toLocaleDateString('en-GB') : 'N/A',
      row.purchase_shade_no,
      row.purchase_shade_no,
      row.length,
      row.width,
      row.rack
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: { fontSize: 6 },
      headStyles: { fillColor: [22, 160, 133], textColor: [255, 255, 255] },
      columnStyles: { 16: { cellWidth: 15 }, 17: { cellWidth: 15 } }, // Force columns to fit
      theme: 'grid'
    });

    doc.save('stocks_list.pdf');
  };

  const customStyles = {
    table: {
      style: {
        borderCollapse: 'separate', 
        borderSpacing: 0 
      }
    },
    header: {
      style: {
        backgroundColor: '#2E8B57',
        color: '#fff',
        fontSize: '18px',
        fontWeight: 'bold',
        padding: '10px',
        borderRadius: '8px 8px 0 0' 
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
        borderRight: '1px solid #e0e0e0' 
      },
      lastCell: {
        style: {
          borderRight: 'none' 
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
          <div className="d-flex justify-content-end mt-4 mt-md-0" style={{
            marginBottom: '-10px'
          }}>
            <button className="btn btn-info" onClick={exportToCSV}>
              <FaFileCsv className="w-5 h-5 me-1"  style={{
                width: isMobile ? '20px' : '0px',
                height: isMobile ? '25px' : '0px'
              }}/> 
              <span className='d-none d-md-inline'>
              Export as CSV
              </span>
            </button>
            <button className="btn btn-info" onClick={exportToPDF}>
              <AiOutlineFilePdf className="w-5 h-5 me-1" style={{
                width: isMobile ? '20px' : '0px',
                height: isMobile ? '25px' : '0px'
              }}/> 
              <span className='d-none d-md-inline'>
              Export as PDF
              </span>
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