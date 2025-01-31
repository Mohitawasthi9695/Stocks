import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Table, Tabs, Tab } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/authContext';
import avatar1 from '../../assets/images/user/avatar-1.jpg';
import avatar2 from '../../assets/images/user/avatar-2.jpg';
import avatar3 from '../../assets/images/user/avatar-3.jpg';
import PieChartData from 'components/PieChart';
import BarChartData from 'components/BarChart';


const DashDefault = () => {
  const [salesData, setSalesData] = useState({
    sum_today: 0,
    sum_month: 0,
    sum_quarter: 0,
    sum_year: 0,
    out_quantity: 0,
  });
  const [stockOut, setStockOut] = useState({});

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/sales`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        });
        setSalesData(response.data.data.totals);
      } catch (error) {
        console.error(error);
      }
    };
    fetchSalesData();
  }, []);
  useEffect(() => {
    const fetchStockOut = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/StockOutDash`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        });
        console.log(response.data.data);
        setStockOut(response.data.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchStockOut();
  }, []);
  const tabContent = (
    <React.Fragment>
      <div className="d-flex friendlist-box align-items-center justify-content-center m-b-20">
        <div className="m-r-10 photo-table flex-shrink-0">
          <Link to="#">
            <img className="rounded-circle" style={{ width: '40px' }} src={avatar1} alt="activity-user" />
          </Link>
        </div>
        <div className="flex-grow-1 ms-3">
          <h6 className="m-0 d-inline">Silje Larsen</h6>
          <span className="float-end d-flex  align-items-center">
            <i className="fa fa-caret-up f-22 m-r-10 text-c-green" />
            3784
          </span>
        </div>
      </div>
    </React.Fragment>
  );

  const dashSalesData = [
    {
      title: 'Daily Sales',
      amount: `₹${salesData.sum_today.toFixed(2)}`,
      icon: 'icon-arrow-up text-c-green',
      value: 50,
      class: 'progress-c-theme',
    },
    {
      title: 'Monthly Sales',
      amount: `₹${salesData.sum_month.toFixed(2)}`,
      icon: 'icon-arrow-down text-c-red',
      value: 36,
      class: 'progress-c-theme2',
    },
    {
      title: 'Quarterly Sales',
      amount: `₹${salesData.sum_quarter.toFixed(2)}`,
      icon: 'icon-arrow-up text-c-green',
      value: 60,
      class: 'progress-c-theme3',
    },
    {
      title: 'Yearly Sales',
      amount: `₹${salesData.sum_year.toFixed(2)}`,
      icon: 'icon-arrow-up text-c-green',
      value: 70,
      class: 'progress-c-theme',
    },
  ];

  const navigate = useNavigate();
  const [recentSupplier, setSupplier] = useState([]);
  const [filteredSupplier, setFilteredSupplier] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchSupplier = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/recent-suppliers`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        setSupplier(response.data.data);
        setFilteredSupplier(response.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false); // Ensure loading state is updated here
      }
    };
    fetchSupplier();
  }, []);
  
  return (
    <React.Fragment>
      <Row>
        {dashSalesData.map((data, index) => {
          return (
            <Col key={index} xl={6} xxl={4}>
              <Card>
                <Card.Body>
                  <h6 className="mb-4">{data.title}</h6>
                  <div className="row d-flex align-items-center">
                    <div className="col-9">
                      <h3 className="f-w-300 d-flex align-items-center m-b-0">
                        <i className={`feather ${data.icon} f-30 m-r-5`} /> {data.amount}
                      </h3>
                    </div>
                    <div className="col-3 text-end">
                      <p className="m-b-0">{data.value}%</p>
                    </div>
                  </div>
                  <div className="progress m-t-30" style={{ height: '7px' }}>
                    <div
                      className={`progress-bar ${data.class}`}
                      role="progressbar"
                      style={{ width: `${data.value}%` }}
                      aria-valuenow={data.value}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    />
                  </div>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
        <Col md={6} xl={8}>
          <Card className="Recent-Users widget-focus-lg">
            <Card.Header>
              <Card.Title as="h5">Recent Supplier</Card.Title>
            </Card.Header>
            <Card.Body className="px-0 py-2">
              <div className="table-container">
                <Table responsive hover className="recent-users no-scroll">
                  <thead>
                    <tr>
                      {/* <th>Avatar</th> */}
                      <th>Supplier Name</th>
                      {/* <th>GST Number</th> */}
                      <th>Owner Mobile</th>
                      <th>Invoice No</th>
                      <th>Total Amount</th>
                      <th>Date</th>
                      {/* <th>Actions</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {recentSupplier.map((supplier) => (
                      <tr key={supplier.id}>
                        {/* <td>
                          <img className="rounded-circle" style={{ width: '40px' }} src={avatar1} alt="activity-user" />
                        </td> */}
                        <td>
                          <h6 className="mb-1" style={{ maxWidth: '200px', wordWrap: 'break-word', whiteSpace: 'normal' }}>
                            {supplier.name}
                          </h6>
                        </td>
                        {/* <td>{supplier.gst_no}</td> */}
                        <td>{supplier.owner_mobile}</td>
                        <td>
                          {supplier.recent_invoice.length > 0 ? supplier.recent_invoice[0].invoice_no : 'No Invoice'}
                        </td>
                        <td>
                          {supplier.recent_invoice.length > 0 ? supplier.recent_invoice[0].total_amount : 'N/A'}
                        </td>
                        <td>
                          {supplier.recent_invoice.length > 0 ? supplier.recent_invoice[0].date : 'N/A'}
                        </td>
                        {/* <td>
                          <Link to="#" className="label theme-bg2 text-white f-12 mr-2">
                            Reject
                          </Link>
                          <Link to="#" className="label theme-bg text-white f-12">
                            Approve
                          </Link>
                        </td> */}
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} xl={4}>
          <Card className="card-event">
            <Card.Body className="border-bottom">
              <div className="row d-flex align-items-center">
                <div className="col-auto">
                  <i className="feather icon-zap f-30 text-c-green" />
                </div>
                <div className="col">
                  <h3 className="f-w-300">{salesData.out_quantity}</h3>
                  <span className="d-block text-uppercase">Total Out Roles</span>
                </div>
              </div>
            </Card.Body>
            <Card.Body>
              <div className="row d-flex align-items-center">
                <div className="col-auto">
                  <i className="feather icon-activity f-30 text-c-blue" />
                </div>
                <div className="col">
                  <h3 className="f-w-300">{salesData.today_out_quantity}</h3>
                  <span className="d-block text-uppercase">Today Out Roles</span>
                </div>
              </div>

            </Card.Body>
          </Card>

        </Col>
        <Col md={6} xl={6}>
          <Card className="d-flex flex-column align-items-center">
            <PieChartData />
          </Card>
        </Col>
        <Col md={6} xl={6}>
          <Card className="d-flex flex-column align-items-center">
            <BarChartData />
          </Card>
        </Col>

        <Col md={6} xl={4}>
          <Card>
            <Card.Header>
              <Card.Title as="h5">Rating</Card.Title>
            </Card.Header>
            <Card.Body>
              <div className="row align-items-center justify-content-center m-b-20">
                <div className="col-6">
                  <h2 className="f-w-300 d-flex align-items-center float-start m-0">
                    4.7 <i className="fa fa-star f-10 m-l-10 text-c-yellow" />
                  </h2>
                </div>
                <div className="col-6">
                  <h6 className="d-flex  align-items-center float-end m-0">
                    0.4 <i className="fa fa-caret-up text-c-green f-22 m-l-10" />
                  </h6>
                </div>
              </div>

              <div className="row">
                <div className="col-xl-12">
                  <h6 className="align-items-center float-start">
                    <i className="fa fa-star f-10 m-r-10 text-c-yellow" />5
                  </h6>
                  <h6 className="align-items-center float-end">384</h6>
                  <div className="progress m-t-30 m-b-20" style={{ height: '6px' }}>
                    <div
                      className="progress-bar progress-c-theme"
                      role="progressbar"
                      style={{ width: '70%' }}
                      aria-valuenow="70"
                      aria-valuemin="0"
                      aria-valuemax="100"
                    />
                  </div>
                </div>

                <div className="col-xl-12">
                  <h6 className="align-items-center float-start">
                    <i className="fa fa-star f-10 m-r-10 text-c-yellow" />4
                  </h6>
                  <h6 className="align-items-center float-end">145</h6>
                  <div className="progress m-t-30  m-b-20" style={{ height: '6px' }}>
                    <div
                      className="progress-bar progress-c-theme"
                      role="progressbar"
                      style={{ width: '35%' }}
                      aria-valuenow="35"
                      aria-valuemin="0"
                      aria-valuemax="100"
                    />
                  </div>
                </div>

                <div className="col-xl-12">
                  <h6 className="align-items-center float-start">
                    <i className="fa fa-star f-10 m-r-10 text-c-yellow" />3
                  </h6>
                  <h6 className="align-items-center float-end">24</h6>
                  <div className="progress m-t-30  m-b-20" style={{ height: '6px' }}>
                    <div
                      className="progress-bar progress-c-theme"
                      role="progressbar"
                      style={{ width: '25%' }}
                      aria-valuenow="25"
                      aria-valuemin="0"
                      aria-valuemax="100"
                    />
                  </div>
                </div>

                <div className="col-xl-12">
                  <h6 className="align-items-center float-start">
                    <i className="fa fa-star f-10 m-r-10 text-c-yellow" />2
                  </h6>
                  <h6 className="align-items-center float-end">1</h6>
                  <div className="progress m-t-30  m-b-20" style={{ height: '6px' }}>
                    <div
                      className="progress-bar progress-c-theme"
                      role="progressbar"
                      style={{ width: '10%' }}
                      aria-valuenow="10"
                      aria-valuemin="0"
                      aria-valuemax="100"
                    />
                  </div>
                </div>
                <div className="col-xl-12">
                  <h6 className="align-items-center float-start">
                    <i className="fa fa-star f-10 m-r-10 text-c-yellow" />1
                  </h6>
                  <h6 className="align-items-center float-end">0</h6>
                  <div className="progress m-t-30  m-b-5" style={{ height: '6px' }}>
                    <div
                      className="progress-bar"
                      role="progressbar"
                      style={{ width: '0%' }}
                      aria-valuenow="0"
                      aria-valuemin="0"
                      aria-valuemax="100"
                    />
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} xl={8} className="user-activity">
          <Card>
            <Tabs defaultActiveKey="today" id="uncontrolled-tab-example">
              <Tab eventKey="today" title="Today">
                {tabContent}
              </Tab>
              <Tab eventKey="week" title="This Week">
                {tabContent}
              </Tab>
              <Tab eventKey="all" title="All">
                {tabContent}
              </Tab>
            </Tabs>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default DashDefault;

