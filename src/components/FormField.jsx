import React, { useState, memo } from 'react';
import { Form, Button, Card, Container, Row, Col } from 'react-bootstrap';
import { FaPlus } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
const FormField = memo(({ icon: Icon, label, type = 'text', name, value, onChange, options = null, required = true, add}) => {
  const navigate = useNavigate();
    return (
      <Form.Group className="mb-3 position-relative">
        <Form.Label className="d-flex align-items-center">
          <Icon className="me-2" style={{ color: '#3f4d67' }} />
          {label} {add && <FaPlus onClick={() => navigate(add)} className='bg-success text-white ms-2 p-1' style={{width:'20px', height:'20px', borderRadius:'10px', cursor:'pointer'}}/>}
        </Form.Label>
        {options ? (
          <Form.Select
            name={name}
            // value={value}
            onChange={onChange}
            required={required}
            defaultValue={'default'}
            style={{
              paddingLeft: '40px',
              borderColor: '#3f4d67',
              paddingTop: '.7rem',
              paddingBottom: '.7rem',
            }}
          >
            <option value="default" disabled>Select {label}</option>
            {options.map((option, index) => (
              <option key={index} value={option.id}>
                {option.name}
              </option>
            ))}
          </Form.Select>
        ) : (
          <Form.Control
            type={type}
            placeholder={`Enter ${label.toLowerCase()}`}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            style={{
              paddingLeft: '40px',
              borderColor: '#3f4d67',
            }}
          />
        )}
        <Icon
          className="position-absolute"
          style={{
            left: '10px',
            top: '38px',
            color: '#3f4d67',
            opacity: 0.5,
          }}
        />
      </Form.Group>
    );
  });

  export default FormField;