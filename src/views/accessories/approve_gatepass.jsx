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
import GatePass from 'components/GatePass';
import { AiOutlineFilePdf } from 'react-icons/ai';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { FaFileExcel } from 'react-icons/fa';

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
                const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/accessory/getStockgatepass`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                });
                const invoicesDetails = response.data.data;
                console.log(invoicesDetails);
                setInvoiceAllDetails(invoicesDetails);
                const filteredFields = invoicesDetails.map((gatepass) => ({
                    gatepass_no: gatepass.gate_pass_no,
                    id: gatepass.id,
                    godownSupervisor: gatepass.godown_supervisors.name,
                    warehouseSupervisor: gatepass.warehouse_supervisors.name,
                    date: gatepass.gate_pass_date,
                    total_amount: gatepass.total_amount,
                    status,
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

    const navigate = useNavigate();

    const columns = [
        {
            name: 'S no.',
            selector: (row, index) => index +1,
            sortable: true
        },
        {
            name: 'Date',
            selector: (row) => new Date(row.date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }),
            sortable: true
        },        
        {
            name: 'Invoice Number',
            selector: (row) => row.gatepass_no,
            sortable: true
        },
        {
            name: 'Godown Supervisor Name',
            selector: (row) => row.godownSupervisor,
            sortable: true
        },
        {
            name: 'WareHouser Supervisor',
            selector: (row) => row.warehouseSupervisor,
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
                    {row.status === 0 ? (
                        <>
                            <Button variant="outline-success" size="sm" onClick={() => handleApprove(row.id)}>
                                <MdCheckCircle />
                            </Button>
                            <Button variant="outline-danger" size="sm" onClick={() => handleReject(row.id)}>
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
                    <Button variant="outline-info" size="sm" onClick={() => downloadExcel(row)}>
                        <FaFileExcel />
                    </Button>
                    <Button variant="outline-danger" size="sm" onClick={() => handleDelete(row.id)}>
                        <MdDelete />
                    </Button>
                </div>
            ),
            width: '250px'
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
        navigate('/add-invoice');
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
                padding: '10px',
                borderRight: '1px solid #e0e0e0'
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

    const downloadExcel = (row) => {
        // Find the full invoice details from invoiceAllDetails
        const fullInvoice = invoiceAllDetails.find(invoice => invoice.id === row.id);

        if (!fullInvoice || !fullInvoice.godown_accessories) {
            console.error("Godown accessories data not found for this row:", row);
            return;
        }

        // Extract required data
        const extractedData = fullInvoice.godown_accessories.map((accessory) => ({
            GatePassNo: fullInvoice.gate_pass_no,
            Date: fullInvoice.gate_pass_date,
            ProductAccessoryID: accessory.product_accessory_id, // New field
            LotNo: accessory.lot_no,
            StockCode: accessory.stock_code,
            Length: accessory.length,
            LengthUnit: accessory.length_unit,
            Pcs: accessory.items,
            Box_Bundle: accessory.box_bundle,
            Quantity: accessory.quantity,
            Supervisor: fullInvoice.warehouse_supervisors.name,
            GodownSupervisor: fullInvoice.godown_supervisors.name,
        }));
        const ws = XLSX.utils.json_to_sheet(extractedData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "GatePassData");

        // Write the Excel file
        XLSX.writeFile(wb, `GatePass_${fullInvoice.gate_pass_no}.xlsx`);
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
                <GatePass show={showPdfModal} onHide={() => setShowPdfModal(false)} invoiceData={invoiceAllDetails} id={selectedInvoice} />
            )}
        </div>
    );
};

export default Index;
