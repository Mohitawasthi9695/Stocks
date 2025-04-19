import React from 'react';
import { Card, Button, Alert } from 'react-bootstrap';
import { NavLink, Link } from 'react-router-dom';

import Breadcrumb from '../../../layouts/AdminLayout/Breadcrumb';

import { CopyToClipboard } from 'react-copy-to-clipboard';
import Bg from '../../../assets/images/authImage.webp';
import AuthLogin from './JWTForgotPassword';

const Signin1 = () => {
  return (
    <React.Fragment>
      <Breadcrumb />
      <div className="auth-wrapper">
        <div className="auth-bg">
          <span className="r" />
          <span className="r s" />
          <span className="r s" />
          <span className="r" />

          <span className="r s" />
          <span className="r" />
        </div>
        <div className="auth-image">
        <div style={{
          width: '80%'
        }}>
        <div
            style={{
              textAlign: 'center',
              padding: '20px'
            }}
          >
            <img
              src="https://5.imimg.com/data5/SELLER/Logo/2024/2/392287203/EW/MK/QX/108300258/ht-90x90.jpg"
              alt="vishal Sales"
              style={{
                width: '80px',
                borderRadius: '10%'
              }}
            />
          </div>
          <div className="d-flex-flex-column">
            {' '}
            <h1 className="text-none auth-heading">High Tech Blinds</h1>
            <img src={Bg} alt="" />
          </div>
        </div>
          <div className="auth-content">
            <Card className="borderless text-center">
              <Card.Body>
                <div className="mb-4">
                  <h3 className="d-inline me-2">Forgot password</h3>
                  <i className="feather icon-unlock auth-icon" />
                </div>
                <AuthLogin />
                <button>
                  <Link to="/login" variant="secondary">
                    Back
                  </Link>
                </button>
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Signin1;
