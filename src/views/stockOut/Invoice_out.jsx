// import React, { useState, useEffect } from 'react';
// import { Table, Form, Button, Card, Container, Row, Col } from 'react-bootstrap';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import { useNavigate } from 'react-router-dom';
// import { FaUser, FaUserPlus, FaTrash, FaPlus } from 'react-icons/fa';
// import Skeleton from 'react-loading-skeleton';
// import DataTable from 'react-data-table-component';
// import { MdEdit, MdDelete, MdPersonAdd } from 'react-icons/md';

// import 'react-loading-skeleton/dist/skeleton.css';
// import {
//   FaFileInvoice,
//   FaCalendarAlt,
//   FaMapMarkerAlt,
//   FaUsers,
//   FaKey,
//   FaMoneyBillWave,
//   FaPercentage,
//   FaTruck,
//   FaCity,
//   FaSignature,
//   FaQrcode
// } from 'react-icons/fa';
// import FormField from '../../components/FormField';

// const Invoice_out = () => {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [items, setItems] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [receivers, setReceivers] = useState([]);
//   const [customers, setCustomers] = useState([]);
//   const [banks, setBanks] = useState([]);
//   const [shadeNo, setShadeNo] = useState([]);
//   const [invoice_no, SetInvoiceNo] = useState('');
//   const [selectedRows, setSelectedRows] = useState([]);
//   const [formData, setFormData] = useState({
//     invoice_no: '',
//     date: '',
//     customer_id: '',
//     receiver_id: '',
//     place_of_supply: '',
//     vehicle_no: '',
//     station: '',
//     ewaybill: '',
//     reverse_charge: false,
//     gr_rr: '',
//     transport: '',
//     irn: '',
//     ack_no: '',
//     ack_date: '',
//     total_amount: '',
//     cgst_percentage: '',
//     sgst_percentage: '',
//     payment_mode: '',
//     payment_status: '',
//     payment_date: '',
//     payment_bank: '',
//     payment_account_no: '',
//     payment_ref_no: '',
//     payment_amount: '',
//     payment_tailoring: '',
//     qr_code: '',
//     out_products: []
//   });

//   useEffect(() => {
//     const fetchShadeNo = async () => {
//       try {
//         const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/available`, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`,
//             'Content-Type': 'application/json'
//           }
//         });
//         setShadeNo(response.data.data);
//       } catch (error) {
//         console.error('Error fetching product data:', error);
//       }
//     };
//     fetchShadeNo();
//   }, []);

//   useEffect(() => {
//     const fetchInvoiceNo = async () => {
//       try {
//         const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/stockout/invoiceno`, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`,
//             'Content-Type': 'application/json'
//           }
//         });
//         SetInvoiceNo(response.data.data);
//         setFormData((prevData) => ({
//           ...prevData,
//           invoice_no: response.data.data
//         }));
//       } catch (error) {
//         console.error('Error fetching Invoice No data:', error);
//       }
//     };
//     fetchInvoiceNo();
//   }, []);

//   const handleShadeNoChange = async (event) => {
//     setLoading(true);
//     const selectedProductId = event.target.value;

//     if (selectedProductId) {
//       try {
//         const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/godowncheckout/${selectedProductId}`, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`,
//             'Content-Type': 'application/json'
//           }
//         });
//         setLoading(false);

//         console.log(response.data.data);
//         setProducts(response.data.data);
//       } catch (error) {
//         console.error('Error fetching product data:', error);
//       }
//     } else {
//       setProducts(null);
//     }
//   };

//   useEffect(() => {
//     const fetchCustomerData = async () => {
//       try {
//         const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/customers`, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`,
//             'Content-Type': 'application/json'
//           }
//         });
//         setCustomers(response.data.data);
//       } catch (err) {
//         console.log(err);
//       }
//     };
//     fetchCustomerData();
//   }, []);

//   useEffect(() => {
//     const fetchReceiverData = async () => {
//       try {
//         const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/receiver`, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`,
//             'Content-Type': 'application/json'
//           }
//         });
//         setReceivers(response.data.data);
//       } catch (err) {
//         console.log(err);
//       }
//     };
//     fetchReceiverData();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     console.log(name, value);

//     setFormData((prevData) => ({ ...prevData, [name]: value }));
//   };

//   const handleInputChange = (id, field, value) => {
//     setSelectedRows((prevSelectedRows) => {
//       const updatedRows = prevSelectedRows.map((row) => {
//         if (row.stock_available_id === id) {
//           const updatedRow = { ...row, [field]: value };

//           if (field === 'out_length' || field === 'out_width' || field === 'unit') {
//             const lengthInFeet =
//               updatedRow.unit === 'meter'
//                 ? Number(updatedRow.out_length) * 3.28084
//                 : updatedRow.unit === 'inches'
//                   ? Number(updatedRow.out_length) / 12 // Convert inches to feet
//                   : Number(updatedRow.out_length); // Default to feet

