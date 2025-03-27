import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Button, Modal, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MdEdit, MdDelete, MdPersonAdd, MdCheckCircle, MdPlusOne, MdAdd, MdPrint, MdAddCircle } from 'react-icons/md';
import { FaEye, FaShare } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import StockGatePass from 'components/StockGatePass';
import { AiOutlineFilePdf } from 'react-icons/ai';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { FaFileExcel } from 'react-icons/fa';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import PdfPreview from 'components/PdfPreview';
import { FaFileCsv } from 'react-icons/fa';
import Papa from 'papaparse';
import 'jspdf-autotable';

const Index = () => {
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [invoiceAllDetails, setInvoiceAllDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/godowns/getStockgatepass`, {
          params: {
            type: 'transfer'
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });

        const invoicesDetails = response.data.data;
        console.log(response.data.data);
        setInvoiceAllDetails(invoicesDetails);

        const filteredFields = invoicesDetails.map((gatepass) => ({
          gatepass_no: gatepass.gate_pass_no,
          id: gatepass.id,
          status: gatepass.status,
          type: gatepass.type,
          godownSupervisor: gatepass.godown_supervisor.name,
          warehouseSupervisor: gatepass.warehouse_supervisor.name,
          date: gatepass.gate_pass_date,
          total_amount: gatepass.total_amount
        }));
        setInvoices(filteredFields);
        setFilteredInvoices(filteredFields);
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
    const filtered = invoices.filter((invoice) => invoice.godownSupervisor.toLowerCase().includes(lowercasedQuery));
    setFilteredInvoices(filtered);
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
  const handleApprove = async (id) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/godowns/gatepass/${id}/approve`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      toast.success('Gate pass approved successfully!');
      setInvoices((prev) => prev.map((inv) => (inv.id === id ? { ...inv, status: 1 } : inv)));
      setFilteredInvoices((prev) => prev.map((inv) => (inv.id === id ? { ...inv, status: 1 } : inv)));
    } catch (error) {
      toast.error('Failed to approve gate pass');
    }
  };
  const columns = [
    {
      name: 'GatePass Number',
      selector: (row) => row.gatepass_no,
      sortable: true
    },
    {
      name: 'Receiver Name',
      selector: (row) => row.godownSupervisor,
      sortable: true
    },
    {
      name: 'Sender Name',
      selector: (row) => row.warehouseSupervisor,
      sortable: true
    },
    {
      name: 'Date',
      selector: (row) => (row.date ? new Date(row.date).toLocaleDateString('en-GB') : 'N/A'),
      sortable: true
    },
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
    },
    {
      name: 'Action',
      cell: (row) => (
        <div className="d-flex" style={{ flexWrap: 'nowrap', gap: '8px', justifyContent: 'space-evenly', alignItems: 'center' }}>
          {row.status === 0 && row.type == 2 ? (
            <>
              <Button variant="outline-success" size="sm" onClick={() => handleApprove(row.id)}>
                <MdCheckCircle />
              </Button>
            </>
          ) : (
            <></>
          )}
          <Button variant="outline-success" size="sm" className="me-2">
            <FaEye onClick={() => navigate(`/show-gatepass_details/${row.id}`)} />
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

          <Button variant="outline-info" size="sm" onClick={() => downloadExcel(row)}>
            <FaFileExcel />
          </Button>
          <Button variant="outline-danger" size="sm" onClick={() => handleDelete(row.id)}>
            <MdDelete />
          </Button>
        </div>
      ),
      width: '300px'
    }
  ];
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
        await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/godowns/gatepass/${id}`, {
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
    navigate('/stock-tranfer');
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
  const exportToCSV = () => {
    if (!filteredInvoices || filteredInvoices.length === 0) {
      toast.error('No data available for export.');
      return;
    }

    // Extract column headers dynamically from `columns` array
    const headers = columns.map((col) => col.name);

    // Prepare CSV data dynamically
    const csvData = filteredInvoices.map((row, index) => {
      let rowData = { 'Sr No': index + 1 }; // Add Serial Number manually

      columns.forEach((col) => {
        if (typeof col.selector === 'function') {
          rowData[col.name] = col.selector(row);
        }
      });

      return rowData;
    });

    // Convert to CSV and save
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'gatepass_data.csv');
    toast.success('CSV exported successfully!');
  };

  const exportToPDF = () => {
    if (!filteredInvoices || filteredInvoices.length === 0) {
      toast.error('No data available for export.');
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text('Gate Pass Data', 80, 10);

    // Extract headers from `columns` array
    const headers = columns.map((col) => col.name);

    // Prepare data dynamically
    const body = filteredInvoices.map((row, index) => {
      return columns.map((col) => (typeof col.selector === 'function' ? col.selector(row) : 'N/A'));
    });

    doc.autoTable({
      head: [headers],
      body: body,
      startY: 20,
      theme: 'grid',
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [44, 62, 80], textColor: 255, fontSize: 8 },
      alternateRowStyles: { fillColor: [240, 240, 240] },
      margin: { top: 20 }
    });

    doc.save('gatepass_data.pdf');
    toast.success('PDF exported successfully!');
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
        <div className="col-md-8 text-end mt-4 mt-md-0" >
          <Button variant="primary" onClick={handleAddInvoice}>
            <MdAddCircle className="me-2" />Transfer <FaShare className="ms-2" />
          </Button>
        </div>
        <div className="d-flex justify-content-end">
          <button type="button" className="btn btn-info" onClick={exportToCSV}>
            <FaFileCsv className="w-5 h-5 me-1"
              style={{
                width: isMobile ? '20px' : '0',
                height: isMobile ? '25px' : '0'
              }}
            />
            <span className='d-none d-md-inline'>
              Export as CSV
            </span>
          </button>
          <button type="button" className="btn btn-info" onClick={exportToPDF}>
            <AiOutlineFilePdf className="w-5 h-5 me-1" style={{
              width: isMobile ? '20px' : '0',
              height: isMobile ? '25px' : '0'
            }} />
            <span className='d-none d-md-inline'>
              Export as PDF
            </span>
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
        <StockGatePass show={showPdfModal} onHide={() => setShowPdfModal(false)} invoiceData={invoiceAllDetails} id={selectedInvoice} />
      )}
    </div>
  );
};

export default Index;
