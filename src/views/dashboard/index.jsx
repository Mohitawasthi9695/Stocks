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

  const [stockOut, setStockOut] = useState([]);
  const [filterType, setFilterType] = useState("today");
  const [ratingproduct, setRatingproduct] = useState([]);
  const [stockData, setStockData] = useState({
    today: { total_quantity: 0, total_out_quantity: 0 },
    week: { total_quantity: 0, total_out_quantity: 0 },
    month: { total_quantity: 0, total_out_quantity: 0 },
    year: { total_quantity: 0, total_out_quantity: 0 },
  });
  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/stockin`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        });
        console.log(response.data);
        setStockData(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchStockData();
  }, []);
  useEffect(() => {
    const fetchStockOut = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/StockOutDash`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
          params: {
            filter: filterType,
          },
        });
        console.log(response.data.data);
        setStockOut(response.data.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchStockOut();
  }, [filterType]);
  useEffect(() => {
    const fetchRatingData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/rating`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        });
        console.log(response.data);
        setRatingproduct(response.data.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchRatingData();
  }, []);
  const renderTabContent = () => {
    return (
      <>
        {stockOut.length === 0 ? (
          <div className="text-center p-3">No data available</div>
        ) : (
          stockOut.map((customer, index) => (
            <div
              key={index}
              className="d-flex friendlist-box align-items-center justify-content-center m-b-20"
            >
              <div className="m-r-10 photo-table flex-shrink-0">
                <Link to="#">
                  <img
                    className="rounded-circle"
                    style={{ width: "40px" }}
                    src={avatar2} 
                    alt="customer-avatar"
                  />
                </Link>
              </div>
              <div className="flex-grow-1 ms-3">
                <h6 className="m-0 d-inline">{customer.name}</h6>|
                <h6 className="m-0 d-inline">{customer.email}</h6>|
                <h6 className="m-0 d-inline">{customer.code}</h6>
                <span className="float-end d-flex align-items-center">
                  <i className="fa fa-phone f-22 m-r-10 text-c-green" />
                  {customer.tel_no}
                </span>
              </div>
            </div>
          ))
        )}
      </>
    );
  };


  const dashStockData = [
    {
      title: 'Today’s Stock',
      quantity: stockData.today.total_quantity,
      outQuantity: stockData.today.total_out_quantity,
      iconUp: 'icon-arrow-up text-c-green',
      icondown: 'icon-arrow-down text-c-red',
      class: 'progress-c-theme',
    },
    {
      title: 'This Week’s Stock',
      quantity: stockData.week.total_quantity,
      outQuantity: stockData.week.total_out_quantity,
      iconUp: 'icon-arrow-up text-c-green',
      icondown: 'icon-arrow-down text-c-red',
      class: 'progress-c-theme2',
    },
    {
      title: 'This Month’s Stock',
      quantity: stockData.month.total_quantity,
      outQuantity: stockData.month.total_out_quantity,
      iconUp: 'icon-arrow-up text-c-green',
      icondown: 'icon-arrow-down text-c-red',
      class: 'progress-c-theme3',
    },
    {
      title: 'This Year’s Stock',
      quantity: stockData.year.total_quantity,
      outQuantity: stockData.year.total_out_quantity,
      iconUp: 'icon-arrow-up text-c-green',
      icondown: 'icon-arrow-down text-c-red',
      class: 'progress-c-theme4',
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
        {dashStockData.map((data, index) => {
          return (
            <Col key={index} xl={6} xxl={3}>
              <Card style={{
                borderRadius: '15px',
                // background: '#8875e1'
              }}>
                <Card.Body>
                  <h6 className="mb-4">{data.title}</h6>
                  <div className="row d-flex align-items-center">
                    <div className="col-9">
                      <h3 className="f-w-300 d-flex align-items-center m-b-0">
                        <i className={`feather ${data.iconUp} f-30 m-r-5`} /> {data.quantity} Box In
                      </h3>
                      <h3 className="f-w-300 d-flex align-items-center m-b-0">
                        <i className={`feather ${data.icondown} f-30 m-r-5`} /> {data.outQuantity} Box Out
                      </h3>
                    </div>
                    <div className="col-3 text-end">
                      <p className="m-b-0"></p>
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
            <Card.Body className="p-0">
              <div className="table-container">
                <Table responsive hover className="recent-users no-scroll">
                  <thead>
                    <tr>
                      <th>Sr.No</th>
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
                        <td>{1}</td>
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
                  <h3 className="f-w-300">{ }</h3>
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
                  <h3 className="f-w-300">{ }</h3>
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
              <Card.Title as="h5">Top Product Ratings</Card.Title>
            </Card.Header>
            <Card.Body>
              {ratingproduct.length > 0 ? (
                <>
                  <div className="row align-items-center justify-content-center m-b-20">
                    <div className="col-6">
                      <h2 className="f-w-300 d-flex align-items-center float-start m-0">
                        {ratingproduct[0].rating}{" "}
                        <i className="fa fa-star f-10 m-l-10 text-c-yellow" />
                      </h2>
                    </div>
                    <div className="col-6">
                      <h6 className="d-flex align-items-center float-end m-0">
                        {(
                          ratingproduct[0].rating - (ratingproduct[1]?.rating || 0)
                        ).toFixed(1)}{" "}
                        <i className="fa fa-caret-up text-c-green f-22 m-l-10" />
                      </h6>
                    </div>
                  </div>

                  <div className="row">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const starData = ratingproduct.filter(
                        (prod) => Math.round(prod.rating) === star
                      );
                      const total = starData.reduce(
                        (sum, item) => sum + item.stock_out_count,
                        0
                      );
                      const max = ratingproduct.reduce(
                        (m, item) => (item.stock_out_count > m ? item.stock_out_count : m),
                        0
                      );
                      const width = max ? (total / max) * 100 : 0;

                      return (
                        <div className="col-xl-12" key={star}>
                          <h6 className="align-items-center float-start">
                            <i className="fa fa-star f-10 m-r-10 text-c-yellow" />
                            {star}
                          </h6>
                          <h6 className="align-items-center float-end">{total}</h6>
                          <div
                            className="progress m-t-30 m-b-10"
                            style={{ height: "6px" }}
                          >
                            <div
                              className="progress-bar progress-c-theme"
                              role="progressbar"
                              style={{ width: `${width}%` }}
                              aria-valuenow={width}
                              aria-valuemin="0"
                              aria-valuemax="100"
                            />
                          </div>

                          {/* Product Shade No List */}
                          {starData.map((item, index) => (
                            <div key={index} className="d-flex justify-content-between mb-1">
                              <span className="text-muted small">
                                Shade No: <strong>{item.product_shade_no}</strong>
                              </span>
                              <span className="text-muted small">
                                ({item.stock_out_count} times)
                              </span>
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>

                </>
              ) : (
                <p>Loading...</p>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} xl={8} className="user-activity">
          <Card>
            <Tabs
              activeKey={filterType}
              onSelect={(k) => setFilterType(k)}
              id="stockout-tab"
            >
              <Tab eventKey="today" title="Today">
                {renderTabContent()}
              </Tab>
              <Tab eventKey="week" title="This Week">
                {renderTabContent()}
              </Tab>
              <Tab eventKey="all" title="All">
                {renderTabContent()}
              </Tab>
            </Tabs>
          </Card>
        </Col>

      </Row>
    </React.Fragment >
  );
};

export default DashDefault;