//             const widthInFeet =
//               updatedRow.unit === 'meter'
//                 ? Number(updatedRow.out_width) * 3.28084 // Convert meters to feet
//                 : updatedRow.unit === 'inches'
//                   ? Number(updatedRow.out_width) / 12 // Convert inches to feet
//                   : Number(updatedRow.out_width); // Default to feet

//             updatedRow.area = (lengthInFeet * widthInFeet).toFixed(2); // Calculate area
//           }

//           if (field === 'rate' || field === 'out_length' || field === 'out_width' || field === 'unit') {
//             updatedRow.amount = (Number(updatedRow.area || 0) * Number(updatedRow.rate || 0)).toFixed(2);
//           }

//           return updatedRow;
//         }
//         return row;
//       });

//       setFormData((prevFormData) => ({
//         ...prevFormData,
//         out_products: updatedRows
//       }));

//       return updatedRows;
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/godownstockout`, formData, {
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${localStorage.getItem('token')}`
//         }
//       });
//       toast.success('Stocks out successfully');
//       navigate('/all-invoices-out');
//     } catch (error) {
//       const errorMessage = error.response?.data?.message || 'Error adding user';
//       toast.error(errorMessage);
//     }
//     console.log(formData);
//   };

//   const columns = [
//     { id: 'product_shadeNo', label: 'Shade No' },
//     { id: 'product_purchase_shade_no', label: 'Pur. Shade No' },
//     { id: 'lot_no', label: 'LOT No' },
//     { id: 'stock_code', label: 'Stock Code' },
//     { id: 'out_width', label: 'Width' },
//     { id: 'out_length', label: 'Length' },
//     { id: 'unit', label: ' Unit' },
//     { id: 'area_sq_ft', label: 'Area(sqft)' },
//     { id: 'product_type', label: 'Type' }
//   ];

//   const handleCheckboxChange = (id) => {
//     setSelectedRows((prevSelected) => {
//       const isAlreadySelected = prevSelected.some((row) => row.stock_available_id === id);

//       const updatedSelectedRows = isAlreadySelected
//         ? prevSelected.filter((row) => row.stock_available_id !== id)
//         : [...prevSelected, products.find((p) => p.stock_available_id === id)];

//       console.log(updatedSelectedRows);
//       setFormData((prevFormData) => ({
//         ...prevFormData,
//         out_products: updatedSelectedRows
//       }));

//       return updatedSelectedRows;
//     });
//   };
//   console.log('data', formData.invoice_no);
//   const mainColor = '#3f4d67';
//   return (
//     <Container
//       fluid
//       className="pt-1 px-2"
//       style={{
//         border: '3px dashed #14ab7f',
//         borderRadius: '8px',
//         background: '#ff9d0014'
//       }}
//     >
//       <Row className="justify-content-center">
//         <Col md={12} lg={12}>
//           <Card className="shadow-lg border-0" style={{ borderRadius: '15px' }}>
//             <div
//               className="p-4 text-white text-center"
//               style={{
//                 backgroundColor: '#20B2AA',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center'
//               }}
//             >
//               <FaUserPlus size={40} className="me-3" />
//               <h2 className="m-0 text-white">Add Invoice</h2>
//             </div>
//             <Card.Body className="p-5">
//               <Form onSubmit={handleSubmit}>
//                 <Row>
//                   <Col md={4}>
//                     <FormField icon={FaFileInvoice} label="Invoice_no" name="invoice_no" value={invoice_no} readOnly />
//                     <FormField
//                       icon={FaUsers}
//                       label="Seller"
//                       name="receiver_id"
//                       value={formData.receiver_id}
//                       onChange={handleChange}
//                       options={receivers}
//                       add={'/add-Receiver'}
//                       required
//                     />
//                     <FormField
//                       icon={FaUser}
//                       label="Customer"
//                       name="customer_id"
//                       value={formData.customer_id}
//                       onChange={handleChange}
//                       options={customers}
//                       add={'/add-Customer'}
//                       required
//                     />
//                     <FormField icon={FaCalendarAlt} label="Date" type="date" name="date" value={formData.date} onChange={handleChange} required/>
//                     <FormField
//                       icon={FaMapMarkerAlt}
//                       label="Place of Supply"
//                       name="place_of_supply"
//                       value={formData.place_of_supply}
//                       onChange={handleChange}
//                     />

