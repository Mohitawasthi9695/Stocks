import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Alert, Button } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token'); // Token is passed as a query parameter
  const navigate = useNavigate();
  const [statusMessage, setStatusMessage] = useState('');
  const [statusVariant, setStatusVariant] = useState(''); // success or danger

  const handleResetPassword = async (values, { setSubmitting, setErrors }) => {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

      const response = await axios.post(`${API_BASE_URL}/api/reset-password`, {
        token,
        email: values.email,
        password: values.password,
      });

      setStatusVariant('success');
      setStatusMessage('Password reset successful. Redirecting to login...');
      setTimeout(() => navigate('/login'), 3000); // Redirect to login after 3 seconds
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
      initialValues={{ email: '', password: '', confirmPassword: '' }}
      validationSchema={Yup.object({
        email: Yup.string().email('Must be a valid email').required('Email is required'),
        password: Yup.string().min(6, 'Password must be at least 6 characters').required('New password is required'),
        confirmPassword: Yup.string()
          .oneOf([Yup.ref('password')], 'Passwords must match')
          .required('Re-enter password is required'),
      })}
      onSubmit={handleResetPassword}
    >
      {({ handleSubmit, handleChange, values, isSubmitting, errors }) => (
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label htmlFor="email" className="text-start w-100 text-black">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              className="form-control"
              value={values.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
            {errors.email && <small className="text-danger form-text">{errors.email}</small>}
          </div>

          <div className="form-group mb-3">
            <label htmlFor="password" className="text-start w-100 text-black">
              New Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              className="form-control"
              value={values.password}
              onChange={handleChange}
              placeholder="Enter new password"
            />
            {errors.password && <small className="text-danger form-text">{errors.password}</small>}
          </div>

          <div className="form-group mb-3">
            <label htmlFor="confirmPassword" className="text-start w-100 text-black">
              Re-enter Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              className="form-control"
              value={values.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter new password"
            />
            {errors.confirmPassword && (
              <small className="text-danger form-text">{errors.confirmPassword}</small>
            )}
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
            className="btn-block mb-3"
          >
            {isSubmitting ? 'Resetting...' : 'Submit'}
          </Button>

          <Button variant="secondary" onClick={() => navigate(-1)} style={{marginTop:"-10px"}}>
            <Link to="/login">Back</Link>
            
          </Button>
        </form>
      )}
    </Formik>
  );
};

export default ResetPassword;
