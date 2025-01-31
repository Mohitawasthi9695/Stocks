import React, { useState, useEffect } from 'react';
import { Table, Form, Button, Card, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaUserPlus, FaTrash, FaPlus } from 'react-icons/fa';
import Skeleton from 'react-loading-skeleton';
import DataTable from 'react-data-table-component';
import { MdEdit, MdDelete, MdPersonAdd } from 'react-icons/md';
import Swal from 'sweetalert2';

import 'react-loading-skeleton/dist/skeleton.css';
import {
  FaFileInvoice,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUsers,
  FaKey,
  FaMoneyBillWave,
  FaPercentage,
  FaTruck,
  FaCity,
  FaSignature,
  FaQrcode
} from 'react-icons/fa';
import FormField from '../../components/FormField';

const Invoice_out = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [sub_supervisors, setSub_supervisor] = useState([]);
  const [accessory, setAccessory] = useState([]);
  const [invoice_no, SetInvoiceNo] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const today = new Date().toISOString().split('T')[0];
  const [categories, setCategories] = useState([]);
  const warehouse_supervisor_id = JSON.parse(localStorage.getItem('user')).id || 'N/A';
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [formData, setFormData] = useState({
    invoice_no: '',
    date: today,
    warehouse_supervisor_id: warehouse_supervisor_id,
    godown_supervisor_id: '',
    out_products: []
  });

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
    setAccessory([]);

    if (categoryId) {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/accessory/category/${categoryId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        console.log(response.data.data);
        setAccessory(response.data.data || []);
      } catch (error) {
        console.error('Error fetching Accessory:', error);
        setAccessory([]);
      }
    }
  };
  useEffect(() => {
    const fetchAccessory = async () => {
      if (!selectedCategoryId) return;

      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/accessory/category/${selectedCategoryId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        console.log(response.data.data);
        setAccessory(response.data.data);
      } catch (error) {
        console.error('Error fetching Accessory:', error);
        setAccessory([]);
      }
    };

    fetchAccessory();
  }, [selectedCategoryId]);

  useEffect(() => {
    const fetchInvoiceNo = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/godowns/gatepassno`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        console.log('log', response.data.data);
        const invoiceData = response.data.data; 
        SetInvoiceNo(invoiceData);
        setFormData((prevData) => ({
          ...prevData,
          invoice_no: invoiceData // Ensure this is set correctly
        }));
      } catch (error) {
        console.error('Error fetching Invoice No data:', error);
      }
    };
    fetchInvoiceNo();
  }, []);

  const handleAccessoryChange = async (event) => {
    setLoading(true);
    const selectedShadeId = event.target.value; // Get selected shade ID

    if (selectedShadeId) {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/warehouse/accessory/category/${selectedShadeId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        setLoading(false);
        console.log('Fetched Product Data:', response.data.data);
        setProducts(response.data.data);
      } catch (error) {
        setLoading(false);
        console.error('Error fetching product data:', error);
      }
    } else {
      setProducts([]);
    }
  };

  useEffect(() => {
    const fetchReceiverData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/sub_supervisor`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        console.log(response.data.data);
        setSub_supervisor(response.data.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchReceiverData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);

    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleInputChange = (id, field, value) => {
    setSelectedRows((prevSelectedRows) => {
      const updatedRows = prevSelectedRows.map((row) => {
        if (row.warehouse_accessory_id === id) {
          const updatedRow = { ...row, [field]: value };
          if (field === 'box') {
            updatedRow.out_quantity = (Number(updatedRow.items) || 0) * (Number(value) || 0);
          }
          return updatedRow;
        }
        return row;
      });
      setFormData((prevFormData) => ({
        ...prevFormData,
        out_products: updatedRows
      }));

      return updatedRows;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to submit the form?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, submit it!'
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/godowns/accessory/gatepass`, formData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      await Swal.fire({
        title: 'Success!',
        text: 'Stocks out successfully!',
        icon: 'success',
        confirmButtonColor: '#3085d6'
      });

      toast.success('Stocks out successfully');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error adding user';

      await Swal.fire({
        title: 'Error!',
        text: errorMessage,
        icon: 'error',
        confirmButtonColor: '#d33'
      });

      toast.error(errorMessage);
    }

    console.log(formData);
  };

  const columns = [

    { id: 'product_category', label: 'Product Category' },
    { id: 'product_accessory_name', label: 'Accessory Name' },
    { id: 'lot_no', label: 'LOT No' },
    { id: 'items', label: 'Items' },
    { id: 'out_length', label: 'Length' },
    { id: 'unit', label: ' Unit' },
    { id: 'box', label: 'Box/Bundle' },
    { id: 'out_quantity', label: 'Quantity' }
  ];

  const handleCheckboxChange = (id) => {
    setSelectedRows((prevSelected) => {
      const isAlreadySelected = prevSelected.some((row) => row.warehouse_accessory_id === id);

      let updatedSelectedRows;
      if (isAlreadySelected) {
        updatedSelectedRows = prevSelected.filter((row) => row.warehouse_accessory_id !== id);
      } else {
        const selectedItem = products.find((p) => p.warehouse_accessory_id === id);
        updatedSelectedRows = selectedItem ? [...prevSelected, selectedItem] : prevSelected;
      }
      setFormData((prevFormData) => ({
        ...prevFormData,
        out_products: updatedSelectedRows
      }));

      return updatedSelectedRows;
    });
  };

  console.log('data', formData.invoice_no);
  const mainColor = '#3f4d67';
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
              <h2 className="m-0 text-white">Generate GatePass For GoDown</h2>
            </div>
            <Card.Body className="p-5">
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={4}>
                    <FormField icon={FaFileInvoice} label="GatePass No" name="invoice_no" value={invoice_no} readOnly />
                  </Col>
                  <Col md={4}>
                    <FormField icon={FaCalendarAlt} label="Date" type="date" name="date" value={formData.date} onChange={handleChange} />
                  </Col>
                  <Col md={4}>
                    <FormField
                      icon={FaUser}
                      label="Godown Suppervisor"
                      name="godown_supervisor_id"
                      value={formData.sub_supervisor}
                      onChange={handleChange}
                      options={sub_supervisors}
                    />
                  </Col>
                </Row>
                <hr />

                <div>
                  <div style={{ display: 'flex', justifyContent: 'start' }}>
                    <Form.Group>
                      <Form.Label>Select Category:</Form.Label>
                      <Form.Control
                        as="select"
                        id="category"
                        className="form-select px-2"
                        style={{ width: '8rem', minItems: 'fit-content', color: 'black' }}
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
                        id="accessory_name"
                        className="form-select px-2"
                        style={{ width: '8rem', minItems: 'fit-content' }}
                        disabled={!selectedCategoryId}
                        onChange={handleAccessoryChange}
                      >
                        <option value="">Select</option>
                        {accessory.map((shade) => (
                          <option key={shade.id} value={shade.id}>
                            {shade.accessory_name}
                          </option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                  </div>

                  <div className="row" style={{ marginTop: '5%' }}>
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
                                      <input type="checkbox" />
                                    </th>
                                    {columns.map((column) => (
                                      <th key={column.id} scope="col">
                                        {column.label}
                                      </th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody>
                                  {products.map((row) => (
                                    <tr key={row.warehouse_accessory_id}>
                                      <td>
                                        <input type="checkbox" onChange={() => handleCheckboxChange(row.warehouse_accessory_id)} />
                                      </td>
                                      {columns.map((column) => (
                                        <td key={column.id}>{row[column.id]}</td>
                                      ))}
                                    </tr>
                                  ))}
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
                                  {columns.map((column) => (
                                    <th key={column.id} scope="col">
                                      {column.label}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {selectedRows.map((row) => (
                                  <tr key={row.warehouse_accessory_id}>
                                    <td key="product_category">{row.product_category}</td>
                                    <td key="product_accessory_name">{row.product_accessory_name}</td>
                                    <td key="lot_no">{row.lot_no || '-'}</td>
                                    <td key="items">{row.items || '-'}</td> 
                                    <td key="out_length">{row.out_length || '-'}</td> 
                                    <td key="unit">{row.unit || '-'}</td> 
                                    <td key="box">
                                      <input
                                        type="number"
                                        className="form-control"
                                        style={{ width: '5rem', paddingInline: '10px' }}
                                        value={row.box || ''}
                                        onChange={(e) => handleInputChange(row.warehouse_accessory_id, 'box', e.target.value)}
                                      />
                                    </td>
                                    <td key="out_quantity">{(row.box || 0) * (row.items || 0)}</td> {/* Dynamic Out Quantity */}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <Button
                  variant="primary"
                  type="submit"
                  className="mt-5 d-block m-auto"
                  style={{
                    backgroundColor: mainColor,
                    borderColor: mainColor,
                    width: '10rem'
                  }}
                >
                  <FaUserPlus className="me-2" /> Stock out
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Invoice_out;