//                     <FormField
//                       icon={FaMoneyBillWave}
//                       label="Payment Mode"
//                       name="payment_mode"
//                       value={formData.payment_mode}
//                       onChange={handleChange}
//                       options={[
//                         { id: 'cash', name: 'cash' },
//                         { id: 'card', name: 'card' },
//                         { id: 'online', name: 'online' },
//                         { id: 'cheque', name: 'cheque' },
//                         { id: 'other', name: 'other' }
//                       ]}
//                     />
//                     <FormField
//                       icon={FaMoneyBillWave}
//                       label="Payment Amount"
//                       name="payment_amount"
//                       value={formData.payment_amount}
//                       onChange={handleChange}
//                     />
//                   </Col>
//                   <Col md={4}>
//                     <FormField icon={FaTruck} label="Vehicle No" name="vehicle_no" value={formData.vehicle_no} onChange={handleChange} />
//                     {/* <FormField icon={FaCity} label="Station" name="station" value={formData.station} onChange={handleChange} /> */}
//                     <FormField icon={FaCity} label="Station" name="station" value={formData.station} onChange={handleChange} />
//                     <FormField icon={FaKey} label="Palement" name="palement" value={formData.ewaybill} onChange={handleChange} />
//                     <FormField icon={FaKey} label="Supplier ID" name="supplier_id" value={formData.ack_no} onChange={handleChange} />
//                     {/* <FormField icon={FaKey} label="IRN" name="irn" value={formData.irn} onChange={handleChange} /> */}
//                     <FormField icon={FaUsers} label="Operator" name="operator" value={formData.qr_code} onChange={handleChange} />
//                     <FormField
//                       icon={FaMoneyBillWave}
//                       label="Payment Bank"
//                       name="payment_bank"
//                       value={formData.payment_bank}
//                       onChange={handleChange}
//                     />
//                     <FormField
//                       icon={FaMoneyBillWave}
//                       label="Payment Status"
//                       name="payment_status"
//                       value={formData.payment_status}
//                       onChange={handleChange}
//                       options={[
//                         { id: 'paid', name: 'paid' },
//                         { id: 'pending', name: 'pending' },
//                         { id: 'failed', name: 'failed' }
//                       ]}
//                     />
//                   </Col>

//                   <Col md={4}>
//                     <FormField icon={FaFileInvoice} label="GR/RR" name="gr_rr" value={formData.gr_rr} onChange={handleChange} />
//                     <FormField icon={FaTruck} label="Transport" name="transport" value={formData.transport} onChange={handleChange} />
//                     <FormField
//                       icon={FaKey}
//                       label="Reverse Charge"
//                       name="reverse_charge"
//                       value={formData.reverse_charge}
//                       onChange={handleChange}
//                       options={[
//                         { id: 1, name: 'true' },
//                         { id: 0, name: 'false' }
//                       ]}
//                     />
//                     <FormField
//                       icon={FaMoneyBillWave}
//                       label="Payment A/C no"
//                       name="payment_account_no"
//                       value={formData.payment_account_no}
//                       onChange={handleChange}
//                     />
//                     <FormField
//                       icon={FaMoneyBillWave}
//                       label="Payment Ref No"
//                       name="payment_ref_no"
//                       value={formData.payment_ref_no}
//                       onChange={handleChange}
//                     />
//                     <FormField
//                       icon={FaMoneyBillWave}
//                       type="date"
//                       label="Payment Date"
//                       name="payment_date"
//                       value={formData.payment_date}
//                       onChange={handleChange}
//                     />

//                     <FormField
//                       icon={FaMoneyBillWave}
//                       label="Payment Tailoring"
//                       name="payment_tailoring"
//                       value={formData.payment_tailoring}
//                       onChange={handleChange}
//                     />
//                   </Col>
//                 </Row>
//                 <hr />

//                 <div>
//                   <div className="d-flex align-items-center gap-3 mb-3">
//                     <label htmlFor="shadeNo" className="form-label mb-0 fw-medium">
//                       Select Shade No
//                     </label>
//                     <Form.Control
//                       as="select"
//                       id="shadeNo"
//                       className="form-select px-2"
//                       style={{ width: '8rem', minWidth: 'fit-content' }}
//                       onChange={handleShadeNoChange}
//                     >
//                       <option value="">Select</option>

