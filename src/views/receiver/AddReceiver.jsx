import React, { useState } from 'react';
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

const AddReceiver = () => {
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        gst_no: '',
        cin_no: '',
        pan_no: '',
        msme_no: '',
        reg_address: '',
        work_address: '',
        area: '',
        tel_no: '',
        email: '',
        owner_mobile: '',
        logo: null,
        status: 'Active',
    });
    const [previewImage, setPreviewImage] = useState(null);
    const navigate = useNavigate();
    const statuses = [{id:'0',name:'Operator'}, {id:'1',name:'Supplier'}]

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Set the file in formData
            setFormData({ ...formData, logo: file });

            // Create a preview of the image
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Create a FormData object for file upload
        const submitData = new FormData();
        submitData.append('name', formData.name);
        submitData.append('code', formData.code);
        submitData.append('gst_no', formData.gst_no);
        submitData.append('cin_no', formData.cin_no);
        submitData.append('pan_no', formData.pan_no);
        submitData.append('msme_no', formData.msme_no);
        submitData.append('reg_address', formData.reg_address);
        submitData.append('work_address', formData.work_address);
        submitData.append('area', formData.area);
        submitData.append('tel_no', formData.tel_no);
        submitData.append('email', formData.email);
        submitData.append('owner_mobile', formData.owner_mobile);
        submitData.append('status', formData.status === 'Active✅' ? 1 : 0);

        // Append logo if it exists
        if (formData.logo) {
            submitData.append('logo', formData.logo);
        }

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/api/receiver`,
                submitData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            navigate('/Receiver');
            toast.success('Receiver added successfully');
        } catch (error) {
            console.error('Error adding Receiver:', error);
            toast.error('Error adding Receiver');
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
                            <h2 className="m-0 text-white">Add New Receiver</h2>
                        </div>
                        <Card.Body className="p-5">
                            <Form onSubmit={handleSubmit}>
                                <Row>
                                    {/* First Column */}
                                    <Col md={6}>
                                        <FormField
                                            icon={FaUser}
                                            label="Receiver Name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                        />

                                        <FormField
                                            icon={FaIdCard}
                                            label="Receiver Code"
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
                                        <Form.Group className="mb-3 position-relative">
                                            <Form.Label className="d-flex align-items-center">
                                                <FaImage className="me-2" style={{ color: mainColor }} />
                                                Receiver Logo
                                            </Form.Label>
                                            <Form.Control
                                                type="file"
                                                name="logo"
                                                onChange={handleFileChange}
                                                accept="image/*"
                                                style={{
                                                    paddingLeft: '40px',
                                                    borderColor: mainColor
                                                }}
                                            />
                                            <FaImage
                                                className="position-absolute"
                                                style={{
                                                    left: '10px',
                                                    top: '38px',
                                                    color: mainColor,
                                                    opacity: 0.5
                                                }}
                                            />
                                            {previewImage && (
                                                <div className="mt-2 text-center">
                                                    <img
                                                        src={previewImage}
                                                        alt="Logo Preview"
                                                        style={{
                                                            maxWidth: '200px',
                                                            maxHeight: '200px',
                                                            borderRadius: '8px'
                                                        }}
                                                    />
                                                </div>
                                            )}
                                        </Form.Group>

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

                                        {/* Status and Logo */}
                                        <FormField
                                            icon={FaCheckCircle}
                                            label="Status"
                                            name="status"
                                            value={formData.status}
                                            onChange={handleChange}
                                            options={statuses}
                                        />

                                        {/* Image Upload Field */}
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
                                    <FaUserPlus className="me-2" /> Add Receiver
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default AddReceiver;