import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Table, Form, Button, Container, Row, Col } from 'react-bootstrap';
import { FaPlus, FaTrash, FaFileExcel, FaUpload, FaDownload } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

const AddProduct = () => {
    const navigate = useNavigate();
    const [allProducts, setAllProducts] = useState([]);
    const mainColor = '#3f4d67';
    const { id } = useParams();
    const [items, setItems] = useState([
        {
            godown_accessory_id: id,
            lot_no: '',
            date: '',
            length: '',
            length_unit: '',
            quantity: '0',
            type: 'entry',
            rack: '',
            remark: '',
            status: 1
        }
    ]);

    useEffect(() => {
        const fetchAllProducts = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/accessory`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setAllProducts(response.data.data);
            } catch (error) {
                console.error(error);
                toast.error('Failed to fetch products');
            }
        };
        fetchAllProducts();
    }, []);

    const handleAddRow = () => {
        setItems((prev) => [
            ...prev,
            {
                product_accessory_id: '',
                lot_no: '',
                date: '',
                type: 'entry',
                length: '',
                length_unit: '',
                quantity: '0',
                remark: '',
                status: 1
            }
        ]);
    };

    const handleDeleteRow = (index) => {
        if (items.length > 1) {
            setItems((prev) => prev.filter((_, i) => i !== index));
        }
    };

    const handleRowChange = (index, field, value) => {
        setItems((prev) => {
            const updated = [...prev];
            updated[index][field] = value;
            if (field === 'items' || field === 'box_bundle') {
                const items = Number(updated[index].items) || 0;
                const boxBundle = Number(updated[index].box_bundle) || 0;
                updated[index].quantity = (items * boxBundle).toString();
            }
            return updated;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const result = await Swal.fire({
            title: 'Are yoou sure?',
            text: 'Do you want to create the new field?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#20B2AA',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, create it!'
        });

        if (!result.isConfirmed) {
            return;
        }
        const payload = items.map((item) => ({

            godown_accessory_id: id,
            lot_no: item.lot_no,
            date: item.date,
            type: 'entry',
            length: item.length,
            length_unit: item.length_unit,
            quantity: item.quantity,
            remark: item.remark,
            rack: item.rack,
            status: 1
        }));
        console.log(payload);
        try {
            await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/cutaccessory`, payload, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });
            toast.success('Stock added successfully');
            navigate(`/cut_accessory/${id}`);
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Error adding stock');
        }
    };
    const [file, setFile] = useState(null);
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            const fileExtension = selectedFile.name.split('.').pop().toLowerCase();
            if (!['xls', 'xlsx', 'csv'].includes(fileExtension)) {
                toast.error('Unsupported file format. Please upload an .xls or .xlsx file.');
                setFile(null);
            } else {
                setFile(selectedFile);
            }
        }
    };

    const handleFileUpload = async (e) => {
        e.preventDefault();

        if (!file) {
            Swal.fire({
                icon: 'error',
                title: 'Upload Failed',
                text: 'Please select a file to upload.'
            });
            return;
        }

        const formData = new FormData();
        formData.append('csv_file', file);
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/godownAccessory/import`, formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (response.status === 201) {
                Swal.fire({
                    icon: 'success',
                    title: 'Upload Successful',
                    text: 'Stock added successfully!'
                }).then(() => {
                    setFile(null);
                    navigate('/godown_accessory');
                });
            }
        } catch (error) {
            console.error(error);
            const errorMessage = error.response?.data?.error || 'Error adding stock';
            toast.error(errorMessage);

            //
            Swal.fire({
                icon: 'error',
                title: 'Upload Failed',
                text: errorMessage
            });
            //
        }
    };

    const handleDownloads = async () => {
        try {
            const filePath = `${window.location.origin}/StockIN.csv`; // Ensure file is in 'public' folder
            const response = await fetch(filePath);

            if (!response.ok) throw new Error('File not found');

            const text = await response.text();
            const data = text.split('\n').map((row) => row.split(','));

            // Convert CSV to Excel
            const ws = XLSX.utils.aoa_to_sheet(data);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'StockIN');

            const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
            const excelBlob = new Blob([excelBuffer], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            });

            // Save Excel file only
            FileSaver.saveAs(excelBlob, 'StockIN.xlsx');

            console.log('Excel file downloaded successfully!');
        } catch (error) {
            console.error('Error downloading file:', error);
        }
    };

    return (
        <Container fluid className="pt-4 px-3" style={{ border: '3px dashed #14ab7f', borderRadius: '8px', background: '#ff9d0014' }}>
            <Row className="justify-content-center g-4">
                <h2 className="text-center mb-4 fw-bold">Godown Accessory</h2>
                <Col md={12}>
                    <div className="card shadow border-0 rounded-lg" style={{ borderRadius: '12px', margin: '-10px' }}>
                        <div className="card-body ">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h4>
                                    <FaPlus className="me-2" />
                                    Add Manually
                                </h4>
                                <Button variant="success" onClick={handleAddRow}>
                                    Add Row
                                </Button>
                            </div>

                            <div className="table-responsive">
                                <Table bordered className="align-middle">
                                    <thead className="text-white" style={{ backgroundColor: mainColor }}>
                                        <tr>
                                            <th>Accessory</th>
                                            <th>Lot No</th>
                                            <th>Date</th>
                                            <th>Length</th>
                                            <th>Unit</th>
                                            <th>Total Quantity</th>
                                            <th>Rack</th>
                                            <th>Remark</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {items.map((item, index) => (
                                            <tr key={index}>
                                                <td style={{ minWidth: "100px" }}>
                                                    <Form.Select
                                                        size="sm"
                                                        value={item.product_accessory_id}
                                                        onChange={(e) => handleRowChange(index, 'product_accessory_id', e.target.value)}
                                                        required
                                                        style={{ fontSize: '0.9rem', width: '8rem' }}
                                                    >
                                                        <option value="">Select Accessory</option>
                                                        {allProducts.map((product) => (
                                                            <option key={product.id} value={product.id}>
                                                                {product.accessory_name}
                                                            </option>
                                                        ))}
                                                    </Form.Select>
                                                </td>
                                                <td style={{ minWidth: "60px" }}>
                                                    <Form.Control
                                                        size="sm"
                                                        type="text"
                                                        value={item.lot_no}
                                                        onChange={(e) => handleRowChange(index, 'lot_no', e.target.value)}
                                                        style={{ fontSize: '0.9rem', width: '8rem', padding: '0.5rem' }}
                                                    />
                                                </td>
                                                <td style={{ maxWidth: "180px" }}>
                                                    <Form.Control
                                                        size="sm"
                                                        type="date"
                                                        value={item.date}
                                                        onChange={(e) => handleRowChange(index, 'date', e.target.value)}
                                                        style={{ fontSize: '0.9rem', width: '8rem', padding: '0.5rem' }}

                                                    />
                                                </td>
                                                <td style={{ minWidth: "100px" }}>
                                                    <Form.Control
                                                        size="sm"
                                                        type="number"
                                                        value={item.length}
                                                        onChange={(e) => handleRowChange(index, 'length', e.target.value)}
                                                        style={{ fontSize: '0.9rem', width: '6rem', padding: '0.5rem' }}
                                                    />
                                                </td>
                                                <td style={{ minWidth: "100px" }}>
                                                    <Form.Select
                                                        size="sm"
                                                        value={item.length_unit}
                                                        onChange={(e) => handleRowChange(index, 'length_unit', e.target.value)}
                                                        style={{ fontSize: '0.9rem', width: '5rem', padding: '0.5rem' }}

                                                    >
                                                        <option value="">Unit</option>
                                                        <option value="m">Meter</option>
                                                        <option value="ft">Feet</option>
                                                    </Form.Select>
                                                </td>
                                                <td style={{ minWidth: "100px" }}>
                                                    <Form.Control
                                                        size="sm"
                                                        type="number"
                                                        value={item.quantity}
                                                        style={{ fontSize: '0.9rem', width: '6rem', padding: '0.5rem' }}
                                                        onChange={(e) => handleRowChange(index, 'quantity', e.target.value)}

                                                    />
                                                </td>
                                                <td style={{ minWidth: "100px" }}>
                                                    <Form.Control
                                                        size="sm"
                                                        type="text"
                                                        value={item.rack}
                                                        onChange={(e) => handleRowChange(index, 'rack', e.target.value)}
                                                        style={{ fontSize: '0.9rem', width: '10rem', padding: '0.5rem' }}

                                                    />
                                                </td>
                                                <td style={{ minWidth: "100px" }}>
                                                    <Form.Control
                                                        size="sm"
                                                        type="text"
                                                        value={item.remark}
                                                        onChange={(e) => handleRowChange(index, 'remark', e.target.value)}
                                                        style={{ fontSize: '0.9rem', width: '10rem', padding: '0.5rem' }}

                                                    />
                                                </td>
                                                <td>
                                                    <Button
                                                        size="sm"
                                                        variant="danger"
                                                        onClick={() => handleDeleteRow(index)}
                                                        disabled={items.length === 1}
                                                    >
                                                        <FaTrash />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                            <div className="text-center mt-4">
                                <Button type="submit" style={{ backgroundColor: mainColor, borderColor: mainColor }} size="lg" onClick={handleSubmit}>
                                    Submit Stock
                                </Button>
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default AddProduct;
