import React from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { BiErrorCircle } from 'react-icons/bi';
import { FaHome, FaHeadset } from 'react-icons/fa';

const Unauthorized = () => {
  return (
    <div 
      className="d-flex align-items-center justify-content-center"
      
    >
      <Container>
        <Row className="justify-content-center">
          <Col xs={11} sm={8} md={6} lg={5} xl={4}>
            <Card className="border-0 shadow-lg">
              <Card.Body className="p-4">
                <div className="text-center mb-4">
                  <BiErrorCircle className="text-warning" size={50} />
                </div>
                
                <Card.Title className="text-center mb-4">
                  <h2 className="fw-bold">Access Denied</h2>
                </Card.Title>

                <Alert variant="warning" className="mb-4">
                  <p className="text-center mb-0">
                    Oops! Looks like you don't have permission to access this page.
                    Please check your credentials or contact support if you think this is a mistake.
                  </p>
                </Alert>

                <div className="d-grid gap-3">
                  <Button 
                    variant="primary" 
                    size="lg"
                    href="/dashboard"
                    className="d-flex align-items-center justify-content-center gap-2"
                  >
                    <FaHome />
                    Return to Dashboard
                  </Button>
                  
                  <Button 
                    variant="outline-secondary" 
                    size="lg"
                    href="/support"
                    className="d-flex align-items-center justify-content-center gap-2"
                  >
                    <FaHeadset />
                    Contact Support
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Unauthorized;