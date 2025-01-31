import React, { useContext, useState, useEffect, useRef } from 'react';
import { Row, Col, Alert, Button, Spinner } from 'react-bootstrap'; 
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { Formik } from 'formik';
import axios from 'axios';
import { AuthContext } from '../../../contexts/authContext';
import './login.scss';

const JWTLogin = () => {
  const [captchaText, setCaptchaText] = useState('');
  const [userCaptchaInput, setUserCaptchaInput] = useState('');
  const [captchaError, setCaptchaError] = useState('');
  const [isLoading, setIsLoading] = useState(false); 
  const canvasRef = useRef(null);

  const generateRandomChar = (min, max) =>
    String.fromCharCode(Math.floor(Math.random() * (max - min + 1) + min));

  const generateCaptchaText = () => {
    let captcha = '';
    for (let i = 0; i < 6; i++) {
      const randomType = Math.floor(Math.random() * 3);
      if (randomType === 0) captcha += generateRandomChar(65, 90); // Uppercase
      else if (randomType === 1) captcha += generateRandomChar(97, 122); // Lowercase
      else captcha += generateRandomChar(48, 57); // Numbers
    }
    return captcha;
  };

  const drawCaptchaOnCanvas = (ctx, captcha) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = '#f7f7f7';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.font = '24px Arial';
    const colors = ['#2c3e50', '#e74c3c', '#8e44ad'];
    for (let i = 0; i < captcha.length; i++) {
      ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
      ctx.fillText(
        captcha[i],
        25 + i * 25,
        Math.random() * 10 + 30
      );
    }

    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.moveTo(Math.random() * ctx.canvas.width, Math.random() * ctx.canvas.height);
      ctx.lineTo(Math.random() * ctx.canvas.width, Math.random() * ctx.canvas.height);
      ctx.strokeStyle = '#ddd';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  };

  const initializeCaptcha = (ctx) => {
    const newCaptcha = generateCaptchaText();
    setCaptchaText(newCaptcha);
    drawCaptchaOnCanvas(ctx, newCaptcha);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    initializeCaptcha(ctx);
  }, []);

  const navigate = useNavigate();
  const { dispatch } = useContext(AuthContext);

  const handleLogin = async (values, { setSubmitting, setErrors }) => {
    try {
      console.log("User Input:", values);
      console.log("Captcha Text:", captchaText);
      console.log("User Captcha Input:", userCaptchaInput);
      
      if (userCaptchaInput !== captchaText) {
        setCaptchaError('Incorrect captcha');
        setSubmitting(false);
        return;
      }

      setCaptchaError('');

      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
      console.log('API Base URL:', API_BASE_URL);

      const requestData = {
        email: values.email,
        password: values.password,
      };
      console.log('Request Data:', requestData);

      // Attempt to login
      const response = await axios.post(
        `${API_BASE_URL}/api/login`,
        requestData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      // Check the API response status and log the response
      console.log('API Response:', response);

      if (response.status === 200) {
        const user = response.data.user;
        const token = response.data.access_token;

        dispatch({
          type: 'LOGIN',
          payload: { user, token },
        });

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        console.log('Login successful:', user);
        navigate('/dashboard');
      } else {
        console.error('Login failed: Unexpected status code', response.status);
        throw new Error('Login failed: Unexpected status code');
      }
    } catch (error) {
      // Improved error handling with more detailed logging
      console.error('Login failed:', error);
      console.log("Error response:", error.response);

      setErrors({
        submit: error.response?.data?.message || 'Something went wrong. Please try again.',
      });

      if (!error.response) {
        // Network or CORS issue
        setErrors({
          submit: 'There was an issue connecting to the server. Please check your network or try again later.',
        });
      } else {
        // Server-side error
        console.error('API Error Response:', error.response.data);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{
        email: 'super@gmail.com',
        password: 'Password#678',
        submit: null,
      }}
      validationSchema={Yup.object().shape({
        email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
        password: Yup.string().max(255).required('Password is required'),
      })}
      onSubmit={handleLogin}
    >
      {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
        <div className={`container ${errors.submit || captchaError ? 'error' : ''}`}>
          <form noValidate onSubmit={handleSubmit}>
            <div className="form-group mb-3">
              <label htmlFor="email" className="text-start w-100 text-black">Email</label>
              <input
                className="form-control"
                name="email"
                id="email"
                onBlur={handleBlur}
                onChange={handleChange}
                type="email"
                value={values.email}
              />
              {touched.email && errors.email && <small className="text-danger form-text" >{errors.email}</small>}
            </div>

            <div className="form-group mb-4">
              <label htmlFor="password" className="text-start w-100 text-black">Password</label>
              <input
                className="form-control"
                name="password"
                id="password"
                onBlur={handleBlur}
                onChange={handleChange}
                type="password"
                value={values.password}
              />
              {touched.password && errors.password && <small className="text-danger form-text" >{errors.password}</small>}
            </div>

            <div className='input-cap' style={{
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
              marginBottom: '20px',
              padding: '15px',
              border: '1px solid #ddd',
              borderRadius: '8px',
            }}>
              <canvas
                ref={canvasRef}
                width="200"
                height="60"
                style={{
                  border: '2px solid #ccc',
                  borderRadius: '5px',
                  width:"130px"
                }}
              />
              <button
                type="button"
                className='spin'
                onClick={() => {
                  setIsLoading(true);
                  setTimeout(() => {
                    initializeCaptcha(canvasRef.current.getContext('2d'));
                    setIsLoading(false);
                  }, 500);
                }}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '5px',
                }}
              >
                {isLoading ? (
                  <Spinner animation="border" size="sm" style={{ color: '#007bff' }} />
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    width="24"
                    height="24"
                    style={{ color: '#007bff' }}
                  >
                    <polyline points="23 4 23 10 17 10"></polyline>
                    <path d="M20.49 15a9 9 0 1 1 2.13-9.36L23 10"></path>
                  </svg>
                )}
              </button>
              <input
                type="text"
                value={userCaptchaInput}
                onChange={(e) => setUserCaptchaInput(e.target.value)}
                placeholder="Enter CAPTCHA"
                style={{
                  padding: '10px',
                  border: '1px solid #ccc',
                  borderRadius: '5px',
                  textAlign: 'center',
                  width: '100%',
                }}
              />
            </div>

            {captchaError && <small className="text-danger" style={{position:"absolute",marginLeft:"-60px"}}>{captchaError}</small>}

            {errors.submit && (
              <Col sm={12}>
                <Alert variant="danger">{errors.submit}</Alert>
              </Col>
            )}

            <Row style={{ width: '100%', textAlign: 'center', marginTop: '50px' }}>
              <Col mt={2}>
                <Button
                  className="btn-block mb-4"
                  disabled={isSubmitting}
                  size="large"
                  type="submit"
                  variant="primary"
                >
                  {isSubmitting ? 'Logging in...' : 'Login'}
                </Button>
              </Col>
            </Row>
          </form>
        </div>
      )}
    </Formik>
  );
};

export default JWTLogin;