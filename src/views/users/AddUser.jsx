import React, { useState, memo, useMemo } from 'react';
import { Form, Button, Card, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaUserTag,
  FaLock,
  FaCheckCircle,
  FaUserPlus,
} from 'react-icons/fa';
import FormField from '../../components/FormField';
const AddUser = () => {
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    email: '',
    phone: '',
    role: 'operator',
    password: '',
  });

  const navigate = useNavigate();

  const roles = useMemo(() => [{id:'0',name:'Operator'}, {id:'1',name:'Supervisor'}], []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/users`,
        {
          username: formData.username,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          role: formData.role === 'operator' ? 2 : 3,
          password: formData.password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          }
        }
      );
      toast.success('User added successfully');
      navigate('/users');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error adding user';
      toast.error(errorMessage);
    }
  };

  const mainColor = '#3f4d67';

  return (
    <Container
      fluid
      className="pt-4 px-5"
      style={{
        border: '3px dashed #14ab7f',
        borderRadius: '8px',
        background: '#ff9d0014',
      }}
    >
      <Row className="justify-content-center">
        <Col md={10} lg={10}>
          <Card className="shadow-lg border-0" style={{ borderRadius: '15px' }}>
            <div
              className="p-4 text-white text-center"
              style={{
                backgroundColor: '#20B2AA',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FaUserPlus size={40} className="me-3" />
              <h2 className="m-0 text-white">Add New User</h2>
            </div>
            <Card.Body className="p-5">
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <FormField
        
                      icon={FaUser}
                      label="Username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                    />
                    <FormField
                      icon={FaUser}
                      label="Full Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                    <FormField
                      icon={FaEnvelope}
                      label="Email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                    
                  </Col>
                  <Col md={6}>
                    <FormField
                      icon={FaUserTag}
                      label="Role"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      options={roles}
                    />
                    <FormField
                      icon={FaLock}
                      label="Create Password"
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                    />
                    <FormField
                      icon={FaPhone}
                      label="Phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  
                  </Col>
                </Row>
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
                  <FaUserPlus className="me-2" /> Add User
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AddUser;