//                       {shadeNo.map((shade) => {
//                         return (
//                           <option key={shade.id} value={shade.id}>
//                             {shade.shadeNo}
//                           </option>
//                         );
//                       })}
//                     </Form.Control>
//                   </div>
//                   <div className="row">
//                     <div className="col-12">
//                       <div className="card rounded-lg shadow-none" style={{ background: '#f5f0e6' }}>
//                         {loading ? (
//                           <div>
//                             {[...Array(8)].map((_, index) => (
//                               <div key={index} style={{ display: 'flex', gap: '10px', padding: '10px' }}>
//                                 <Skeleton width={50} height={20} />
//                                 <Skeleton width={200} height={20} />
//                                 <Skeleton width={200} height={20} />
//                                 <Skeleton width={200} height={20} />
//                                 <Skeleton width={200} height={20} />
//                                 <Skeleton width={200} height={20} />
//                               </div>
//                             ))}
//                           </div>
//                         ) : (
//                           <div className="card-body p-0" style={{ borderRadius: '8px' }}>
//                             <div className="table-responsive">
//                               <table className="table table-hover table-bordered align-middle">
//                                 <thead className="table-dark">
//                                   <tr>
//                                     <th scope="col" style={{ width: '50px' }}>
//                                       {/* Empty header for checkbox column */}
//                                       <input
//                                         type="checkbox"
//                                         // onChange={(e) => setSelectedRows(e.target.checked ? products.map((row) => row.stock_available_id) : [])}
//                                         // checked={selectedRows.length === products.length}
//                                       />
//                                     </th>
//                                     {columns.map((column) => (
//                                       <th key={column.id} scope="col">
//                                         {column.label}
//                                       </th>
//                                     ))}
//                                   </tr>
//                                 </thead>
//                                 <tbody>
//                                   {products.map((row) => (
//                                     <tr key={row.stock_available_id}>
//                                       <td>
//                                         <input type="checkbox" onChange={() => handleCheckboxChange(row.stock_available_id)} />
//                                       </td>
//                                       {columns.map((column) => (
//                                         <td key={column.id}>{row[column.id]}</td>
//                                       ))}
//                                     </tr>
//                                   ))}
//                                 </tbody>
//                               </table>
//                             </div>
//                           </div>
//                         )}
//                         <div className="mt-3">
//                           <h4 className="ms-4 mb-3">Selected Rows:</h4>
//                         </div>
//                         <div className="card-body p-0" style={{ borderRadius: '8px' }}>
//                           <div className="table-responsive">
//                             <table className="table table-hover table-bordered align-middle">
//                               <thead className="table-dark">
//                                 <tr>
//                                   {columns.map((column) => (
//                                     <th key={column.id} scope="col">
//                                       {column.label}
//                                     </th>
//                                   ))}
//                                   <th>Rate</th>
//                                   <th>Amount</th>
//                                 </tr>
//                               </thead>
//                               <tbody>
//                                 {selectedRows.map((row) => (
//                                   <tr key={row.stock_available_id}>
//                                     <td key="shadeNo">{row.product_shadeNo}</td>
//                                     <td key="pur_shadeNo">{row.product_shadeNo}</td>
//                                     <td key="lot_no">
//                                       <input
//                                         type="text"
//                                         value={row.lot_no || ''}
//                                         className="py-2"
//                                         onChange={(e) => handleInputChange(row.stock_available_id, 'lot_no', e.target.value)}
//                                       />
//                                     </td>
//                                     <td key="Stock Code">
//                                       <td key="pur_shadeNo">{row.stock_code}</td>
//                                     </td>
//                                     <td key="width">
//                                       <input
//                                         type="text"
//                                         max={Number(row.out_width)}
//                                         value={row.out_width || ''}
//                                         className="py-2"
//                                         onChange={(e) => handleInputChange(row.stock_available_id, 'out_width', e.target.value)}
//                                       />
//                                     </td>
//                                     <td key="length">
//                                       <input
//                                         type="text"
//                                         max={Number(row.out_length)}
//                                         value={row.out_length || ''}
//                                         className="py-2"
//                                         onChange={(e) => handleInputChange(row.stock_available_id, 'out_length', e.target.value)}
//                                       />
//                                     </td>
//                                     <td key="unit">
//                                       <select
//                                         className="form-control"
//                                         style={{ width: '5rem', paddingInline: '10px' }}
//                                         value={row.unit || ''}
//                                         onChange={(e) => handleInputChange(row.stock_available_id, 'unit', e.target.value)}
//                                       >
//                                         <option value="" disabled>
//                                           Select
//                                         </option>
//                                         <option value="meter">meter</option>
//                                         <option value="inches">inches</option>
//                                       </select>
//                                     </td>
//                                     <td key="area">
//                                       <input
//                                         type="text"
//                                         value={row.area || ''}
//                                         className="py-2"
//                                         onChange={(e) => handleInputChange(row.stock_available_id, 'area', e.target.value)}
//                                       />
//                                     </td>
//                                     <td key="type">
//                                       <select
//                                         className="form-control"
//                                         style={{ width: '5rem', paddingInline: '10px' }}
//                                         value={row.product_type || ''}
//                                         onChange={(e) => handleInputChange(row.stock_available_id, 'product_type', e.target.value)}
//                                       >
//                                         <option value="" disabled>
//                                           Select
//                                         </option>
//                                         <option value="roll">Roll</option>
//                                         <option value="box">Box</option>
//                                       </select>
//                                     </td>
//                                     <td key="rate">
//                                       <input
//                                         type="text"
//                                         value={row.rate || ''}
//                                         className="py-2"
//                                         onChange={(e) => handleInputChange(row.stock_available_id, 'rate', e.target.value)}
//                                       />
//                                     </td>
//                                     <td key="amount">
//                                       <input
//                                         type="text"
//                                         value={row.amount || ''}
//                                         className="py-2"
//                                         onChange={(e) => handleInputChange(row.stock_available_id, 'amount', e.target.value)}
//                                       />
//                                     </td>
//                                   </tr>
//                                 ))}
//                               </tbody>
//                             </table>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                   <Row className="mt-4">
//                     <Col md={3}>
//                       <FormField
//                         icon={FaMoneyBillWave}
//                         label="Total Amount"
//                         name="total_amount"
//                         value={formData.total_amount}
//                         onChange={handleChange}
//                       />
//                     </Col>
//                     <Col md={3}>
//                       <FormField
//                         icon={FaPercentage}
//                         label="SGST(%)"
//                         name="sgst_percentage"
//                         value={formData.sgst_percentage}
//                         onChange={handleChange}
//                       />
//                     </Col>
//                     <Col md={3}>
//                       <FormField
//                         icon={FaPercentage}
//                         label="CGST(%)"
//                         name="cgst_percentage"
//                         value={formData.cgst_percentage}
//                         onChange={handleChange}
//                       />
//                     </Col>

