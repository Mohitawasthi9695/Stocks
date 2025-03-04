import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Button } from 'react-bootstrap';
import { MdDelete, MdPrint, MdPersonAdd, MdCheckCircle, MdAdd } from 'react-icons/md';
import { FaFileExcel } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Skeleton from 'react-loading-skeleton';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import StockOutInvoicePDF from 'components/StockOutInvoicePDF';
import { AiOutlineFilePdf } from 'react-icons/ai';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Papa from 'papaparse';
import { saveAs } from 'file-saver';
import 'react-loading-skeleton/dist/skeleton.css';
import { FaFileCsv } from 'react-icons/fa';
import { MdCancel } from 'react-icons/md'; // Import Reject Icon

const OperatorInvoice = () => {
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [invoiceAllDetails, setInvoiceAllDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [direction, setDirection] = useState('ltr');

  const navigate = useNavigate();

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

        const filteredFields = (data) => {
          return data.map((invoice) => ({
            invoice_no: invoice.invoice_no,
            id: invoice.id,
            supplier_name: invoice.customer,
            company_name: invoice.company,
            height: invoice.stock_out_details?.height,
            date: invoice.date,
            status: invoice.status,
            payment_bank: invoice.payment_bank,
            payment_mode: invoice.payment_mode,
            payment_status: invoice.payment_status,
            total_amount: invoice.total_amount
          }));
        };

        setInvoiceAllDetails(invoicesDetails);
        setInvoices(filteredFields(invoicesDetails));
        setFilteredInvoices(filteredFields(invoicesDetails));
      } catch (error) {
        console.error(error);
        toast.error('Failed to fetch invoices');
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, []);

  useEffect(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = invoices.filter(
      (invoice) =>
        invoice.supplier_name.toLowerCase().includes(lowercasedQuery) || invoice.receiver_name.toLowerCase().includes(lowercasedQuery)
    );
    setFilteredInvoices(filtered);
  }, [searchQuery, invoices]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/stockout/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      toast.success('Invoice deleted successfully');
      setInvoices(invoices.filter((invoice) => invoice.id !== id));
      setFilteredInvoices(filteredInvoices.filter((invoice) => invoice.id !== id));
    } catch (error) {
      toast.error('Failed to delete Invoice');
    }
  };

  const exportToExcel = (invoice) => {
    const worksheet = XLSX.utils.json_to_sheet([invoice]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Invoice');
    XLSX.writeFile(workbook, `Invoice_${invoice.invoice_no}.xlsx`);
  };

  const columns = [
    {
      name: 'Invoice Number',
      selector: (row) => row.invoice_no,
      sortable: true
    },
    {
      name: 'Customer Name',
      selector: (row) => row.supplier_name,
      sortable: true
    },
    {
      name: 'Supplier Name',
      selector: (row) => row.company_name,
      sortable: true
    },
    {
      name: 'Date',
      selector: (row) => row.date,
      sortable: true
    },
    {
      name: 'Bank',
      selector: (row) => row.payment_bank,
      sortable: true
    },
    {
      name: 'Total Amount',
      selector: (row) => row.total_amount,
      sortable: true
    },
    // {
    //   name: 'Action',
    //   width: '230px',
    //   cell: (row) => (
    //     <div className="d-flex">
    //       {row.status === 0 ? (
    //         <>
    //           <Button variant="outline-success" size="sm" onClick={() => handleApprove(row.id)}>
    //             <MdCheckCircle />
    //           </Button>
    //         </>
    //       ) : (
    //         <></>
    //       )}
    //       <Button
    //         variant="outline-primary"
    //         size="sm"
    //         onClick={() => {
    //           setSelectedInvoice(row.id);
    //           setShowPdfModal(true);
    //         }}
    //       >
    //         <MdPrint />
    //       </Button>
    //       <Button variant="outline-primary" size="sm" onClick={() => exportToExcel(row)}>
    //         <FaFileExcel />
    //       </Button>
    //       <Button variant="outline-warning" size="sm" className="me-2" onClick={() => navigate(`/accessory-add-out-stock/${row.id}`)}>
    //         <MdAdd />
    //       </Button>
    //     </div>
    //   )
    // },
    // {
    //   name: 'Status',
    //   selector: (row) => (row.status === 1 ? 'Approved' : 'Pending'),
    //   sortable: true,
    //   cell: (row) => (
    //     <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
    //       <span
    //         className={`badge ${row.status === 1 ? 'bg-success' : 'bg-danger'}`}
    //         style={{
    //           padding: '5px 10px',
    //           borderRadius: '8px',
    //           whiteSpace: 'nowrap'
    //         }}
    //       >
    //         {row.status === 1 ? 'Approved' : 'Pending'}
    //       </span>
    //     </div>
    //   )
    // }
    {
      name: 'Action',
      width: '280px',
      cell: (row) => (
        <div className="d-flex">
          {row.status === 0 ? (
            <>
              <Button variant="outline-success" size="sm" onClick={() => handleApprove(row.id)}>
                <MdCheckCircle />
              </Button>
              <Button variant="outline-danger" size="sm" onClick={() => handleReject(row.id)} className="ms-2">
                <MdCancel />
              </Button>
            </>
          ) : (
            <></>
          )}
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
          <Button variant="outline-primary" size="sm" onClick={() => exportToExcel(row)}>
            <FaFileExcel />
          </Button>
          <Button variant="outline-warning" size="sm" className="me-2" onClick={() => navigate(`/accessory-add-out-stock/${row.id}`)}>
            <MdAdd />
          </Button>
        </div>
      )
    },
    {
      name: 'Status',
      selector: (row) => (row.status === 1 ? 'Approved' : row.status === -1 ? 'Rejected' : 'Pending'),
      sortable: true,
      cell: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span
            className={`badge ${row.status === 1 ? 'bg-success' : row.status === -1 ? 'bg-danger' : 'bg-warning'}`}
            style={{
              padding: '5px 10px',
              borderRadius: '8px',
              whiteSpace: 'nowrap'
            }}
          >
            {row.status === 1 ? 'Approved' : row.status === -1 ? 'Rejected' : 'Pending'}
          </span>
        </div>
      )
    }
  ];
  const handleReject = async (id) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/godownstockout/reject/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      toast.error('Stockout Invoice rejected!');
      setInvoices((prev) => prev.map((inv) => (inv.id === id ? { ...inv, status: -1 } : inv)));
      setFilteredInvoices((prev) => prev.map((inv) => (inv.id === id ? { ...inv, status: -1 } : inv)));
    } catch (error) {
      toast.error('Failed to reject stockout invoice');
    }
  };

  const handleAddInvoice = () => {
    navigate('/invoice-out');
  };
  const handleApprove = async (id) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/godownstockout/approve/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      toast.success('StockoutInovice approved successfully!');
      setInvoices((prev) => prev.map((inv) => (inv.id === id ? { ...inv, status: 1 } : inv)));
      setFilteredInvoices((prev) => prev.map((inv) => (inv.id === id ? { ...inv, status: 1 } : inv)));
    } catch (error) {
      toast.error('Failed to approve gate pass');
    }
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
        padding: '15px',
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
        padding: '15px',
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
        padding: '10px',
        borderRight: '1px solid grey'
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

  const exportToCSV = () => {
    try {
      const csv = Papa.unparse(filteredInvoices);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      saveAs(blob, 'supplier_list.csv');
    } catch (error) {
      console.error('Error generating CSV:', error);
      toast.error('Failed to export CSV');
    }
  };

  const exportToPDF = () => {
    try {
      const doc = new jsPDF('landscape');
      doc.setFontSize(14);
      doc.text('Supplier List', 14, 10);
      doc.autoTable({
        head: [['Invoice Number', 'Customer Name', 'Supplier Name', 'Date', 'Bank', 'Total Amount']],
        body: filteredInvoices.map((row) => [row.invoice_no, row.supplier_name, row.receiver_name, row.date, row.bank, row.total_amount])
      });
      doc.save('supplier_list.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to export PDF');
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
                  <div key={index} style={{ display: 'flex', gap: '10px', padding: '8px' }}>
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
                <div style={{ direction }}>
                  <DataTable
                    columns={columns}
                    data={filteredInvoices}
                    pagination
                    highlightOnHover
                    striped
                    responsive
                    customStyles={customStyles}
                    defaultSortFieldId={1}
                  />
                </div>
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
    </div>
  );
};

export default OperatorInvoice;
