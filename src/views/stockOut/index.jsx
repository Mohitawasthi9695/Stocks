import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Button, Modal, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MdEdit, MdDelete, MdPersonAdd, MdPlusOne, MdAdd, MdPrint } from 'react-icons/md';
import { FaEye } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import StockOutInvoicePDF from 'components/StockOutInvoicePDF';
import { AiOutlineFilePdf } from 'react-icons/ai';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { FaFileExcel } from 'react-icons/fa';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import PdfPreview from 'components/PdfPreview';
import Papa from 'papaparse';
import 'jspdf-autotable';
import { FaFileCsv } from 'react-icons/fa';
import StockOutInvoiceThermalPDF from 'components/StockOutInvoiceThermalPDF';

const Index = () => {
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [invoiceAllDetails, setInvoiceAllDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [showThermalPdfModal, setShowThermalPdfModal] = useState(false);


  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/godownstockout`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        const invoicesDetails = response.data.data;
        console.log(invoicesDetails);
        setInvoiceAllDetails(invoicesDetails);
        setInvoices(invoicesDetails);
        setFilteredInvoices(invoicesDetails);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, []);

  useEffect(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
  }, [searchQuery, invoices]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const downloadExcel = (row) => {
    const fullInvoice = invoiceAllDetails.find((invoice) => invoice.id === row.id);

    if (!fullInvoice || !fullInvoice.all_stocks) {
      console.error('Godown data not found for this row:', row);
      return;
    }

    // Extract required data
    const extractedData = fullInvoice.all_stocks.map((godown) => ({
      GatePassNo: fullInvoice.gate_pass_no,
      Date: fullInvoice.gate_pass_date,
      ProductType: godown.product_type,
      LotNo: godown.lot_no,
      ProductName: godown.products.name,
      ShadeNo: godown.products.shadeNo,
      StockCode: godown.stock_code,
      Width: godown.width,
      Length: godown.length,
      Pcs: godown.pcs,
      Quantity: godown.quantity,
      Supervisor: fullInvoice.warehouse_supervisors.name
    }));
    const ws = XLSX.utils.json_to_sheet(extractedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'GatePassData');
    XLSX.writeFile(wb, `GatePass_${fullInvoice.gate_pass_no}.xlsx`);
  };

  const navigate = useNavigate();

  const columns = [
    {
      name: 'Invoice Number',
      selector: (row) => row.invoice_no,
      sortable: true
    },
    {
      name: 'Date',
      selector: (row) => row.date,
      sortable: true
    },
    {
      name: 'Customer',
      selector: (row) => row.customer,
      sortable: true
    },
    {
      name: 'Company',
      selector: (row) => row.company,
      sortable: true
    },
    {
      name: 'Place of Supply',
      selector: (row) => row.place_of_supply,
      sortable: true
    },
    {
      name: 'Vehicle No',
      selector: (row) => row.vehicle_no,
      sortable: true
    },
    {
      name: 'Transport',
      selector: (row) => row.transport,
      sortable: true
    },
    {
      name: 'Total Amount',
      selector: (row) => row.total_amount,
      sortable: true
    },
    {
      name: 'CGST %',
      selector: (row) => row.cgst_percentage,
      sortable: true
    },
    {
      name: 'SGST %',
      selector: (row) => row.sgst_percentage,
      sortable: true
    },

    {
      name: 'Payment Status',
      selector: (row) => row.payment_status,
      sortable: true
    },
    {
      name: 'Payment Date',
      selector: (row) => row.payment_date,
      sortable: true
    },
    {
      name: 'Payment Account No',
      selector: (row) => row.payment_account_no,
      sortable: true
    },
    {
      name: 'Payment Amount',
      selector: (row) => row.payment_amount,
      sortable: true
    },
    {
      name: 'QR Code',
      selector: (row) => row.qr_code,
      sortable: true
    },
    {
      name: 'Status',
      selector: (row) => (row.status === 0 ? 'Requested' : 'Sold Out'),
      sortable: true,
      cell: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span
            className={`badge ${row.status === 0 ? 'bg-danger' : 'bg-success'}`}
            style={{
              padding: '5px 10px',
              borderRadius: '8px',
              whiteSpace: 'nowrap'
            }}
          >
            {row.status === 0 ? 'Requested' : 'Sold Out'}
          </span>
        </div>
      )
    },
    {
      name: 'Actions',
      minWidth: '350px', // Increase the width
      cell: (row) => (
        <div className="d-flex" style={{ flexWrap: 'nowrap', gap: '8px', justifyContent: 'space-evenly', alignItems: 'center' }}>
          <Button variant="outline-success" size="sm" className="me-2">
            <FaEye onClick={() => navigate(`/invoices-out/${row.id}`)} />
          </Button>
    
          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => {
              setSelectedInvoice(row.id);
              setShowPdfModal(true);
            }}
          >
            <MdPrint />
          </Button>
    
          <Button
            variant="outline-dark"
            size="sm"
            onClick={() => {
              setSelectedInvoice(row.id);
              setShowThermalPdfModal(true);
            }}
          >
            <MdPrint />
          </Button>
    
          <Button variant="outline-info" size="sm" onClick={() => downloadExcel(row)}>
            <FaFileExcel />
          </Button>
          <Button variant="outline-danger" size="sm" onClick={() => handleDelete(row.id)}>
            <MdDelete />
          </Button>
        </div>
      ),
      width: '300px' // Increased width
    }    
  ];
  const exportToCSV = () => {
    const csvData = filteredInvoices.map((row) => ({
      'Invoice No': row.invoice_no || '',
      Date: row.date || '',
      Customer: row.customer || '',
      Company: row.company || '',
      'Place of Supply': row.place_of_supply || '',
      'Vehicle No': row.vehicle_no || '',
      Transport: row.transport || '',
      'Total Amount': row.total_amount || '',
      'CGST %': row.cgst_percentage || '',
      'SGST %': row.sgst_percentage || '',
      'Payment Status': row.payment_status || '',
      'Payment Date': row.payment_date || '',
      'Payment Account No': row.payment_account_no || '',
      'Payment Amount': row.payment_amount || '',
      'QR Code': row.qr_code || '',
      Status: row.status === 0 ? 'Requested' : 'Sold Out'
    }));

    // Convert to CSV
    const csv = Papa.unparse(csvData, {
      quotes: true, // Ensures proper formatting
      escapeChar: '"', // Prevents data from being misinterpreted
      delimiter: ',' // Standard CSV format
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'invoice_list.csv');
  };

  const exportToPDF = () => {
    const doc = new jsPDF('landscape');
    doc.text('Invoice List', 14, 10);

    // Define headers dynamically based on invoice fields
    const headers = [
      [
        'Invoice No',
        'Date',
        'Customer',
        'Company',
        'Place of Supply',
        'Vehicle No',
        'Total Amount',
        'CGST %',
        'SGST %',
        'Payment Status',
        'Payment Date',
        'Payment Account No',
        'Payment Amount',
      ]
    ];

    const body = filteredInvoices.map((row, index) => [
      row.invoice_no || 'N/A',
      row.date || 'N/A',
      row.customer || 'N/A',
      row.company || 'N/A',
      row.place_of_supply || 'N/A',
      row.vehicle_no || 'N/A',
      row.total_amount || 'N/A',
      row.cgst_percentage || 'N/A',
      row.sgst_percentage || 'N/A',
      row.payment_status || 'N/A',
      row.payment_date || 'N/A',
      row.payment_account_no || 'N/A',
      row.payment_amount || 'N/A',
    ]);

    doc.autoTable({
      head: headers,
      body: body,
      startY: 20,
      theme: 'grid',
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [22, 160, 133], textColor: 255, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [238, 238, 238] }
    });

    doc.save('invoice_list.pdf');
  };

  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      });

      if (result.isConfirmed) {
        await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/godownstockout/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });

        setInvoices((prevInvoices) => prevInvoices.filter((invoice) => invoice.id !== id));
        setFilteredInvoices((prevFilteredInvoices) => prevFilteredInvoices.filter((invoice) => invoice.id !== id));
        Swal.fire('Deleted!', 'The Invoice has been deleted.', 'success');
      }
    } catch (error) {
      console.error('Error deleting invoice:', error);
      Swal.fire('Error!', 'There was a problem deleting the Invoice.', 'error');
    }
  };

  const handleAddInvoice = () => {
    navigate('/invoice-out');
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
        padding: '6px',
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
        color: 'black',
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
    <div className="container-fluid pt-4" style={{ border: '3px dashed #14ab7f', borderRadius: '8px', background: '#ff9d0014' }}>
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
        <div className="col-md-8 text-end">
          <Button variant="primary" onClick={handleAddInvoice}>
            <MdPersonAdd className="me-2" /> Add Invoice
          </Button>
        </div>
      </div>
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
                    <Skeleton width={200} height={20} />
                    <Skeleton width={200} height={20} />
                    <Skeleton width={200} height={20} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="card-body p-0" style={{ backgroundColor: '#fff' }}>
                <DataTable
                  columns={columns}
                  data={filteredInvoices}
                  pagination
                  highlightOnHover
                  striped
                  responsive
                  customStyles={customStyles}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      {invoiceAllDetails && selectedInvoice && (
        <StockOutInvoicePDF
          show={showPdfModal}
          onHide={() => setShowPdfModal(false)}
          invoiceData={invoiceAllDetails}
          id={selectedInvoice}
        />
      )}
      {invoiceAllDetails && selectedInvoice && (
        <StockOutInvoiceThermalPDF
          show={showThermalPdfModal}
          onHide={() => setShowThermalPdfModal(false)}
          invoiceData={invoiceAllDetails}
          id={selectedInvoice}
        />
      )}
    </div>
  );
};

export default Index;