//                     <Col md={3}>
//                       <FormField
//                         icon={FaCalendarAlt}
//                         label="Ack Date"
//                         type="date"
//                         name="ack_date"
//                         value={formData.ack_date}
//                         onChange={handleChange}
//                       />
//                     </Col>
//                   </Row>
//                 </div>
//                 <Button
//                   variant="primary"
//                   type="submit"
//                   className="mt-5 d-block m-auto"
//                   style={{
//                     backgroundColor: mainColor,
//                     borderColor: mainColor,
//                     width: '10rem'
//                   }}
//                 >
//                   <FaUserPlus className="me-2" /> Stock out
//                 </Button>
//               </Form>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>
//     </Container>
//   );
// };

// export default Invoice_out;



import React, { useState, useEffect } from 'react';
import { Table, Form, Button, Card, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaUserPlus, FaTrash, FaPlus } from 'react-icons/fa';
import Skeleton from 'react-loading-skeleton';
import DataTable from 'react-data-table-component';
import { MdEdit, MdDelete, MdPersonAdd } from 'react-icons/md';

import 'react-loading-skeleton/dist/skeleton.css';
import {
  FaFileInvoice,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUsers,
  FaKey,
  FaMoneyBillWave,
  FaPercentage,
  FaTruck,
  FaCity,
  FaSignature,
  FaQrcode
} from 'react-icons/fa';
import FormField from '../../components/FormField';

