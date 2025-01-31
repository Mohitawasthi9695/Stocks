import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Form, Button, Container, Row, Col } from 'react-bootstrap';
import { FaPlus, FaTrash, FaUserPlus } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';

const AddProduct = () => {
    const navigate = useNavigate();
    const [items, setItems] = useState([
        {
            product_id: '',
            purchase_shadeNo: '',
            width: '',
            D_outer: '',
            D_inner: '',
            thickness: '',
            length: '',
            unit: 'inches',
            type: '',
            // qty: 1,
        },
    ]);
    const [allProducts, setAllProducts] = useState([]);

    // Fetch all products for dropdown
    useEffect(() => {
        const fetchAllProducts = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/products`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
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
        setItems((prevItems) => [
            ...prevItems,
            {
                product_id: '',
                purchase_shadeNo: '',
                width: '',
                D_outer: '',
                D_inner: '',
                thickness: '',
                length: '',
                unit: 'inches',
                type: '',
                // qty: 1,
            },
        ]);
    };

    const handleDeleteRow = (index) => {
        setItems((prevItems) => prevItems.filter((_, i) => i !== index));
    };

    const calculateLength = (D_outer, D_inner, thickness) => {
        const outerDiameter = parseFloat(D_outer);
        const innerDiameter = parseFloat(D_inner);
        const t = parseFloat(thickness);

        if (outerDiameter && innerDiameter && t) {
            const result = (Math.pow(outerDiameter, 2) - Math.pow(innerDiameter, 2)) / (4 * (t * 0.0393701) * Math.PI);
            return result.toFixed(2);
        }
        return '';
    };

    const handleRowChange = (index, field, value) => {
        setItems((prevItems) => {
            const updatedItems = [...prevItems];
            const row = updatedItems[index];

            if (field === 'product_id') {
                const selectedProduct = allProducts.find((product) => product.id === parseInt(value));
                if (selectedProduct) {
                    row.product_id = value;
                    row.purchase_shadeNo = selectedProduct.purchase_shade_no;
                }
            } else if (['D_outer', 'D_inner', 'thickness'].includes(field)) {
                row[field] = value;
                row.length = calculateLength(row.D_outer, row.D_inner, row.thickness);
            } else {
                row[field] = value;
            }

            return updatedItems;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = items.map((item) => ({ ...item }));

        try {
            await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/oldstocks`, payload, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            toast.success('Stock added successfully');
            navigate('/stocks'); // Redirect after successful submission
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Error adding stock';
            toast.error(errorMessage);
        }
    };

    return (
        <Container fluid className="pt-4 px-2" style={{ border: '3px dashed #14ab7f', borderRadius: '8px', background: '#ff9d0014' }}>
            <Row className="justify-content-center">
                <Col md={12} lg={12} className="mt-3">
                    <div className="card shadow-lg border-0 rounded-lg">
                        <div className="card-body p-5">
                            <h3 className="text-center mb-4">Add Manually</h3>
                            <Button variant="success" onClick={handleAddRow} className="mb-3">
                                <FaPlus /> Add Item
                            </Button>
                            <form onSubmit={handleSubmit}>
                                <Table bordered hover responsive>
                                    <thead>
                                        <tr className="text-white" style={{ backgroundColor: '#3f4d67' }}>
                                            <th style={{width:"170px"}}>Shade No</th>
                                            <th>Pur. Shade No</th>
                                            <th>Width</th>
                                            <th>Outer Diameter</th>
                                            <th>Inner Diameter</th>
                                            <th>Thickness</th>
                                            <th>Length</th>
                                            {/* <th>Unit</th> */}
                                            <th style={{width:"150px"}}>Type</th>
                                            {/* <th>Quantity</th> */}
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {items.map((item, index) => (
                                            <tr key={index}>
                                                <td>
                                                    <Form.Control
                                                        as="select"
                                                        value={item.product_id}
                                                        onChange={(e) => handleRowChange(index, 'product_id', e.target.value)}
                                                    >
                                                        <option value="">Select Shade No.</option>
                                                        {allProducts.map((product) => (
                                                            <option key={product.id} value={product.id}>
                                                                {product.shadeNo}
                                                            </option>
                                                        ))}
                                                    </Form.Control>
                                                </td>
                                                <td>
                                                    <Form.Control type="text" value={item.purchase_shadeNo} disabled />
                                                </td>
                                                <td>
                                                    <Form.Control
                                                        type="number"
                                                        value={item.width}
                                                        onChange={(e) => handleRowChange(index, 'width', e.target.value)}
                                                    />
                                                </td>
                                                <td>
                                                    <Form.Control
                                                        type="number"
                                                        value={item.D_outer}
                                                        onChange={(e) => handleRowChange(index, 'D_outer', e.target.value)}
                                                    />
                                                </td>
                                                <td>
                                                    <Form.Control
                                                        type="number"
                                                        value={item.D_inner}
                                                        onChange={(e) => handleRowChange(index, 'D_inner', e.target.value)}
                                                    />
                                                </td>
                                                <td>
                                                    <Form.Control
                                                        type="number"
                                                        value={item.thickness}
                                                        onChange={(e) => handleRowChange(index, 'thickness', e.target.value)}
                                                    />
                                                </td>
                                                <td>
                                                    <Form.Control type="text" value={item.length} readOnly />
                                                </td>
                                            
                                                <td>
                                                    <Form.Control
                                                        as="select"
                                                        value={item.type}
                                                        onChange={(e) => handleRowChange(index, 'type', e.target.value)}
                                                    >
                                                        <option value="">Select Type</option>
                                                        <option value="roll">Roll</option>
                                                        <option value="box">Box</option>
                                                    </Form.Control>
                                                </td>
                                                {/* <td>
                                                    <Form.Control
                                                        type="number"
                                                        value={item.qty}
                                                        onChange={(e) => handleRowChange(index, 'qty', e.target.value)}
                                                    />
                                                </td> */}
                                                <td>
                                                    <Button variant="danger" size="sm" onClick={() => handleDeleteRow(index)}>
                                                        <FaTrash />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                                <Button
                                    variant="primary"
                                    type="submit"
                                    className="mt-4 d-block mx-auto"
                                    style={{ width: '10rem', backgroundColor: '#3f4d67', borderColor: '#3f4d67' }}
                                >
                                    <FaUserPlus className="me-2" /> Add Stock
                                </Button>
                            </form>
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default AddProduct;
