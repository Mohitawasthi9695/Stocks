import React, { useEffect, useState } from 'react'; 
import DataTable from 'react-data-table-component';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaTrash, FaCheck } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { AiOutlineFilePdf } from 'react-icons/ai';

const Index = () => {
    const id = JSON.parse(localStorage.getItem('user')).id || 4;
    const [invoices, setInvoices] = useState([]);
    const [filteredInvoices, setFilteredInvoices] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_API_BASE_URL}/api/sub_supervisor/godown/${id}`, 
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );
                const invoicesDetails = response.data;
                setInvoices(invoicesDetails);
                setFilteredInvoices(invoicesDetails);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchInvoices();
    }, [id]);

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        const query = e.target.value.toLowerCase();
        const filtered = invoices.filter(
            (invoice) =>
                invoice.invoice_no.toLowerCase().includes(query) ||
                invoice.products.name.toLowerCase().includes(query)
        );
        setFilteredInvoices(filtered);
    };

    const navigate = useNavigate();

    const handleAction = async (invoiceId, status) => {
        try {
            const response = await axios.put(
                `${import.meta.env.VITE_API_BASE_URL}/api/godownstockout/${invoiceId}`,
                { status },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            toast.success(`Invoice ${invoiceId} updated successfully!`);
            const updatedInvoices = invoices.map((invoice) =>
                invoice.id === invoiceId ? { ...invoice, status } : invoice
            );
            setInvoices(updatedInvoices);
            setFilteredInvoices(updatedInvoices);
        } catch (error) {
            toast.error('Failed to update invoice status');
            console.error('Error updating invoice status:', error);
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
            name: 'Date',
            selector: (row) => row.date,
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
                            return <span className="badge bg-success">Accepted</span>;

                        case 2:
                            return <span className="badge bg-danger">Rejected</span>;

                        default:
                            return null;
                    }
                };

                return <div className="d-flex align-items-center gap-2">{renderButtons()}</div>;
            },
        },
    ];

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

    return (
        <div  className="container-fluid pt-4 " style={{ border: '3px dashed #14ab7f', borderRadius: '8px', background: '#ff9d0014' }}>
            <div className="row mb-3">
                <div className="col-md-4">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={handleSearch}
                        className="form-control"
                    />
                </div>
                <div className="col-md-8 text-end">
                    <Button variant="primary" onClick={() => navigate('/invoice-out')}>
                        Add Invoice
                    </Button>
                </div>
            </div>
            <div className="row">
                <div className="col-12">
                    {loading ? (
                        <Skeleton count={8} height={40} />
                    ) : (
                        <DataTable
                            columns={columns}
                            data={filteredInvoices}
                            pagination
                            customStyles={customStyles}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Index;
