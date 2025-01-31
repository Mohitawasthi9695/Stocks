import React from 'react';
import { Card, Button, Alert } from 'react-bootstrap';
import { NavLink, Link } from 'react-router-dom';
import Breadcrumb from '../../../layouts/AdminLayout/Breadcrumb';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Bg from '../../../assets/images/authImage.webp';
import AuthLogin from './JWTLogin';  // Import JWTLogin as AuthLogin
import './login.scss';

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
          <div className='d-flex-flex-column'>
            <h1 className='text-decoration-underline auth-heading' style={{width:"100%",textAlign:"center"}}>The Stocks</h1>
            <img src={Bg} alt="" className='img-login' />
          </div>
          <div className="auth-content">
            <Card className="borderless text-center">
              <Card.Body>
                <div className="mb-4">
                  <h3 className="d-inline me-2">Login</h3>
                  <i className="feather icon-unlock auth-icon" />
                </div>
                {/* Pass the login component */}
                <AuthLogin />
                <p className="mb-2 text-muted">
                  Forgot password?{' '}
                  <NavLink to='/signin/forgotPassword' className="f-w-400">
                    Reset
                  </NavLink>
                </p>
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Signin1;