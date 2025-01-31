import React, { useState } from 'react';
import { Alert, Button } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const ForgotPassword = () => {
  const [statusMessage, setStatusMessage] = useState('');
  const [statusVariant, setStatusVariant] = useState(''); // success or danger

  const handleForgotPassword = async (values, { setSubmitting, setErrors }) => {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

      const response = await axios.post(`${API_BASE_URL}/api/forgot-password`, {
        email: values.email,
      });
      console.log(response.data);
      setStatusVariant('success');
      setStatusMessage(response.data.message || 'Password reset email sent successfully.');
    } catch (error) {
      setStatusVariant('danger');
      setStatusMessage(
        error.response?.data?.message || 'An error occurred. Please try again.'
      );
      setErrors({ submit: error.response?.data?.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{ email: '' }}
      validationSchema={Yup.object({
        email: Yup.string().email('Must be a valid email').required('Email is required'),
      })}
      onSubmit={handleForgotPassword}
    >
      {({ handleSubmit, handleChange, values, isSubmitting, errors }) => (
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label htmlFor="email" className="text-start w-100 text-black">
              Enter your registered email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              className="form-control"
              value={values.email}
              onChange={handleChange}
              placeholder="Email Address"
            />
            {errors.email && <small className="text-danger form-text">{errors.email}</small>}
          </div>

          {statusMessage && (
            <Alert variant={statusVariant} className="mb-3">
              {statusMessage}
            </Alert>
          )}

          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
            className="btn-block"
          >
            {isSubmitting ? 'Sending...' : 'Send Reset Link'}
          </Button>
        </form>
      )}
    </Formik>
  );
};

export default ForgotPassword;
