import React, { useState, useMemo } from 'react';
import { Form, Button, Card, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import FormField from '../../components/FormField';

import {
    FaUser,
    FaIdCard,
    FaEnvelope,
    FaPhone,
    FaMapMarkerAlt,
    FaCheckCircle,
    FaUserPlus,
    FaImage
} from 'react-icons/fa';

const AddSupplier = () => {
    const [formData, setFormData] = useState({
        name: '',
        gst_no: '',
        cin_no: '',
        pan_no: '',
        msme_no: '',
        reg_address: '',
        area: '',
        tel_no: '',
        email: '',
        owner_mobile: '',
        logo: null,
    });
    const navigate = useNavigate();
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        // Create a FormData object for file upload
        const submitData = new FormData();
        submitData.append('name', formData.name);
        submitData.append('gst_no', formData.gst_no);
        submitData.append('code', formData.code);
        submitData.append('cin_no', formData.cin_no);
        submitData.append('pan_no', formData.pan_no);
        submitData.append('msme_no', formData.msme_no);
        submitData.append('reg_address', formData.reg_address);
        submitData.append('work_address', formData.work_address);
        submitData.append('area', formData.area);
        submitData.append('tel_no', formData.tel_no);
        submitData.append('email', formData.email);
        submitData.append('owner_mobile', formData.owner_mobile);
        submitData.append('people_type', 'Supplier');
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/api/peoples`,
                submitData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            console.log(response.data);
            navigate('/supplier');
            toast.success('Supplier added successfully');
        } catch (errors) {
            console.error('Error adding supplier:', errors);
            let errorMessage = 'Error adding supplier';
            if (errors.response && errors.response.data) {
                errorMessage = errors.response.data.message || JSON.stringify(errors.response.data);
            } else if (errors.message) {
                errorMessage = errors.message;
            }
            toast.error(errorMessage);
        }
        
    };

    const mainColor = '#3f4d67';

    return (
        <Container fluid className="pt-4 px-5" style={{ border: '3px dashed #14ab7f', borderRadius: '8px', background: '#ff9d0014' }}>
            <Row className="justify-content-center">
                <Col md={12} lg={12}>
                    <Card
                        className="shadow-lg border-0"
                        style={{
                            borderRadius: '15px',
                            overflow: 'hidden'
                        }}
                    >
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
                            <h2 className="m-0 text-white">Add New Supplier</h2>
                        </div>
                        <Card.Body className="p-5">
                            <Form onSubmit={handleSubmit}>
                                <Row>
                                    {/* First Column */}
                                    <Col md={6}>
                                        <FormField
                                            icon={FaUser}
                                            label="Supplier Name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                        />
                                        <FormField
                                            icon={FaIdCard}
                                            label="Supplier Code"
                                            name="code"
                                            value={formData.code}
                                            onChange={handleChange}
                                        />

                                        <FormField
                                            icon={FaIdCard}
                                            label="GST Number"
                                            name="gst_no"
                                            value={formData.gst_no}
                                            onChange={handleChange}
                                        />

                                        <FormField
                                            icon={FaIdCard}
                                            label="CIN Number"
                                            name="cin_no"
                                            value={formData.cin_no}
                                            onChange={handleChange}
                                        />

                                        <FormField
                                            icon={FaIdCard}
                                            label="PAN Number"
                                            name="pan_no"
                                            value={formData.pan_no}
                                            onChange={handleChange}
                                        />
                                        <FormField
                                            icon={FaPhone}
                                            label="Telephone Number"
                                            name="tel_no"
                                            value={formData.tel_no}
                                            onChange={handleChange}
                                        />
                                    </Col>

                                    {/* Second Column */}
                                    <Col md={6}>
                                        <FormField
                                            icon={FaIdCard}
                                            label="MSME Number"
                                            name="msme_no"
                                            value={formData.msme_no}
                                            onChange={handleChange}
                                        />
                                        <FormField
                                            icon={FaMapMarkerAlt}
                                            label="Registered Address"
                                            name="reg_address"
                                            value={formData.reg_address}
                                            onChange={handleChange}
                                        />
                                        <FormField
                                            icon={FaMapMarkerAlt}
                                            label="Work Address"
                                            name="work_address"
                                            value={formData.work_address}
                                            onChange={handleChange}
                                        />

                                        <FormField
                                            icon={FaMapMarkerAlt}
                                            label="Area"
                                            name="area"
                                            value={formData.area}
                                            onChange={handleChange}
                                        />

                                        {/* Contact Details */}

                                        <FormField
                                            icon={FaEnvelope}
                                            label="Email"
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                        />

                                        <FormField
                                            icon={FaPhone}
                                            label="Owner Mobile"
                                            name="owner_mobile"
                                            value={formData.owner_mobile}
                                            onChange={handleChange}
                                        />


                                    </Col>
                                </Row>

                                {/* Submit Button */}
                                <Button
                                    variant="primary"
                                    type="submit"
                                    className="mt-4 d-block m-auto"
                                    style={{
                                        backgroundColor: mainColor,
                                        borderColor: mainColor,
                                        width: '10rem',
                                    }}

                                >
                                    <FaUserPlus className="me-2" /> Add Supplier
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default AddSupplier;