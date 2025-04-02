import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Button, Modal, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MdEdit, MdDelete, MdPersonAdd, MdPlusOne, MdAdd, MdPrint } from 'react-icons/md';
import { FaEye, FaFileCsv } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import PdfPreview from 'components/PdfPreview';
import ThermalPdfPreview from 'components/thermalPdfPriview';
import { AiOutlineFilePdf } from 'react-icons/ai';
import Swal from 'sweetalert2';
import Papa from 'papaparse';
import { saveAs } from 'file-saver';
import 'jspdf-autotable';
import 'react-loading-skeleton/dist/skeleton.css';
import jsPDF from 'jspdf';

const Index = () => {
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]); // For search
  const [searchQuery, setSearchQuery] = useState(''); // Search query
  const [invoiceAllDetails, setInvoiceAllDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [showThermalPdfModal, setShowThermalPdfModal] = useState(false);
  const [pdfType, setPdfType] = useState('standard');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);



  useEffect(() => {
    console.log("Fetching Data for Page:", currentPage); // Debugging
    const fetchInvoices = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/stockin/invoice?page=${currentPage}&per_page=10`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json'
            }
          }
        );
        console.log(response.data);
  
        const { page_number, total_record_count, records } = response.data;
  
        console.log("Received Page:", page_number); // Debugging
        console.log("Total Records:", total_record_count);
  
        setCurrentPage(page_number); // Ensure state updates correctly
        setInvoices(records);
        setInvoiceAllDetails(records);
        setFilteredInvoices(
          records.map(invoice => ({
            invoice_no: invoice.invoice_no,
            id: invoice.id,
            supplier_name: invoice.supplier?.name || "N/A",
            agent: invoice.agent,
            date: invoice.date,
            total_amount: invoice.total_amount
          }))
        );
        setTotalRecords(total_record_count);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchInvoices();
  }, [currentPage]); 
  
  useEffect(() => {
    const lowercasedQuery = searchQuery.toLowerCase();

    const filtered = invoices.filter((invoice) => {
      return (
        invoice.invoice_no.toString().toLowerCase().includes(lowercasedQuery) ||
        invoice.supplier_name.toLowerCase().includes(lowercasedQuery) ||
        invoice.agent.toLowerCase().includes(lowercasedQuery) ||
        invoice.total_amount.toString().toLowerCase().includes(lowercasedQuery) ||
        new Date(invoice.date).toLocaleDateString('en-GB').toLowerCase().includes(lowercasedQuery) // Fix date search
      );
    });

    setFilteredInvoices(filtered);
  }, [searchQuery, invoices]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const navigate = useNavigate();

  const handlePrint = (type, invoiceId) => {
    setSelectedInvoice(invoiceId);
    setPdfType(type);
    setShowPdfModal(true);
  };
  const columns = [
    {
      name: 'Date',
      selector: (row) => new Date(row.date).toLocaleDateString('en-GB'), // Format: DD/MM/YYYY
      sortable: true,
      width: '100px',
      center: true
    },
    {
      name: 'Invoice No.',
      selector: (row) => row.invoice_no,
      sortable: true,
      width: '120px',
      center: true
    },
    {
      name: 'Supplier Name',
      selector: (row) => row.supplier?.name || "N/A",
      sortable: true,
      wrap: true,
      center: true
    },
    {
      name: 'Receiver Name',
      selector: (row) => row.agent,
      sortable: true,
      center: true,
      wrap: true
    },

    {
      name: 'Total Amount',
      selector: (row) => row.total_amount,
      sortable: true,
      center: true
    },
    {
      name: 'Action',
      minWidth: '300px',
      cell: (row) => (

        <div className="d-flex">
          <Button variant="outline-warning" size="sm" className="me-2" onClick={() => navigate(`/add-product/${row.id}`)}>
            <MdAdd />
          </Button>
          <Button variant="outline-success" size="sm" className="me-2">
            <FaEye onClick={() => navigate(`/show_product/${row.id}`)} />
          </Button>
          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => {
              setSelectedInvoice(row.id);
              setShowPdfModal(true);
              console.log(row.id);
            }}
             
          >
            <MdPrint />
          </Button>
          <Button
            variant="outline-dark"
            size="sm"
            // onClick={() => handlePrint('thermal', row.id)} // Open thermal PDF preview
            onClick={() => {
              setSelectedInvoice(row.id);
              setShowThermalPdfModal(true);
              console.log(row.id);
            }}

          >
            <MdPrint />
          </Button>
          <Button variant="outline-danger" size="sm" onClick={() => handleDelete(row.id)}>
            <MdDelete />
          </Button>
        </div>
      ),
    }
  ];

  const handleDelete = async (id) => {
    try {
      // Display confirmation modal
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
        await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/stockin/invoice/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setInvoices((prevInvoices) => prevInvoices.filter((invoices) => invoices.id !== id));
        setFilteredInvoices((prevFilteredInvoices) => prevFilteredInvoices.filter((invoices) => invoices.id !== id));

        toast.success('Invoice deleted successfully');
        Swal.fire('Deleted!', 'The Invoice has been deleted.', 'success');
      }
    } catch (error) {
      // Log error for debugging and notify user
      console.error('Error deleting INVOICE:', error);

      // Provide user feedback
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(`Failed to delete INVOICE: ${error.response.data.message}`);
      } else {
        toast.error('An unexpected error occurred while deleting the Invoice.');
      }

      // Display error notification in confirmation dialog
      Swal.fire('Error!', 'There was a problem deleting the Invoice.', 'error');
    }
  };
  const handleAddInvoice = () => {
    navigate('/add-invoice');
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

  const exportToCSV = () => {
    const csvData = filteredInvoices.map((row, index) => ({
      'Sr No': index + 1,
      Date: new Date(row.date).toLocaleDateString('en-GB'),
      'Invoice Number': row.invoice_no || 'N/A',
      'Supplier Name': row.supplier_name || 'N/A',
      'Receiver Name': row.agent || 'N/A',
      'Total Amount': row.total_amount || 'N/A'
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'invoice_list.csv');
  };

  const exportToPDF = () => {
    const doc = new jsPDF('landscape');
    doc.text('Invoice List', 14, 10);

    const headers = [['Sr No', 'Date', 'Invoice Number', 'Supplier Name', 'Receiver Name', 'Total Amount']];

    const body = filteredInvoices.map((row, index) => [
      index + 1,
      new Date(row.date).toLocaleDateString('en-GB'),
      row.invoice_no || 'N/A',
      row.supplier_name || 'N/A',
      row.agent || 'N/A',
      row.total_amount || 'N/A'
    ]);

    doc.autoTable({
      head: headers,
      body: body,
      startY: 20,
      theme: 'grid', // Ensures grid lines for vertical & horizontal separation
      styles: { fontSize: 10, cellPadding: 3, valign: 'middle' },
      headStyles: { fillColor: [22, 160, 133], textColor: 255, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [238, 238, 238] },
      tableLineColor: [0, 0, 0], // Black border lines
      tableLineWidth: 0.2 // Thin border lines
    });

    doc.save('invoice_list.pdf');
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
            className="pe-5 ps-2 py-2"
            style={{ borderRadius: '5px' }}
          />
        </div>
        <div className="col-md-8 text-end mt-3 mt-md-0">
          <Button variant="primary" onClick={handleAddInvoice}>
            <MdPersonAdd className="me-2" /> 
            <span className='d-none d-md-inline'>
            Add Invoice
            </span>
          </Button>
        </div>

        <div className="d-flex justify-content-end" style={{
          marginBottom: '-15px',
          marginTop: '10px'
        }}>
          <button type="button" className="btn btn-sm btn-info" onClick={exportToCSV}> 
            <FaFileCsv className="w-5 h-5 me-1"  style={{
                    height: '25px',
                    width: '15px'
                  }}/>
            <span className='d-none d-md-inline'>
            Export as CSV
            </span>
          </button>
          <button type="button" className="btn btn-sm btn-info" onClick={exportToPDF}>
            <AiOutlineFilePdf className="w-5 h-5 me-1" style={{
                    height: '25px',
                    width: '20px'
                  }} />
            <span className='d-none d-md-inline'>Export as PDF</span>
          </button>
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
                    <Skeleton width={200} height={20} />
                    <Skeleton width={200} height={20} />
                    <Skeleton width={200} height={20} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="card-body p-0" style={{ borderRadius: '8px' }}>
                <div className="d-flex justify-content-end"></div>
                <DataTable
                  columns={columns}
                  data={filteredInvoices}
                  pagination
                  highlightOnHover
                  striped
                  customStyles={customStyles}
                  defaultSortFieldId={1}
                  paginationServer
                  paginationTotalRows={totalRecords}
                  paginationPerPage={10}
                  onChangePage={(page) => setCurrentPage(page)}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      {invoiceAllDetails && selectedInvoice && (
        <PdfPreview show={showPdfModal} onHide={() => setShowPdfModal(false)} invoiceData={invoiceAllDetails} id={selectedInvoice} />
      )}
      {invoiceAllDetails && selectedInvoice && (
        <ThermalPdfPreview show={showThermalPdfModal} onHide={() => setShowThermalPdfModal(false)} invoiceData={invoiceAllDetails} id={selectedInvoice} />
      )}
    </div>
  );
};

export default Index;