const Invoice_out = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [receivers, setReceivers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [banks, setBanks] = useState([]);
  const [shadeNo, setShadeNo] = useState([]);
  const [invoice_no, SetInvoiceNo] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [formData, setFormData] = useState({
    invoice_no: '',
    date: '',
    customer_id: '',
    receiver_id: '',
    place_of_supply: '',
    vehicle_no: '',
    station: '',
    ewaybill: '',
    reverse_charge: false,
    gr_rr: '',
    transport: '',
    irn: '',
    ack_no: '',
    ack_date: '',
    total_amount: '',
    cgst_percentage: '',
    sgst_percentage: '',
    payment_mode: '',
    payment_status: '',
    payment_date: '',
    payment_bank: '',
    payment_account_no: '',
    payment_ref_no: '',
    payment_amount: '',
    payment_tailoring: '',
    qr_code: '',
    out_products: []
  });

  useEffect(() => {
    const fetchShadeNo = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/available`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        setShadeNo(response.data.data);
      } catch (error) {
        console.error('Error fetching product data:', error);
      }
    };
    fetchShadeNo();
  }, []);

  useEffect(() => {
    const fetchInvoiceNo = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/stockout/invoiceno`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        SetInvoiceNo(response.data.data);
        setFormData((prevData) => ({
          ...prevData,
          invoice_no: response.data.data
        }));
      } catch (error) {
        console.error('Error fetching Invoice No data:', error);
      }
    };
    fetchInvoiceNo();
  }, []);

  const handleShadeNoChange = async (event) => {
    setLoading(true);
    const selectedProductId = event.target.value;

    if (selectedProductId) {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/godowncheckout/${selectedProductId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        setLoading(false);

        console.log(response.data.data);
        setProducts(response.data.data);
      } catch (error) {
        console.error('Error fetching product data:', error);
      }
    } else {
      setProducts(null);
    }
  };

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/customers`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        setCustomers(response.data.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchCustomerData();
  }, []);

  useEffect(() => {
    const fetchReceiverData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/receiver`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        setReceivers(response.data.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchReceiverData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);

    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleInputChange = (id, field, value) => {
    setSelectedRows((prevSelectedRows) => {
      const updatedRows = prevSelectedRows.map((row) => {
        if (row.stock_available_id === id) {
          const updatedRow = { ...row, [field]: value };

          if (field === 'out_length' || field === 'out_width' || field === 'unit') {
            const lengthInFeet =
              updatedRow.unit === 'meter'
                ? Number(updatedRow.out_length) * 3.28084
                : updatedRow.unit === 'inches'
                  ? Number(updatedRow.out_length) / 12 // Convert inches to feet
                  : Number(updatedRow.out_length); // Default to feet

            const widthInFeet =
              updatedRow.unit === 'meter'
                ? Number(updatedRow.out_width) * 3.28084 // Convert meters to feet
                : updatedRow.unit === 'inches'
                  ? Number(updatedRow.out_width) / 12 // Convert inches to feet
                  : Number(updatedRow.out_width); // Default to feet

            updatedRow.area = (lengthInFeet * widthInFeet).toFixed(2); // Calculate area
          }

          if (field === 'rate' || field === 'out_length' || field === 'out_width' || field === 'unit') {
            updatedRow.amount = (Number(updatedRow.area || 0) * Number(updatedRow.rate || 0)).toFixed(2);
          }

          return updatedRow;
        }
        return row;
      });

      setFormData((prevFormData) => ({
        ...prevFormData,
        out_products: updatedRows
      }));

      return updatedRows;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/godownstockout`, formData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      toast.success('Stocks out successfully');
      navigate('/all-invoices-out');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error adding user';
      toast.error(errorMessage);
    }
    console.log(formData);
  };

  const columns = [
    { id: 'product_shadeNo', label: 'Shade No' },
    { id: 'product_purchase_shade_no', label: 'Pur. Shade No' },
    { id: 'lot_no', label: 'LOT No' },
    { id: 'stock_code', label: 'Stock Code' },
    { id: 'out_width', label: 'Width' },
    { id: 'out_length', label: 'Length' },
    { id: 'unit', label: ' Unit' },
    { id: 'area_sq_ft', label: 'Area(sqft)' },
    { id: 'product_type', label: 'Type' }
  ];

  const handleCheckboxChange = (id) => {
    setSelectedRows((prevSelected) => {
      const isAlreadySelected = prevSelected.some((row) => row.stock_available_id === id);

      const updatedSelectedRows = isAlreadySelected
        ? prevSelected.filter((row) => row.stock_available_id !== id)
        : [...prevSelected, products.find((p) => p.stock_available_id === id)];

      console.log(updatedSelectedRows);
      setFormData((prevFormData) => ({
        ...prevFormData,
        out_products: updatedSelectedRows
      }));

      return updatedSelectedRows;
    });
  };
  console.log('data', formData.invoice_no);
  const mainColor = '#3f4d67';
  return (
    <Container
      fluid
      className="pt-1 px-2"
      style={{
        border: '3px dashed #14ab7f',
        borderRadius: '8px',
        background: '#ff9d0014'
      }}
    >
      <Row className="justify-content-center">
        <Col md={12} lg={12}>
          <Card className="shadow-lg border-0" style={{ borderRadius: '15px' }}>
            <div
              className="p-4 text-white text-center"
              style={{
                backgroundColor: '#20B2AA',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <FaUserPlus size={40} className="me-3" />
              <h2 className="m-0 text-white">Add Invoice</h2>
            </div>
            <Card.Body className="p-5">
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={4}>
                    <FormField icon={FaFileInvoice} label="Invoice_no" name="invoice_no" value={invoice_no} readOnly />
                    <FormField
                      icon={FaUsers}
                      label="Seller"
                      name="receiver_id"
                      value={formData.receiver_id}
                      onChange={handleChange}
                      options={receivers}
                      add={'/add-Receiver'}
                      required
                    />
                    <FormField
                      icon={FaUser}
                      label="Customer"
                      name="customer_id"
                      value={formData.customer_id}
                      onChange={handleChange}
                      options={customers}
                      add={'/add-Customer'}
                      required
                    />
                    <FormField icon={FaCalendarAlt} label="Date" type="date" name="date" value={formData.date} onChange={handleChange} required/>
                    <FormField
                      icon={FaMapMarkerAlt}
                      label="Place of Supply"
                      name="place_of_supply"
                      value={formData.place_of_supply}
                      onChange={handleChange}
                    />

                    <FormField
                      icon={FaMoneyBillWave}
                      label="Payment Mode"
                      name="payment_mode"
                      value={formData.payment_mode}
                      onChange={handleChange}
                      options={[
                        { id: 'cash', name: 'cash' },
                        { id: 'card', name: 'card' },
                        { id: 'online', name: 'online' },
                        { id: 'cheque', name: 'cheque' },
                        { id: 'other', name: 'other' }
                      ]}
                    />
                    <FormField
                      icon={FaMoneyBillWave}
                      label="Payment Amount"
                      name="payment_amount"
                      value={formData.payment_amount}
                      onChange={handleChange}
                    />
                  </Col>
                  <Col md={4}>
                    <FormField icon={FaTruck} label="Vehicle No" name="vehicle_no" value={formData.vehicle_no} onChange={handleChange} />
                    <FormField icon={FaCity} label="Station" name="station" value={formData.station} onChange={handleChange} />
                    <FormField icon={FaKey} label="eWaybill" name="ewaybill" value={formData.ewaybill} onChange={handleChange} />
                    <FormField icon={FaKey} label="Ack No" name="ack_no" value={formData.ack_no} onChange={handleChange} />
                    {/* <FormField icon={FaKey} label="IRN" name="irn" value={formData.irn} onChange={handleChange} /> */}
                    <FormField icon={FaMoneyBillWave} label="QR Code" name="qr_code" value={formData.qr_code} onChange={handleChange} />
                    <FormField
                      icon={FaMoneyBillWave}
                      label="Payment Bank"
                      name="payment_bank"
                      value={formData.payment_bank}
                      onChange={handleChange}
                    />
                    <FormField
                      icon={FaMoneyBillWave}
                      label="Payment Status"
                      name="payment_status"
                      value={formData.payment_status}
                      onChange={handleChange}
                      options={[
                        { id: 'paid', name: 'paid' },
                        { id: 'pending', name: 'pending' },
                        { id: 'failed', name: 'failed' }
                      ]}
                    />
                  </Col>

                  <Col md={4}>
                    <FormField icon={FaFileInvoice} label="GR/RR" name="gr_rr" value={formData.gr_rr} onChange={handleChange} />
                    <FormField icon={FaTruck} label="Transport" name="transport" value={formData.transport} onChange={handleChange} />
                    <FormField
                      icon={FaKey}
                      label="Reverse Charge"
                      name="reverse_charge"
                      value={formData.reverse_charge}
                      onChange={handleChange}
                      options={[
                        { id: 1, name: 'true' },
                        { id: 0, name: 'false' }
                      ]}
                    />
                    <FormField
                      icon={FaMoneyBillWave}
                      label="Payment A/C no"
                      name="payment_account_no"
                      value={formData.payment_account_no}
                      onChange={handleChange}
                    />
                    <FormField
                      icon={FaMoneyBillWave}
                      label="Payment Ref No"
                      name="payment_ref_no"
                      value={formData.payment_ref_no}
                      onChange={handleChange}
                    />
                    <FormField
                      icon={FaMoneyBillWave}
                      type="date"
                      label="Payment Date"
                      name="payment_date"
                      value={formData.payment_date}
                      onChange={handleChange}
                    />

                    <FormField
                      icon={FaMoneyBillWave}
                      label="Payment Tailoring"
                      name="payment_tailoring"
                      value={formData.payment_tailoring}
                      onChange={handleChange}
                    />
                  </Col>
                </Row>
                <hr />

                <div>
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <label htmlFor="shadeNo" className="form-label mb-0 fw-medium">
                      Select Shade No
                    </label>
                    <Form.Control
                      as="select"
                      id="shadeNo"
                      className="form-select px-2"
                      style={{ width: '8rem', minWidth: 'fit-content' }}
                      onChange={handleShadeNoChange}
                    >
                      <option value="">Select</option>

                      {shadeNo.map((shade) => {
                        return (
                          <option key={shade.id} value={shade.id}>
                            {shade.shadeNo}
                          </option>
                        );
                      })}
                    </Form.Control>
                  </div>
                  <div className="row">
                    <div className="col-12">
                      <div className="card rounded-lg shadow-none" style={{ background: '#f5f0e6' }}>
                        {loading ? (
                          <div>
                            {[...Array(8)].map((_, index) => (
                              <div key={index} style={{ display: 'flex', gap: '10px', padding: '10px' }}>
                                <Skeleton width={50} height={20} />
                                <Skeleton width={200} height={20} />
                                <Skeleton width={200} height={20} />
                                <Skeleton width={200} height={20} />
                                <Skeleton width={200} height={20} />
                                <Skeleton width={200} height={20} />
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="card-body p-0" style={{ borderRadius: '8px' }}>
                            <div className="table-responsive">
                              <table className="table table-hover table-bordered align-middle">
                                <thead className="table-dark">
                                  <tr>
                                    <th scope="col" style={{ width: '50px' }}>
                                      {/* Empty header for checkbox column */}
                                      <input
                                        type="checkbox"
                                        // onChange={(e) => setSelectedRows(e.target.checked ? products.map((row) => row.stock_available_id) : [])}
                                        // checked={selectedRows.length === products.length}
                                      />
                                    </th>
                                    {columns.map((column) => (
                                      <th key={column.id} scope="col">
                                        {column.label}
                                      </th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody>
                                  {products.map((row) => (
                                    <tr key={row.stock_available_id}>
                                      <td>
                                        <input type="checkbox" onChange={() => handleCheckboxChange(row.stock_available_id)} />
                                      </td>
                                      {columns.map((column) => (
                                        <td key={column.id}>{row[column.id]}</td>
                                      ))}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}
                        <div className="mt-3">
                          <h4 className="ms-4 mb-3">Selected Rows:</h4>
                        </div>
                        <div className="card-body p-0" style={{ borderRadius: '8px' }}>
                          <div className="table-responsive">
                            <table className="table table-hover table-bordered align-middle">
                              <thead className="table-dark">
                                <tr>
                                  {columns.map((column) => (
                                    <th key={column.id} scope="col">
                                      {column.label}
                                    </th>
                                  ))}
                                  <th>Rate</th>
                                  <th>Amount</th>
                                </tr>
                              </thead>
                              <tbody>
                                {selectedRows.map((row) => (
                                  <tr key={row.stock_available_id}>
                                    <td key="shadeNo">{row.product_shadeNo}</td>
                                    <td key="pur_shadeNo">{row.product_shadeNo}</td>
                                    <td key="lot_no">
                                      <input
                                        type="text"
                                        value={row.lot_no || ''}
                                        className="py-2"
                                        onChange={(e) => handleInputChange(row.stock_available_id, 'lot_no', e.target.value)}
                                      />
                                    </td>
                                    <td key="Stock Code">
                                      <td key="pur_shadeNo">{row.stock_code}</td>
                                    </td>
                                    <td key="width">
                                      <input
                                        type="text"
                                        max={Number(row.out_width)}
                                        value={row.out_width || ''}
                                        className="py-2"
                                        onChange={(e) => handleInputChange(row.stock_available_id, 'out_width', e.target.value)}
                                      />
                                    </td>
                                    <td key="length">
                                      <input
                                        type="text"
                                        max={Number(row.out_length)}
                                        value={row.out_length || ''}
                                        className="py-2"
                                        onChange={(e) => handleInputChange(row.stock_available_id, 'out_length', e.target.value)}
                                      />
                                    </td>
                                    <td key="unit">
                                      <select
                                        className="form-control"
                                        style={{ width: '5rem', paddingInline: '10px' }}
                                        value={row.unit || ''}
                                        onChange={(e) => handleInputChange(row.stock_available_id, 'unit', e.target.value)}
                                      >
                                        <option value="" disabled>
                                          Select
                                        </option>
                                        <option value="meter">meter</option>
                                        <option value="inches">inches</option>
                                      </select>
                                    </td>
                                    <td key="area">
                                      <input
                                        type="text"
                                        value={row.area || ''}
                                        className="py-2"
                                        onChange={(e) => handleInputChange(row.stock_available_id, 'area', e.target.value)}
                                      />
                                    </td>
                                    <td key="type">
                                      <select
                                        className="form-control"
                                        style={{ width: '5rem', paddingInline: '10px' }}
                                        value={row.product_type || ''}
                                        onChange={(e) => handleInputChange(row.stock_available_id, 'product_type', e.target.value)}
                                      >
                                        <option value="" disabled>
                                          Select
                                        </option>
                                        <option value="roll">Roll</option>
                                        <option value="box">Box</option>
                                      </select>
                                    </td>
                                    <td key="rate">
                                      <input
                                        type="text"
                                        value={row.rate || ''}
                                        className="py-2"
                                        onChange={(e) => handleInputChange(row.stock_available_id, 'rate', e.target.value)}
                                      />
                                    </td>
                                    <td key="amount">
                                      <input
                                        type="text"
                                        value={row.amount || ''}
                                        className="py-2"
                                        onChange={(e) => handleInputChange(row.stock_available_id, 'amount', e.target.value)}
                                      />
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Row className="mt-4">
                    <Col md={3}>
                      <FormField
                        icon={FaMoneyBillWave}
                        label="Total Amount"
                        name="total_amount"
                        value={formData.total_amount}
                        onChange={handleChange}
                      />
                    </Col>
                    <Col md={3}>
                      <FormField
                        icon={FaPercentage}
                        label="SGST(%)"
                        name="sgst_percentage"
                        value={formData.sgst_percentage}
                        onChange={handleChange}
                      />
                    </Col>
                    <Col md={3}>
                      <FormField
                        icon={FaPercentage}
                        label="CGST(%)"
                        name="cgst_percentage"
                        value={formData.cgst_percentage}
                        onChange={handleChange}
                      />
                    </Col>

                    <Col md={3}>
                      <FormField
                        icon={FaCalendarAlt}
                        label="Ack Date"
                        type="date"
                        name="ack_date"
                        value={formData.ack_date}
                        onChange={handleChange}
                      />
                    </Col>
                  </Row>
                </div>
                <Button
                  variant="primary"
                  type="submit"
                  className="mt-5 d-block m-auto"
                  style={{
                    backgroundColor: mainColor,
                    borderColor: mainColor,
                    width: '10rem'
                  }}
                >
                  <FaUserPlus className="me-2" /> Stock out
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Invoice_out;