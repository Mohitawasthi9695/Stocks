import React, { useState, useEffect } from 'react';
import { Table, Form, Button, Card, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FaUser,FaBookOpen, FaTrash, FaPlus } from 'react-icons/fa';
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
import { error } from 'jquery';
import { color } from 'd3';
import { title } from 'process';

const Add_inoice = () => {
  const today = new Date().toISOString().split('T')[0];
  const [formData, setFormData] = useState({
    invoice_no: '',
    place_of_supply: '',
    agent: '',
    warehouse: '',
    people_id: '1',
    date: today,
    irn: '',
    ack_no: '',
    ack_date: today,
    vehicle_no: '',
    station: '',
    ewaybill: '',
    gr_rr: '',
    transport: '',
    reverse_charge: '',
    qr_code: ''
  });
  const [items, setItems] = useState([]);
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState([]);
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/products`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        setProducts(response.data.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchProductData();
  }, []);

  useEffect(() => {
    const fetchSupplierData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/peoples?people_type=Supplier`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        setSuppliers(response.data.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchSupplierData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);

    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to add new field?',
      icon: 'question',
      showCancelButton: 'true',
      cancelButtonColor: '#d33',
      confirmButtonColor: '#20b2AA',
      confirmButtonText: 'Yes, create it!'
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/stockin/invoice`, formData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      toast.success('Invoice added successfully');
      navigate('/invoices');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error adding user';
      toast.error(errorMessage);
    }

    console.log(formData);
  };

  const mainColor = '#3f4d67';

  const customStyles = {
    table: {
      style: {
        borderCollapse: 'separate', // Ensures border styles are separate
        borderSpacing: 0 // Removes spacing between cells
      }
    },
    header: {
      style: {
        backgroundColor: '#2E8B57',
        color: '#fff',
        fontSize: '18px',
        fontWeight: 'bold',
        padding: '15px',
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
        padding: '15px',
        borderRight: '1px solid #e0e0e0' // Vertical lines between header cells
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
        borderRight: '1px solid grey' // Vertical lines between cells
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
        color: 'black', // Makes the arrows white
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
      <Row className="justify-content-center" >
        <Col md={12} lg={12}>
          <Card className="shadow-lg border-0" style={{ borderRadius: '15px'}}>
            <div
              className="p-4 text-white text-center"
              style={{
                backgroundColor: '#20B2AA',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                // borderRadius: '15px 15px 0 0'
              }}
            >
              <FaBookOpen size={40} className="me-3" />
              <h2 className="m-0 text-white">Add Invoice</h2>
            </div>
            <Card.Body className="p-5">
              <Form onSubmit={handleSubmit} customStyles={customStyles}>
                <Row>
                  <Col md={4}>
                    <FormField
                      icon={FaFileInvoice}
                      label="Invoice_no"
                      name="invoice_no"
                      value={formData.invoice_no}
                      onChange={handleChange}
                    />
                    <FormField
                      icon={FaUser}
                      label="Supplier"
                      name="supplier_id"
                      value={formData.people_id}
                      onChange={handleChange}
                      options={suppliers}
                      add={'/add-Supplier'}
                    />
                    {/* <FormField icon={FaCalendarAlt} label="Date" type="date" name="date" value={formData.date} onChange={handleChange} /> */}
                    <FormField icon={FaKey} label="IRN" name="irn" value={formData.irn} onChange={handleChange} />
                    <FormField
                      icon={FaMapMarkerAlt}
                      label="Place of Supply"
                      name="place_of_supply"
                      value={formData.place_of_supply}
                      onChange={handleChange}
                    />
                    <FormField icon={FaKey} label="Agent" name="agent" value={formData.agent} onChange={handleChange} />
                    <FormField icon={FaKey} label="Warehouse" name="warehouse" value={formData.warehouse} onChange={handleChange} />
                  </Col>
                  <Col md={4}>
                    <FormField icon={FaTruck} label="Vehicle No" name="vehicle_no" value={formData.vehicle_no} onChange={handleChange} />
                    <FormField icon={FaCity} label="Station" name="station" value={formData.station} onChange={handleChange} />
                    <FormField icon={FaKey} label="eWaybill" name="ewaybill" value={formData.ewaybill} onChange={handleChange} />
                    <FormField icon={FaKey} label="Ack No" name="ack_no" value={formData.ack_no} onChange={handleChange} />
                    <FormField
                      icon={FaMoneyBillWave}
                      label="Total Amount"
                      name="total_amount"
                      value={formData.total_amount}
                      onChange={handleChange}
                    />
                    <FormField
                      icon={FaCalendarAlt}
                      label="Ack Date"
                      type="date"
                      name="ack_date"
                      value={formData.ack_date}
                      onChange={handleChange}
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
                    />

                    <FormField
                      icon={FaPercentage}
                      label="CGST(%)"
                      name="cgst_percentage"
                      value={formData.cgst_percentage}
                      onChange={handleChange}
                    />
                    <FormField
                      icon={FaPercentage}
                      label="SGST(%)"
                      name="sgst_percentage"
                      value={formData.sgst_percentage}
                      onChange={handleChange}
                    />
                    <FormField icon={FaPercentage} label="IGST(%)" name="igst_percentage" />
                  </Col>
                </Row>

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
                  <FaPlus className="me-2" /> Add Invoice
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Add_inoice;
