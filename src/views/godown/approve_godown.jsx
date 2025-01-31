import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Button, Badge, Modal, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MdEdit, MdDelete, MdPersonAdd, MdPlusOne, MdAdd, MdPrint } from 'react-icons/md';
import { FaEye, FaFileCsv, FaTrash, FaCheck } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import PdfPreview from 'components/PdfOutPreview';
import { AiOutlineFilePdf } from 'react-icons/ai';

const Index = () => {
    const [invoices, setInvoices] = useState([]);
    const [filteredInvoices, setFilteredInvoices] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [invoiceAllDetails, setInvoiceAllDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [showPdfModal, setShowPdfModal] = useState(false);

    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/godowns/gatepass`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                });
                console.log(response.data);
                const invoicesDetails = response.data;
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

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const navigate = useNavigate();
    const handleAction = async (invoiceId, status) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/api/godown/approved/${invoiceId}`,
                { status},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            const updatedInvoices = invoices.map((invoice) =>
                invoice.id === invoiceId ? { ...invoice, status } : invoice
            );
            setInvoices(updatedInvoices);
            setFilteredInvoices(updatedInvoices);
        } catch (error) {
            toast.error('Failed to update product status');
            console.error('Error updating product status:', error);
        }
    };

    const columns = [
        {
            name: 'Invoice Number',
            selector: (row) => row.invoice_no,
            sortable: true,
        },
        {
            name: 'Product Name',
            selector: (row) => row.products.name,
            sortable: true,
        },
        {
            name: 'Product Code',
            selector: (row) => row.products.code,
            sortable: true,
        },
        {
            name: 'Shade No',
            selector: (row) => row.products.shadeNo,
            sortable: true,
        },
        {
            name: 'Purchase Shade No',
            selector: (row) => row.products.purchase_shade_no,
            sortable: true,
        },
        {
            name: 'Date',
            selector: (row) => row.date,  
            sortable: true,
        },
        {
            name: 'Length',
            selector: (row) => Math.round(row.get_length),
            sortable: true,
        },
        {
            name: 'Width',
            selector: (row) => Math.round(row.get_width),
            sortable: true,
        },
        {
            name: 'unit',
            selector: (row) => row.unit,  
            sortable: true,
        },
        {
            name: 'Action',
            cell: (row) => {
                const renderButtons = () => {
                    switch (row.status) {
                        case 0:
                            return (
                                <>
                                    <Button
                                        variant="outline-success"
                                        size="sm"
                                        className="me-2"
                                        onClick={() => handleAction(row.id, 1)}
                                    >
                                        <FaCheck />
                                    </Button>
                                    <Button
                                        variant="outline-danger"
                                        size="sm"
                                        onClick={() => handleAction(row.id, 2)}
                                    >
                                        <FaTrash />
                                    </Button>
                                </>
                            );

                        case 1:
                            return (
                                <span class="badge bg-success">Accepted</span>
                            );

                        case 2:
                            return (
                                <span class="badge bg-danger">Rejected</span>
                            );
                        case 3:
                            return (
                                <span class="badge bg-warning">Sold</span>
                            );


                        default:
                            return null;
                    }
                };

                return (
                    <div className="d-flex align-items-center gap-2">
                        {renderButtons()}
                    </div>
                );
            },
        }

    ];

    const handleAddInvoice = () => {
        navigate('/invoice-out');
    };
    const customStyles = {
        table: {
            style: {
                borderCollapse: 'separate', 
                borderSpacing: 0, 
            },
        },
        header: {
            style: {
                backgroundColor: '#2E8B57',
                color: '#fff',
                fontSize: '18px',
                fontWeight: 'bold',
                padding: '15px',
                borderRadius: '8px 8px 0 0', 
            },
        },
        rows: {
            style: {
                backgroundColor: '#f0fff4',
                borderBottom: '1px solid #e0e0e0',
                transition: 'background-color 0.3s ease',
                '&:hover': {
                    backgroundColor: '#e6f4ea',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                },
            },
        },
        headCells: {
            style: {
                backgroundColor: '#20B2AA',
                color: '#fff',
                fontSize: '12px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                padding: '15px',
                borderRight: '1px solid #e0e0e0', 
            },
            lastCell: {
                style: {
                    borderRight: 'none', 
                },
            },
        },
        cells: {
            style: {
                fontSize: '14px',
                color: '#333',
                padding: '12px',
                borderRight: '1px solid grey', 
            },
        },
        pagination: {
            style: {
                backgroundColor: '#3f4d67',
                color: '#fff',
                borderRadius: '0 0 8px 8px',
            },
            pageButtonsStyle: {
                backgroundColor: 'transparent',
                color: 'black',
                border: 'none',
                '&:hover': {
                    backgroundColor: 'rgba(141, 49, 49, 0.2)',
                },
                '& svg': {
                    fill: 'white',
                },
                '&:focus': {
                    outline: 'none',
                    boxShadow: '0 0 5px rgba(255,255,255,0.5)',
                },
            },
        },
    };


    const exportToCSV = () => {
        const csv = Papa.unparse(filteredInvoices);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, 'supplier_list.csv');
    };
    const exportToPDF = () => {
        const doc = new jsPDF('landscape');
        doc.text('Customers List', 20, 10);
        doc.autoTable({
            head: [
                [
                    'Invoice Number',
                    'Customer Name',
                    'Supplier Name',
                    'Date',
                    'Bank',
                    'Total Amount',
                ]
            ],
            body: filteredInvoices.map((row) => [
                row.invoice_no,
                row.supplier_name,
                row.receiver_name,
                row.date,
                row.bank,
                row.total_amount,
            ])
        });
        doc.save('user_list.pdf');
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
                <div className="col-md-8 text-end">
                    <Button variant="primary" onClick={handleAddInvoice}>
                        <MdPersonAdd className="me-2" /> Add Invoice
                    </Button>
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
                        )}
                    </div>
                </div>
            </div>
            {invoiceAllDetails && selectedInvoice && (
                <PdfPreview show={showPdfModal} onHide={() => setShowPdfModal(false)} invoiceData={invoiceAllDetails} id={selectedInvoice} />
            )}
        </div>
    );
};

export default Index;


