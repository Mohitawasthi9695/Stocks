import React, { useState, useEffect } from 'react';
import { Table, Form, Button, Card, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { FaUser, FaUserPlus, FaTrash, FaPlus } from 'react-icons/fa';
import Skeleton from 'react-loading-skeleton';
import DataTable from 'react-data-table-component';
import { MdEdit, MdDelete, MdPersonAdd } from 'react-icons/md';
import Swal from 'sweetalert2';
import 'react-loading-skeleton/dist/skeleton.css';
import { FaToggleOn, FaToggleOff } from 'react-icons/fa';
import {
  FaFileInvoice,
  FaCalendarAlt,
  FaMapMarkerAlt,
} from 'react-icons/fa';
import FormField from '../../components/FormField';
import { FaExchangeAlt } from 'react-icons/fa';

const Invoice_out = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [accessories, setAccessories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [type, setType] = useState(0);
  // Track which rows are checked
  const [checkedRows, setCheckedRows] = useState({});

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/products/category`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        setCategories(response.data.data || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryChange = async (event) => {
    const categoryId = event.target.value;
    setSelectedCategoryId(categoryId);
    setAccessories([]);
    setCheckedRows({}); // Reset checked rows when changing category
    if (categoryId) {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/accessory/category/${categoryId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        console.log('Fetched Accessories:', response.data.data);
        setAccessories(response.data.data || []);
      } catch (error) {
        console.error('Error fetching accessories:', error);
        setAccessories([]);
      }
    }
  };

  const handleaccessoriesChange = async (event) => {
    setLoading(true);
    const selectedProductId = event.target.value;
    setCheckedRows({}); // Reset checked rows when changing accessory
    if (selectedProductId) {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/godown/getaccessory/${selectedProductId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        setLoading(false);
        if (response.data) {
          console.log('Fetched Product Data:', response.data.data);
          setProducts(response.data.data);
        } else {
          toast.error('No products found.');
          setProducts([]); // Reset product list
        }
      } catch (error) {
        setLoading(false);
        if (error.response) {
          console.error('Error fetching product data:', error.response.data.message);
          toast.error(error.response.data.message || 'Something went wrong.');
        } else {
          console.error('Network error:', error);
          toast.error('Network error. Please try again.');
        }
        setProducts([]);
      }
    } else {
      setProducts([]);
    }
  };

  const handleInputChange = (rowId, field, value) => {
    setSelectedRows(prevRows => {
      return prevRows.map(row => {
        if (row.row_id === rowId) {
          const updatedRow = { ...row, [field]: value };

          // Calculate amount if rate is provided
          if (field === 'rate' || field === 'quantity' || field === 'length') {
            const rate = parseFloat(field === 'rate' ? value : row.rate || 0);
            let quantity = 0;

            if (updatedRow.type === 0) { // PCS type
              quantity = parseFloat(updatedRow.quantity || 0);
            } else { // Dimension type
              quantity = parseFloat(updatedRow.length || 0);
            }

            if (!isNaN(rate) && !isNaN(quantity)) {
              updatedRow.amount = (rate * quantity).toFixed(2);
            }
          }

          return updatedRow;
        }
        return row;
      });
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedRows.length === 0) {
      toast.error('Please select at least one item to proceed.');
      return;
    }

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to create a new Invoice?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#20B2AA',
      confirmButtonText: 'Yes, create it!'
    });

    if (!result.isConfirmed) return;

    try {
      // Transform the selected rows into the format expected by the API
      const formattedData = selectedRows.map(row => {
        return {
          stockout_details_id: parseInt(id),
          godown_accessory_id: row.godown_id || row.id,
          product_accessory_id: row.product_accessory_id || row.accessory_id,
          hsn_sac_code: row.hsn_sac_code || null,
          lot_no: row.lot_no || null,
          date: row.date || null,
          stock_code: row.stock_code || "",
          length: row.type === 1 ? parseFloat(row.length) || null : null,
          length_unit: row.type === 1 ? row.length_unit || null : null,
          items: row.items || "",
          rate: row.rate ? parseFloat(row.rate) : null,
          gst: row.gst ? parseFloat(row.gst) : null,
          amount: row.amount ? parseFloat(row.amount) : null,
          box_bundle: row.box_bundle || "",
          out_quantity: row.type === 0 ? parseFloat(row.quantity) || null : null,
          quantity: row.quantity ? parseFloat(row.quantity) : null,
        };
      });

      console.log('Sending API Request with data:', JSON.stringify(formattedData, null, 2));

      console.log('Sending API Request with data:', formattedData);
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/godownaccessoryout`,
        formattedData, // Send as array
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      console.log('Response:', response.data);
      toast.success('Invoice created successfully!');
      navigate('/operator_invoice');
    } catch (error) {
      console.error('API Error:', error);
      toast.error(error.response?.data?.message || 'Error processing request');
    }
  };

  const columns = [
    { id: 'product_category', label: 'Product Category' },
    { id: 'product_accessory_name', label: 'Accessory' },
    { id: 'lot_no', label: 'LOT No' },
    { id: 'stock_code', label: 'Stock Code' },
    { id: 'items', label: 'Items' },
    { id: 'length', label: 'Length' },
    { id: 'length_unit', label: 'L Unit' },
    { id: 'quantity', label: 'Pcs' },
    { id: 'box_bundle', label: 'Rack' }
  ];

  const handleCheckboxChange = (id) => {
    setCheckedRows(prev => {
      const newCheckedRows = { ...prev };
      newCheckedRows[id] = !prev[id];
      return newCheckedRows;
    });
    if (!checkedRows[id]) {
      const selectedProduct = products.find(p => p.godown_id === id || p.id === id);
      if (selectedProduct) {
        const isAlreadySelected = selectedRows.some(row =>
          (row.godown_id && row.godown_id === selectedProduct.godown_id) ||
          row.id === selectedProduct.id
        );
        if (!isAlreadySelected) {
          setSelectedRows(prevSelected => [
            ...prevSelected,
            {
              ...selectedProduct,
              row_id: new Date().getTime() + Math.random(),
              type: 0,
              rate: 0,
              amount: 0
            }
          ]);
        }
      }
    }
  };

  const mainColor = '#3f4d67';

  const handleAddRow = (originalRow) => {
    const newRow = {
      ...originalRow,
      row_id: new Date().getTime() + Math.random()
    };
    setSelectedRows(prevRows => [...prevRows, newRow]);
  };

  const handleDeleteRow = (rowId) => {
    setSelectedRows(prevRows => prevRows.filter(row => row.row_id !== rowId));
  };

  const handleToggleType = (rowId) => {
    setSelectedRows((prevRows) => prevRows.map((row) => {
      if (row.row_id === rowId) {
        const newType = row.type === 0 ? 1 : 0;
        if (newType === 0) {
          return { ...row, type: newType };
        } else {
          return { ...row, type: newType };
        }
      }
      return row;
    }));
  };

  return (
    <Container
      fluid
      className="pt-1 px-2"
      style={{
        border: '3px dashed #14ab7f',
        borderRadius: '8px',
        background: '#ff9d0014'
      }}
    >
      <Row className="justify-content-center">
        <Col md={12} lg={12}>
          <Card className="shadow-lg border-0" style={{ borderRadius: '15px' }}>
            <div
              className="p-4 text-white text-center"
              style={{
                backgroundColor: '#20B2AA',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <FaUserPlus size={40} className="me-3" />
              <h2 className="m-0 text-white">Accessory Stock Out</h2>
            </div>
            <Card.Body className="p-5">
              <Form onSubmit={handleSubmit}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'start' }}>
                    <Form.Group>
                      <Form.Label>Select Category:</Form.Label>
                      <Form.Control
                        as="select"
                        id="category"
                        className="form-select px-2"
                        style={{ width: '8rem', minWidth: 'fit-content', color: 'black' }}
                        onChange={handleCategoryChange}
                      >
                        <option value="">Select</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id} style={{ color: 'black' }}>
                            {category.product_category}
                          </option>
                        ))}
                      </Form.Control>
                    </Form.Group>

                    <Form.Group style={{ marginLeft: '20px' }}>
                      <Form.Label>Select Shade Number:</Form.Label>
                      <Form.Control
                        as="select"
                        id="accessories"
                        className="form-select px-2"
                        style={{ width: '8rem', minWidth: 'fit-content' }}
                        disabled={!selectedCategoryId}
                        onChange={handleaccessoriesChange}
                      >
                        <option value="">Select</option>
                        {accessories.map((accessorie) => (
                          <option key={accessorie.id} value={accessorie.id}>
                            {accessorie.accessory_name}
                          </option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-12">
                      <div className="card rounded-lg shadow-none" style={{ background: '#f5f0e6' }}>
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
                            <div className="table-responsive">
                              <table className="table table-hover table-bordered align-middle">
                                <thead className="table-dark">
                                  <tr>
                                    <th scope="col" style={{ width: '50px' }}>
                                      Select
                                    </th>
                                    {columns.map((column) => (
                                      <th key={column.id} scope="col">
                                        {column.label}
                                      </th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody>
                                  {products.map((row) => {
                                    const rowId = row.godown_id || row.id;
                                    return (
                                      <tr key={rowId}>
                                        <td>
                                          <input
                                            type="checkbox"
                                            onChange={() => handleCheckboxChange(rowId)}
                                            checked={!!checkedRows[rowId]}
                                          />
                                        </td>
                                        {columns.map((column) => (
                                          <td key={column.id}>{row[column.id]} </td>
                                        ))}
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}
                        <div className="mt-3">
                          <h4 className="ms-4 mb-3">Selected Rows:</h4>
                        </div>
                        <div className="card-body p-0" style={{ borderRadius: '8px' }}>
                          <div className="table-responsive">
                            <table className="table table-hover table-bordered align-middle">
                              <thead className="table-dark">
                                <tr>
                                  <th>Type</th>
                                  {columns.map((column) => (
                                    <th key={column.id} scope="col">
                                      {column.label}
                                    </th>
                                  ))}
                                  <th>Rate</th>
                                  <th>Amount</th>
                                  <th>Add</th>
                                  <th>Delete</th>
                                </tr>
                              </thead>
                              <tbody>
                                {selectedRows.map((row) => (
                                  <tr key={row.row_id}>
                                    <td key="type">
                                      <div
                                        onClick={() => handleToggleType(row.row_id)}
                                        className="relative w-14 h-7 flex flex-col items-center justify-center rounded-full transition-all duration-300"
                                      >
                                        {/* Toggle Switch */}
                                        <label style={{ position: 'relative', display: 'inline-block', width: '34px', height: '20px' }}>
                                          <input
                                            type="checkbox"
                                            checked={row.type === 1}
                                            onChange={() => handleToggleType(row.row_id)}
                                            style={{ opacity: 0, width: 0, height: 0 }}
                                          />
                                          <span
                                            style={{
                                              position: 'absolute',
                                              cursor: 'pointer',
                                              top: 0,
                                              left: 0,
                                              right: 0,
                                              bottom: 0,
                                              backgroundColor: row.type === 1 ? '#4caf50' : '#ccc', // Green for Dimension, Gray for PCS
                                              transition: '0.4s',
                                              borderRadius: '20px',
                                            }}
                                          ></span>
                                          <span
                                            style={{
                                              position: 'absolute',
                                              content: '',
                                              height: '14px',
                                              width: '14px',
                                              left: row.type === 1 ? '18px' : '3px',
                                              bottom: '3px',
                                              backgroundColor: 'white',
                                              transition: '0.4s',
                                              borderRadius: '50%',
                                            }}
                                          ></span>
                                        </label>
                                      </div>
                                    </td>
                                    <td key="product_category">{row.product_category}</td>
                                    <td key="product_accessory_name">{row.product_accessory_name}</td>
                                    <td key="lot_no">{row.lot_no}</td>
                                    <td key="stock_code">{row.stock_code}</td>
                                    <td key="items">
                                      {row.items}
                                    </td>
                                    <td>
                                      <input
                                        type="text"
                                        value={row.length || ''}
                                        className="py-2 border border-gray-300 px-2 w-full"
                                        onChange={(e) => handleInputChange(row.row_id, 'length', e.target.value)}
                                        disabled={row.type === 0}
                                      />
                                    </td>
                                    <td>
                                      <select
                                        value={row.length_unit || ''}
                                        className="py-2"
                                        onChange={(e) => handleInputChange(row.row_id, 'length_unit', e.target.value)}
                                        disabled={row.type === 0}
                                      >
                                        <option value="Meter">Meter</option>
                                        <option value="Inch">Inch</option>
                                        <option value="cm">cm</option>
                                        <option value="ft">Feet</option>
                                      </select>
                                    </td>
                                    <td>
                                      <input
                                        type="number"
                                        value={row.quantity || ''}
                                        className="py-2 border border-gray-300 px-2 w-full"
                                        onChange={(e) => handleInputChange(row.row_id, 'quantity', e.target.value)}
                                        disabled={row.type === 1} 
                                      />
                                    </td>
                                    <td>{row.box_bundle}</td>
                                    <td>
                                      <input
                                        type="number"
                                        value={row.rate || ''}
                                        className="py-2 border border-gray-300 px-2 w-full"
                                        onChange={(e) => handleInputChange(row.row_id, 'rate', e.target.value)}
                                      />
                                    </td>
                                    <td>
                                      <input
                                        type="text"
                                        value={row.amount || '0.00'}
                                        className="py-2 border border-gray-300 px-2 w-full bg-gray-100"
                                        readOnly
                                      />
                                    </td>
                                    <td>
                                      <div>
                                        <FaPlus
                                          className="text-green-500 cursor-pointer"
                                          onClick={() => handleAddRow(row)}
                                          style={{ fontSize: '20px' }}
                                        />
                                      </div>
                                    </td>
                                    <td>
                                      <div>
                                        <FaTrash
                                          className="text-red-500 cursor-pointer"
                                          onClick={() => handleDeleteRow(row.row_id)}
                                          style={{ fontSize: '20px' }}
                                        />
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                      <div className="text-center mt-4">
                        <Button type="submit" style={{ backgroundColor: mainColor, borderColor: mainColor }} size="lg">
                          Submit Stock
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Invoice_out;