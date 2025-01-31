import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Table, Form, Button, Container, Row, Col, ToggleButton } from 'react-bootstrap';
import { FaPlus, FaTrash, FaFileExcel, FaUpload, FaDownload } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';

const AddProduct = () => {
  const { id, no } = useParams();
  const navigate = useNavigate();
  const [allProducts, setAllProducts] = useState([]);
  const mainColor = '#3f4d67';

  // Modified initial state to include isLengthType flag
  const [items, setItems] = useState([{
    product_accessory_id: '',
    length: '',
    unit: '',
    items: '',
    box: '',
    quantity: '',
    bundle: '',
    isLengthType: false  // New flag to control input type
  }]);

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/warehouse/accessory`, {
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
    setItems(prev => [...prev, {
      product_accessory_id: '',
      length: '',
      unit: '',
      items: '',
      box: '',
      quantity: '',
      bundle: '',
      isLengthType: false
    }]);
  };

  const handleDeleteRow = (index) => {
    if (items.length > 1) {
      setItems(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleRowChange = (index, field, value) => {
    setItems(prev => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  const handleToggleChange = (index) => {
    setItems(prev => {
      const updated = [...prev];
      updated[index].isLengthType = !updated[index].isLengthType;
      // Clear the values of the non-active fields
      if (updated[index].isLengthType) {
        updated[index].items = '';
        updated[index].box = '';
      } else {
        updated[index].length = '';
        updated[index].unit = '';
        updated[index].bundle = '';
      }
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = items.map(item => ({
      product_accessory_id: item.product_accessory_id,
      ...(item.isLengthType ? {
        length: item.length,
        unit: item.unit,
        bundle: item.bundle
      } : {
        items: item.items,
        box: item.box,
      }),
      quantity: item.quantity
    }));

    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/warehouse/accessory`, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      toast.success('Stock added successfully');
      navigate('/stocks');
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Error adding stock');
    }
  };

  return (
    <Container fluid className="pt-4 px-4" style={{ border: '3px dashed #14ab7f', borderRadius: '8px', background: '#ff9d0014' }}>
      <Row className="justify-content-center g-4">
        <Col md={12}>
          <div className="card shadow border-0 rounded-lg">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4>
                  <FaPlus className="me-2" />
                  Add Manually
                </h4>
                <Button variant="success" onClick={handleAddRow}>Add Row</Button>
              </div>
              <Table bordered responsive className="align-middle">
                <thead className="text-white" style={{ backgroundColor: mainColor }}>
                  <tr>
                    <th>Product</th>
                    <th>Type</th>
                    <th>Length</th>
                    <th>Unit</th>
                    <th>Pcs</th>
                    <th>Boxes</th>
                    <th>Bundle</th>
                    <th>Quantity</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <Form.Select
                          value={item.product_accessory_id}
                          onChange={(e) => handleRowChange(index, 'product_accessory_id', e.target.value)}
                          required
                        >
                          <option value="">Select Product</option>
                          {allProducts.map(product => (
                            <option key={product.accessory.id} value={product.accessory.id}>
                              {product.accessory.accessory_name}
                            </option>
                          ))}
                        </Form.Select>
                      </td>

                      <td>
                        <Form.Check
                          type="switch"
                          id={`type-switch-${index}`}
                          label={item.isLengthType ? "Length/Bundle" : "Pcs/Box"}
                          checked={item.isLengthType}
                          onChange={() => handleToggleChange(index)}
                        />
                      </td>

                      {/* Length & Unit (Enabled when isLengthType is true) */}
                      <td >
                        <Form.Control
                          type="number"
                          value={item.length}
                          onChange={(e) => handleRowChange(index, 'length', e.target.value)}
                          disabled={!item.isLengthType}
                          required={item.isLengthType}
                        />
                      </td>
                      <td>
                        <Form.Select
                          value={item.unit}
                          onChange={(e) => handleRowChange(index, 'unit', e.target.value)}
                          disabled={!item.isLengthType}
                          required={item.isLengthType}
                        >
                          <option value="">Unit</option>
                          <option value="meter">Meter</option>
                          <option value="millimeter">Millimeter</option>
                        </Form.Select>
                      </td>

                      {/* Pcs & Boxes (Enabled when isLengthType is false) */}
                      <td>
                        <Form.Control
                          type="number"
                          value={item.items}
                          onChange={(e) => handleRowChange(index, 'items', e.target.value)}
                          disabled={item.isLengthType}
                          required={!item.isLengthType}
                        />
                      </td>
                      <td>
                        <Form.Control
                          type="number"
                          value={item.box}
                          onChange={(e) => handleRowChange(index, 'box', e.target.value)}
                          disabled={item.isLengthType}
                          required={!item.isLengthType}
                        />
                      </td>

                      {/* Bundle (Enabled when isLengthType is true) */}
                      <td>
                        <Form.Control
                          type="number"
                          value={item.bundle}
                          onChange={(e) => handleRowChange(index, 'bundle', e.target.value)}
                          disabled={!item.isLengthType}
                          required={item.isLengthType}
                        />
                      </td>

                      {/* Quantity (Always enabled) */}
                      <td>
                        <Form.Control
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleRowChange(index, 'quantity', e.target.value)}
                          required
                        />
                      </td>

                      <td>
                        <Button
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

              <div className="text-center mt-4">
                <Button
                  type="submit"
                  style={{ backgroundColor: mainColor, borderColor: mainColor }}
                  size="lg"
                  onClick={handleSubmit}
                >
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