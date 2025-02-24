import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Table, Form, Button, Container, Row, Col } from 'react-bootstrap';
import { FaUserPlus, FaPlus, FaTrash } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';

const AddProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [godownStocks, setGodownStocks] = useState([]);

  useEffect(() => {
    const fetchGodownStocks = async () => {
      try {
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
        if (!API_BASE_URL) {
          console.error('API_BASE_URL is not defined');
          return;
        }
        const response = await axios.get(`${API_BASE_URL}/api/godownverticalstock/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (!response.data || !response.data.data) {
          throw new Error('Invalid API response format');
        }
        setGodownStocks([response.data.data]); // Store as an array
      } catch (error) {
        toast.error(error.response?.data?.message || 'Error fetching godown stocks');
        console.error('Fetch Error:', error);
      }
    };
    fetchGodownStocks();
  }, [id]);

  const handleAddRow = () => {
    if (godownStocks.length === 0) return; // Prevent adding if no base data

    const newRow = {
      ...godownStocks[0], // Duplicate existing row
      gate_pass_id: godownStocks[0].gate_pass_id,
      stock_in_id: godownStocks[0].stock_in_id,
      length: '',
      rack: ''
    };

    setGodownStocks((prevStocks) => [...prevStocks, newRow]);
  };

  const handleRowChange = (index, field, value) => {
    setGodownStocks((prevStocks) => {
      const updatedStocks = [...prevStocks];
      updatedStocks[index] = { ...updatedStocks[index], [field]: value };
      return updatedStocks;
    });
  };

  const handleDeleteRow = (index) => {
    if (godownStocks.length === 1) {
      toast.warn("At least one row is required.");
      return;
    }

    setGodownStocks((prevStocks) => prevStocks.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = godownStocks.map((item) => ({
        gate_pass_id: item.gate_pass_id || '',
        stock_in_id: item.stock_in_id || '',
        gate_pass_no: item.gate_pass_no,
        gate_pass_date: item.gate_pass_date,
        date: item.date || new Date().toISOString().split('T')[0],
        product_id: item.product_id,
        lot_no: item.lot_no,
        length: parseFloat(item.length) || 0,
        length_unit: item.length_unit,
        type: 'stock',
        rack: item.rack
      }));

      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/godownverticalstock`, payload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      toast.success('Godown Vertical Stock Updated');
      navigate('/godown/vertical_stock');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error updating stock');
      console.error(error);
    }
  };

  return (
    <Container fluid className="pt-4 px-2" style={{ border: '3px dashed #14ab7f', borderRadius: '8px', background: '#ff9d0014' }}>
      <Row className="justify-content-center">
        <Col md={12} lg={12}>
          <div className="card shadow-lg border-0 rounded-lg">
            <div className="card-body p-5">
              <h3 className="text-center mb-4">Show Vertical Stock</h3>

              <Button variant="success" onClick={handleAddRow} className="mb-3 d-block ms-auto">
                <FaPlus /> Add Row
              </Button>

              <form onSubmit={handleSubmit}>
                <div style={{ overflowX: 'auto' }}>
                  <Table bordered hover responsive style={{ minWidth: '1500px' }}>
                    <thead>
                      <tr className="text-white text-center">
                        <th>Gate Pass No</th>
                        <th>Gate Pass Date</th>
                        <th>Stock Code</th>
                        <th>Product Category Name</th>
                        <th>Product Name</th>
                        <th>Lot No</th>
                        <th>Length</th>
                        <th>Length Unit</th>
                        <th>Rack</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {godownStocks.map((item, index) => (
                        <tr key={index} className="text-center">
                          <td><Form.Control type="text" value={item.gate_pass_no || ''} disabled /></td>
                          <td><Form.Control type="text" value={item.gate_pass_date || ''} disabled /></td>
                          <td><Form.Control type="text" value={item.stock_code || ''} disabled /></td>
                          <td><Form.Control type="text" value={item.product_category_name || ''} disabled /></td>
                          <td><Form.Control type="text" value={item.product_name || ''} disabled /></td>
                          <td><Form.Control type="text" value={item.lot_no || ''} disabled /></td>
                          <td>
                            <Form.Control
                              type="number"
                              value={item.length || ''}
                              onChange={(e) => handleRowChange(index, 'length', e.target.value)}
                            />
                          </td>
                          <td><Form.Control type="text" value={item.length_unit || ''} disabled /></td>
                          <td>
                            <Form.Control
                              type="text"
                              value={item.rack || ''}
                              onChange={(e) => handleRowChange(index, 'rack', e.target.value)}
                            />
                          </td>
                          <td>
                            <Button variant="danger" size="sm" onClick={() => handleDeleteRow(index)}>
                              <FaTrash /> Delete
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>

                <Button
                  variant="primary"
                  type="submit"
                  className="mt-5 d-block m-auto"
                  style={{ backgroundColor: '#3f4d67', borderColor: '#3f4d67', width: '10rem' }}
                >
                  <FaUserPlus className="me-2" /> Update Stock
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
