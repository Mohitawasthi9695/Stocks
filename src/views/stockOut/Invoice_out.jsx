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
  const [receivers, setReceivers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [shadeNo, setShadeNo] = useState([]);
  const [invoice_no, SetInvoiceNo] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [formData, setFormData] = useState({
    invoice_no: '',
    date: '',
    customer_id: '',
    company_id: '',
    place_of_supply: '',
    vehicle_no: '',
    station: '',
    ewaybill: '',
    reverse_charge: false,
    gr_rr: '',
    transport: '',
    irn: '',
    ack_no: '',
    ack_date: '',
    total_amount: '',
    cgst_percentage: '',
    igst_percentage: '',
    sgst_percentage: '',
    payment_mode: '',
    payment_status: '',
    payment_date: '',
    payment_bank: '',
    payment_account_no: '',
    payment_ref_no: '',
    payment_amount: '',
    payment_tailoring: '',
    qr_code: '',
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
    setShadeNo([]);

    if (categoryId) {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/productshadeno/${categoryId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        setShadeNo(response.data.data || []);
      } catch (error) {
        console.error('Error fetching ShadeNo:', error);
        setShadeNo([]);
      }
    }
  };

  useEffect(() => {
    const fetchInvoiceNo = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/stockout/invoiceno`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        });
  
        console.log("Fetched Invoice No:", response.data.data);
        SetInvoiceNo(response.data.data);
        setFormData((prevData) => ({
          ...prevData,
          invoice_no: response.data.data || "",  // Ensure it's set
        }));
      } catch (error) {
        console.error("Error fetching Invoice No:", error);
      }
    };
  
    fetchInvoiceNo();
  }, []);
  

  const handleShadeNoChange = async (event) => {
    setLoading(true);
    const selectedProductId = event.target.value;

    if (selectedProductId) {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/getgodownstocks/${selectedProductId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        setLoading(false);

        // Check if the response has data
        if (response.data && response.data.data) {
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

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/peoples?people_type=Customer`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        setCustomers(response.data.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchCustomerData();
  }, []);

  useEffect(() => {
    const fetchReceiverData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/peoples?people_type=Company`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        setReceivers(response.data.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchReceiverData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updatedForm = { ...prev, [name]: value };
      updateTotalAmount(selectedRows, updatedForm);
      return updatedForm;
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log("Submitting Invoice with Data:", formData);
  
    if (formData.out_products.length === 0) {
      toast.error("Please select at least one product.");
      return;
    }
  
    for (let product of formData.out_products) {
      if (!product.rate || isNaN(product.rate)) {
        toast.error("Each product must have a valid rate.");
        return;
      }
      if (!product.amount || isNaN(product.amount)) {
        toast.error("Each product must have a valid amount.");
        return;
      }
    }
  
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to create a new Invoice?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#20B2AA",
      confirmButtonText: "Yes, create it!",
    });
  
    if (!result.isConfirmed) return;
  
    try {
      console.log("Sending API Request...");
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/godownstockout`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
  
      console.log("Response:", response.data);
      toast.success("Invoice created successfully!");
      navigate("/all-invoices-out");
    } catch (error) {
      console.error("API Error:", error.response?.data?.message || error);
      toast.error(error.response?.data?.message || "Error processing request");
    }

    console.log(formData);
  };

  const convertLengthAndWidth = (length, width, lengthUnit, widthUnit) => {
    const conversionFactors = {
      Meter: 1,
      Inch: 0.0254,
      Feet: 0.3048
    };

    let convertedLength = length * conversionFactors[lengthUnit];
    let convertedWidth = width * conversionFactors[widthUnit];

    // Convert to the base unit (Meter)
    if (lengthUnit !== 'Meter') {
      convertedLength = convertedLength / conversionFactors[lengthUnit];
    }
    if (widthUnit !== 'Meter') {
      convertedWidth = convertedWidth / conversionFactors[widthUnit];
    }

    return { convertedLength, convertedWidth };
  };

  const columns = [
    { id: 'product_category', label: 'Product Category' },
    { id: 'product_shadeNo', label: 'Shade No' },
    { id: 'product_purchase_shade_no', label: 'Pur. Shade No' },
    { id: 'lot_no', label: 'LOT No' },
    { id: 'stock_code', label: 'Stock Code' },
    { id: 'width', label: 'Width' },
    { id: 'width_unit', label: 'W Unit' },
    { id: 'length', label: 'Length' },
    { id: 'length_unit', label: 'L Unit' },
    { id: 'out_pcs', label: 'Pcs' },
    { id: 'rack', label: 'Rack' }
  ];

  const handleCheckboxChange = (id) => {
    setSelectedRows((prevSelected) => {
      const isAlreadySelected = prevSelected.some((row) => row.godown_id === id);
  
      const updatedSelectedRows = isAlreadySelected
        ? prevSelected.filter((row) => row.godown_id !== id)
        : [...prevSelected, products.find((p) => p.godown_id === id)];
  
      // ✅ Update formData.out_products immediately
      setFormData((prevFormData) => ({
        ...prevFormData,
        out_products: updatedSelectedRows,
      }));
  
      return updatedSelectedRows;
    });
  };
  

  console.log('data', formData.invoice_no);
  const mainColor = '#3f4d67';
  const handleInputChange = (id, field, value) => {
    setSelectedRows((prevSelectedRows) => {
      const updatedRows = prevSelectedRows.map((row) => {
        if (row.godown_id === id) {
          let updatedRow = { ...row, [field]: value };
  
          // ✅ Ensure `amount` updates when `rate` or dimensions change
          if (['rate', 'width', 'length', 'out_pcs', 'width_unit', 'length_unit'].includes(field)) {
            updatedRow.amount = calculateAmount(updatedRow);
          }
  
          return updatedRow;
        }
        return row;
      });
  
      // ✅ Update `out_products` in formData
      setFormData((prevFormData) => ({
        ...prevFormData,
        out_products: updatedRows,
      }));
  
      return updatedRows;
    });
  };
  

  const updateTotalAmount = (rows, updatedForm = formData) => {
    let totalAmount = 0;

    rows.forEach((row) => {
      const amount = parseFloat(row.amount) || 0;
      const cgst = (parseFloat(updatedForm.cgst_percentage) / 100) * amount || 0;
      const sgst = (parseFloat(updatedForm.sgst_percentage) / 100) * amount || 0;
      const igst = (parseFloat(updatedForm.igst_percentage) / 100) * amount || 0;

      totalAmount += amount + cgst + sgst + igst;
    });

    setFormData((prev) => ({ ...prev, total_amount: totalAmount.toFixed(2) }));
  };
  const calculateAmount = (row) => {
    const rate = parseFloat(row.rate) || 0;
    let width = parseFloat(row.width) || 0;
    let length = parseFloat(row.length) || 0;
    const out_pcs = parseFloat(row.out_pcs) || 1;

    if (row.width_unit === 'centimeter') {
      width = width / 100;
    } else if (row.width_unit === 'Inch') {
      width = width * 0.0254;
    }

    if (row.length_unit === 'centimeter') {
      length = length / 100;
    } else if (row.length_unit === 'Inch') {
      length = length * 0.0254;
    }

    let areaSqM = width * length;
    let areaSqFt = areaSqM * 10.7639;

    let amount = rate * areaSqFt * out_pcs;

    return isNaN(amount) ? '0.00' : amount.toFixed(2);
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
              <h2 className="m-0 text-white">Add Invoice</h2>
            </div>
            <Card.Body className="p-5">
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={4}>
                    <FormField
                      icon={FaFileInvoice}
                      label="Invoice no"
                      name="invoice_no"
                      value={formData.invoice_no}
                      onChange={handleChange}
                      readOnly
                    />
                    <FormField
                      icon={FaUsers}
                      label="Seller"
                      name="company_id"
                      value={formData.company_id}
                      onChange={handleChange}
                      options={receivers}
                      add={'/add-Receiver'}
                      required
                    />
                    <FormField
                      icon={FaUser}
                      label="Customer"
                      name="customer_id"
                      value={formData.customer_id}
                      onChange={handleChange}
                      options={customers}
                      add={'/add-Customer'}
                      required
                    />
                    <FormField
                      icon={FaCalendarAlt}
                      label="Date"
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      required
                    />
                    <FormField
                      icon={FaMapMarkerAlt}
                      label="Place of Supply"
                      name="place_of_supply"
                      value={formData.place_of_supply}
                      onChange={handleChange}
                    />

                    <FormField
                      icon={FaMoneyBillWave}
                      label="Payment Mode"
                      name="payment_mode"
                      value={formData.payment_mode}
                      onChange={handleChange}
                      options={[
                        { id: 'cash', name: 'cash' },
                        { id: 'card', name: 'card' },
                        { id: 'online', name: 'online' },
                        { id: 'cheque', name: 'cheque' },
                        { id: 'other', name: 'other' }
                      ]}
                    />
                    <FormField
                      icon={FaMoneyBillWave}
                      label="Payment Amount"
                      name="payment_amount"
                      value={formData.payment_amount}
                      onChange={handleChange}
                    />
                  </Col>
                  <Col md={4}>
                    <FormField icon={FaTruck} label="Vehicle No" name="vehicle_no" value={formData.vehicle_no} onChange={handleChange} />
                    <FormField icon={FaCity} label="Station" name="station" value={formData.station} onChange={handleChange} />
                    <FormField icon={FaKey} label="eWaybill" name="ewaybill" value={formData.ewaybill} onChange={handleChange} />
                    <FormField icon={FaKey} label="Ack No" name="ack_no" value={formData.ack_no} onChange={handleChange} />
                    {/* <FormField icon={FaKey} label="IRN" name="irn" value={formData.irn} onChange={handleChange} /> */}
                    <FormField icon={FaMoneyBillWave} label="QR Code" name="qr_code" value={formData.qr_code} onChange={handleChange} />
                    <FormField
                      icon={FaMoneyBillWave}
                      label="Payment Bank"
                      name="payment_bank"
                      value={formData.payment_bank}
                      onChange={handleChange}
                    />
                    <FormField
                      icon={FaMoneyBillWave}
                      label="Payment Status"
                      name="payment_status"
                      value={formData.payment_status}
                      onChange={handleChange}
                      options={[
                        { id: 'paid', name: 'paid' },
                        { id: 'pending', name: 'pending' },
                        { id: 'failed', name: 'failed' }
                      ]}
                    />
                  </Col>

                  <Col md={4}>
                    <FormField icon={FaFileInvoice} label="GR/RR" name="gr_rr" value={formData.gr_rr} onChange={handleChange} />
                    <FormField icon={FaTruck} label="Transport" name="transport" value={formData.transport} onChange={handleChange} />
                    <FormField
                      icon={FaKey}
                      label="Reverse Charge"
                      name="reverse_charge"
                      value={formData.reverse_charge}
                      onChange={handleChange}
                      options={[
                        { id: 1, name: 'true' },
                        { id: 0, name: 'false' }
                      ]}
                    />
                    <FormField
                      icon={FaMoneyBillWave}
                      label="Payment A/C no"
                      name="payment_account_no"
                      value={formData.payment_account_no}
                      onChange={handleChange}
                    />
                    <FormField
                      icon={FaMoneyBillWave}
                      label="Payment Ref No"
                      name="payment_ref_no"
                      value={formData.payment_ref_no}
                      onChange={handleChange}
                    />
                    <FormField
                      icon={FaMoneyBillWave}
                      type="date"
                      label="Payment Date"
                      name="payment_date"
                      value={formData.payment_date}
                      onChange={handleChange}
                    />

                    <FormField
                      icon={FaMoneyBillWave}
                      label="Payment Tailoring"
                      name="payment_tailoring"
                      value={formData.payment_tailoring}
                      onChange={handleChange}
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
                        id="shadeNo"
                        className="form-select px-2"
                        style={{ width: '8rem', minWidth: 'fit-content' }}
                        disabled={!selectedCategoryId}
                        onChange={handleShadeNoChange}
                      >
                        <option value="">Select</option>
                        {shadeNo.map((shade) => (
                          <option key={shade.id} value={shade.id}>
                            {shade.shadeNo}
                          </option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                  </div>

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
                                      {/* Empty header for checkbox column */}
                                      <input
                                        type="checkbox"
                                        // onChange={(e) => setSelectedRows(e.target.checked ? products.map((row) => row.godown_id) : [])}
                                        // checked={selectedRows.length === products.length}
                                      />
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
                                    <tr key={row.godown_id}>
                                      <td>
                                        <input type="checkbox" onChange={() => handleCheckboxChange(row.godown_id)} />
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
                                  <th>Rate</th>
                                  <th>Amount</th>
                                </tr>
                              </thead>
                              <tbody>
                                {selectedRows.map((row) => (
                                  <tr key={row.godown_id}>
                                    <td key="product_category">{row.product_category}</td>
                                    <td key="shadeNo">{row.product_shadeNo}</td>
                                    <td key="pur_shadeNo">{row.product_shadeNo}</td>
                                    <td key="lot_no">{row.lot_no}</td>
                                    <td key="stock_code">{row.stock_code}</td>
                                    {/* <td key="width">{row.width}</td> */}
                                    <td key={`width-${row.godown_id}`}>
                                      <input
                                        type="text"
                                        value={row.width || ''}
                                        className="py-2 border border-gray-300 px-2 w-full"
                                        onChange={(e) => handleInputChange(row.godown_id, 'width', e.target.value)}
                                      />
                                    </td>
                                    <td key="width_unit">
                                      <select
                                        value={row.width_unit || ''}
                                        className="py-2"
                                        onChange={(e) => handleInputChange(row.godown_id, 'width_unit', e.target.value)}
                                      >
                                        <option value="Meter">Meter</option>
                                        <option value="Inch">Inch</option>
                                        <option value="centimeter">cm</option>
                                      </select>
                                    </td>

                                    <td key={`length-${row.godown_id}`}>
                                      <input
                                        type="text"
                                        value={row.length || ''}
                                        className="py-2"
                                        onChange={(e) => handleInputChange(row.godown_id, 'length', e.target.value)}
                                      />
                                    </td>
                                    <td key="length_unit">
                                      <select
                                        value={row.length_unit || ''}
                                        className="py-2"
                                        onChange={(e) => handleInputChange(row.godown_id, 'length_unit', e.target.value)}
                                      >
                                        <option value="Meter">Meter</option>
                                        <option value="Inch">Inch</option>
                                        <option value="centimeter">cm</option>
                                      </select>
                                    </td>
                                    <td key="out_pcs">
                                      <input
                                        type="text"
                                        value={row.out_pcs || ''}
                                        className="py-2"
                                        onChange={(e) => handleInputChange(row.godown_id, 'out_pcs', e.target.value)}
                                      />
                                    </td>
                                    <td key="rack">{row.rack}</td>

                                    <td key="rate">
                                      <input
                                        type="text"
                                        value={row.rate || ''}
                                        className="py-2"
                                        onChange={(e) => handleInputChange(row.godown_id, 'rate', e.target.value)}
                                      />
                                    </td>
                                    <td key="amount">
                                      <input
                                        type="text"
                                        value={row.amount || ''}
                                        className="py-2"
                                        onChange={(e) => handleInputChange(row.godown_id, 'amount', e.target.value)}
                                      />
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Row className="mt-4">
                    <Col md={3}>
                      <FormField
                        icon={FaMoneyBillWave}
                        label="Total Amount"
                        name="total_amount"
                        value={formData.total_amount}
                        onChange={handleChange}
                      />
                    </Col>
                    <Col md={3}>
                      <FormField
                        icon={FaPercentage}
                        label="SGST(%)"
                        name="sgst_percentage"
                        value={formData.sgst_percentage}
                        onChange={handleChange}
                      />
                    </Col>
                    <Col md={3}>
                      <FormField
                        icon={FaPercentage}
                        label="CGST(%)"
                        name="cgst_percentage"
                        value={formData.cgst_percentage}
                        onChange={handleChange}
                      />
                    </Col>
                    <Col md={3}>
                      <FormField
                        icon={FaPercentage}
                        label="IGST(%)"
                        name="igst_percentage"
                        value={formData.igst_percentage}
                        onChange={handleChange}
                      />
                    </Col>

                    <Col md={3}>
                      <FormField
                        icon={FaCalendarAlt}
                        label="Ack Date"
                        type="date"
                        name="ack_date"
                        value={formData.ack_date}
                        onChange={handleChange}
                      />
                    </Col>
                  </Row>
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