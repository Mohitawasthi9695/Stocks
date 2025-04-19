import React, { useState } from 'react';
import { Alert, Button } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const ForgotPassword = () => {
  const [statusMessage, setStatusMessage] = useState('');
  const [statusVariant, setStatusVariant] = useState('');
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handleForgotPassword = async (values, { setSubmitting, setErrors }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/forgot-password`, {
        email: values.email,
      });
      setEmail(values.email);
      setStep(2);
      setStatusVariant('success');
      setStatusMessage(response.data.message || 'Verification code sent to your email.');
    } catch (error) {
      setStatusVariant('danger');
      setStatusMessage(error.response?.data?.message || 'An error occurred. Please try again.');
      setErrors({ submit: error.response?.data?.message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetPassword = async (values, { setSubmitting, setErrors }) => {
    try {
      await axios.put(`${API_BASE_URL}/api/forgot-password`, {
        email,
        reset_code: values.code,
        newPassword: values.newPassword,
      });
      setStep(3);
      setStatusVariant('success');
      setStatusMessage('Password reset successfully. You can now log in.');
    } catch (error) {
      setStatusVariant('danger');
      setStatusMessage(error.response?.data?.message || 'Failed to reset password. Please try again.');
      setErrors({ submit: error.response?.data?.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {step === 1 && (
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
                <label htmlFor="email">Enter your registered email</label>
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
              {statusMessage && <Alert variant={statusVariant}>{statusMessage}</Alert>}
              <Button type="submit" variant="primary" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Send Verification Code'}
              </Button>
            </form>
          )}
        </Formik>
      )}

      {step === 2 && (
        <Formik
          initialValues={{ code: '', newPassword: '' }}
          validationSchema={Yup.object({
            code: Yup.string().required('Verification code is required'),
            newPassword: Yup.string().min(6, 'Must be at least 6 characters').required('New password is required'),
          })}
          onSubmit={handleResetPassword}
        >
          {({ handleSubmit, handleChange, values, isSubmitting, errors }) => (
            <form onSubmit={handleSubmit}>
              <div className="form-group mb-3">
                <label htmlFor="code">Enter the verification code</label>
                <input
                  type="text"
                  name="code"
                  id="code"
                  className="form-control"
                  value={values.code}
                  onChange={handleChange}
                  placeholder="Verification Code"
                />
                {errors.code && <small className="text-danger form-text">{errors.code}</small>}
              </div>

              <div className="form-group mb-3">
                <label htmlFor="newPassword">Enter your new password</label>
                <input
                  type="password"
                  name="newPassword"
                  id="newPassword"
                  className="form-control"
                  value={values.newPassword}
                  onChange={handleChange}
                  placeholder="New Password"
                />
                {errors.newPassword && <small className="text-danger form-text">{errors.newPassword}</small>}
              </div>

              {statusMessage && <Alert variant={statusVariant}>{statusMessage}</Alert>}

              <Button type="submit" variant="primary" disabled={isSubmitting}>
                {isSubmitting ? 'Resetting...' : 'Reset Password'}
              </Button>
            </form>
          )}
        </Formik>
      )}

      {step === 3 && <Alert variant="success">Password reset successfully. You can now log in.</Alert>}
    </div>
  );
};

export default ForgotPassword;
