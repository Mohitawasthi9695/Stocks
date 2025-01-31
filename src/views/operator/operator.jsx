// import React, { useState, useEffect } from 'react';
// import { Table, Form, Button, Card, Container, Row, Col } from 'react-bootstrap';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import { useNavigate } from 'react-router-dom';
// import {
//   FaUser ,
//   FaUserPlus,
//   FaTrash,
//   FaPlus,
//   FaFileInvoice,
//   FaTruck,
//   FaMoneyBillWave,
//   FaPercentage,
//   FaKey,
//   FaCalendarAlt
// } from 'react-icons/fa';
// import FormField from '../../components/FormField';
// import { AiFillCalculator } from 'react-icons/ai';
// import { TbRulerMeasure } from 'react-icons/tb';
// import { AiOutlineLeftSquare } from 'react-icons/ai';

// const Add_quotation = () => {
//   const today = new Date().toISOString().split('T')[0];
//   const [formData, setFormData] = useState({
//     date: today,
//     ack_date: today,
//     qr_code: '',
//     products: [],
//     transport: '',
//     warehouse: '',
//     reverse_charge: '',
//     agent: '',
//     vendor: '',
//     lot_no: '',
//     sft: '',
//     palement: '',
//     units: '',
//     operator: '',
//     people_id: '1',
//     vehicle_no: '',
//     transport_agency: '',
//     selectedProduct: '',
//     total_amount: 0,
//     sgst_percentage: 0,
//     cgst_percentage: 0
//   });
//   const [items, setItems] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [godownProducts, setGodownProducts] = useState([]);
//   const [suppliers, setSuppliers] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchProductData = async () => {
//       try {
//         const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/products`, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`,
//             'Content-Type': 'application/json',
//           },
//         });
//         setProducts(response.data.data);
//       } catch (err) {
//         console.error("Error fetching products:", err.response?.data || err.message);
//       }
//     };
//     fetchProductData();
//   }, []);

//   // Fetch suppliers
//   useEffect(() => {
//     const fetchSupplierData = async () => {
//       try {
//         const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/supplier`, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`,
//             'Content-Type': 'application/json'
//           }
//         });
//         setSuppliers(response.data.data);
//       } catch (err) {
//         console.error("Error fetching suppliers:", err.response?.data || err.message);
//       }
//     };
//     fetchSupplierData();
//   }, []);

//   // Fetch godown products
//   useEffect(() => {
//     const fetchGodownProducts = async () => {
//       try {
//         const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/godownproducts`, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`,
//             'Content-Type': 'application/json'
//           }
//         });
//         setGodownProducts(response.data.data);
//       } catch (err) {
//         console.error("Error fetching godown products:", err.response?.data || err.message);
//       }
//     };
//     fetchGodownProducts();
//   }, []);

//   useEffect(() => {
//     const fetchAllProducts = async () => {
//       try {
//         const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/products`, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`
//           }
//         });
//         setAllProducts(response.data.data);
//       } catch (error) {
//         console.error(error);
//       }
//     };
//     fetchAllProducts();
//   }, []);

//   const handleAddRow = () => {
//     setItems((prevItems) => [
//       ...prevItems,
//       {
//         product_id: '',
//         purchase_shadeNo: '',
//         hsn_sac_code: '',
//         quantity: '',
//         product_type: '',
//         total_product: '',
//         unit: '',
//         rate: '',
//         amount: ''
//       }
//     ]);
//     setFormData((prevFormData) => ({
//       ...prevFormData,
//       products: [
//         ...prevFormData.products,
//         {
//           product_id: '',
//           purchase_shadeNo: '',
//           hsn_sac_code: '',
//           quantity: 0,
//           product_type: '',
//           total_product: '',
//           unit: '',
//           rate: 0,
//           amount: 0
//         }
//       ]
//     }));
//   };

//   const handleDeleteRow = (index) => {
//     setItems(items.filter((_, i) => i !== index));
//     setFormData((prevFormData) => {
//       const updatedProducts = prevFormData.products.filter((_, i) => i !== index);
//       return {
//         ...prevFormData,
//         products: updatedProducts
//       };
//     });
//   };

//   const handleRowChange = (index, field, value) => {
//     // Update rows
//     setItems((prevRows) => {
//       const updatedRows = [...prevRows];
//       updatedRows[index][field] = value;

//       // Update amount based on rate and quantity
//       if (field === 'quantity' || field === 'rate') {
//         updatedRows[index].amount = parseFloat(updatedRows[index].quantity || 0) * parseFloat(updatedRows[index].rate || 0);

//       }

//       // Update form data
//       setFormData((prevFormData) => {
//         const updatedProducts = [...prevFormData.products];
//         updatedProducts[index] = { ...updatedRows[index] };

//         // Recalculate total amount
//         const totalAmount = updatedProducts.reduce((acc, item) => acc + (parseFloat(item.amount) || 0), 0);

//         return {
//           ...prevFormData,
//           products: updatedProducts,
//           total_amount: totalAmount,
//         };
//       });

//       return updatedRows;
//     });
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({ ...prevData, [name]: value }));
//   };

//   // const handleSubmit = async (e) => {
//   //   e.preventDefault();

//   //   const basicFormData = {
//   //     operator: formData.operator,
//   //     people_id: formData.people_id,
//   //     total_amount: formData.total_amount,
//   //   };

//   //   console.log("Simplified Data:", basicFormData);

//   //   try {
//   //     const response = await axios.post(
//   //       `${import.meta.env.VITE_API_BASE_URL}/api/godownstockout`,
//   //       basicFormData,
//   //       {
//   //         headers: {
//   //           'Content-Type': 'application/json',
//   //           Authorization: `Bearer ${localStorage.getItem('token')}`,
//   //         },
//   //       }
//   //     );

//   //     console.log("API Response:", response.data);
//   //     toast.success('Quotation added successfully');
//   //     navigate('/quotation');

//   //   } catch (error) {
//   //     console.error("Error submitting form:", error);
//   //     if (error.response) {
//   //       console.error("Error response:", error.response);
//   //       toast.error(error.response?.data?.message || 'Error adding quotation');
//   //     } else {
//   //       toast.error('Network error or server unreachable');
//   //     }
//   //   }
//   // };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/godownstockout  `, formData, {
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

//   return (
//     <Container fluid className="pt-1 px-2" style={{ border: '3px dashed #14ab7f', borderRadius: '8px', background: '#ff9d0014' }}>
//       <Row className="justify-content-center">
//         <Col md={12} lg={12}>
//           <Card className="shadow-lg border-0" style={{ borderRadius: '15px' }}>
//             <div
//               className="p-4 text-white text-center"
//               style={{ backgroundColor: '#20B2AA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
//             >
//               <FaUser Plus size={40} className="me-3" />
//               <h2 className="m-0 text-white"> Add Quotation</h2>
//             </div>
//             <Card.Body className="p-5">
//               <Form onSubmit={handleSubmit}>
//                 <Row>
//                   <Col md={4}>
//                     <FormField icon={FaUser } label="Operator" name="operator" value={formData.operator} onChange={handleChange} />
//                     <FormField
//                       icon={FaUser }
//                       label="Supplier"
//                       name="people_id"
//                       value={formData.people_id}
//                       onChange={handleChange}
//                       options={suppliers}
//                       add={'/add-Supplier'}
//                     />
//                     <FormField icon={AiFillCalculator} label
//                       ="Units" name="units" value={formData.units} onChange={handleChange} />
//                     <FormField icon={FaTruck} label="Transport" name="transport" value={formData.transport} onChange={handleChange} />
//                     <Form.Group controlId="formSelectProduct" className="mb-3">
//                       <Form.Label>Product</Form.Label>
//                       <Form.Control as="select" name="selectedProduct" value={formData.selectedProduct} onChange={handleChange}>
//                         <option value="">Select Product</option>
//                         {godownProducts.length === 0 ? (
//                           <option>No products available</option>
//                         ) : (
//                           godownProducts.map((product) => (
//                             <option key={product.id} value={product.id}>
//                               {product.product_name} - {product.quantity_available} available
//                             </option>
//                           ))
//                         )}
//                       </Form.Control>
//                     </Form.Group>
//                     <div className="mt-2">
//                     </div>
//                   </Col>
//                   <Col md={4}>
//                     <FormField icon={FaFileInvoice} label="Palement" name="palement" value={formData.palement} onChange={handleChange} />
//                     <FormField icon={AiOutlineLeftSquare} label="Lot_No" name="lot_no" value={formData.lot_no} onChange={handleChange} />
//                     <FormField icon={TbRulerMeasure} label="SQFT" name="sft" value={formData.sft} onChange={handleChange} />
//                     <FormField
//                       icon={FaUser }
//                       label="Transport_Agency"
//                       name="transport_agency"
//                       value={formData.transport_agency}
//                       onChange={handleChange}
//                     />
//                   </Col>
//                   <Col md={4}>
//                     <FormField icon={FaUser } label="Vendor" name="vendor" value={formData.vendor} onChange={handleChange} />
//                     <FormField icon={FaKey} label="Agent" name="agent" value={formData.agent} onChange={handleChange} />
//                     <FormField icon={FaTruck} label="Vehicle No" name="vehicle_no" value={formData.vehicle_no} onChange={handleChange} />

//                   </Col>
//                 </Row>

//                 <div>
//                   <div className="d-flex justify-content-between">
//                     <h5>Invoice Items</h5>
//                     <Button variant="success" onClick={handleAddRow} className="px-1 py-1">
//                       <FaPlus /> Add Item
//                     </Button>
//                   </div>
//                   <Table bordered hover responsive style={{ '--bs-table-bg': '#20b2aa', '--bs-table-color': 'unset' }}>
//                     <thead>
//                       <tr className="text-white">
//                         <th>&nbsp;&nbsp;Shade Number&nbsp;&nbsp;</th>
//                         <th>Pur. Shade No</th>
//                         <th>Total Product</th>
//                         <th>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Product Type&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>
//                         <th>HSN/SAC</th>
//                         <th>Quantity/Area</th>
//                         <th>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Unit&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>
//                         <th>&nbsp;&nbsp;Rate&nbsp;&nbsp;</th>
//                         <th>Amount</th>
//                         <th>Actions</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {items.map((item, index) => (
//                         <tr key={index}>
//                           <td>
//                             <Form.Control
//                               as="select"
//                               value={item.product_id || ''}
//                               onChange={(e) => handleRowChange(index, 'product_id', e.target.value)}
//                               className="px-1"
//                             >
//                               <option value="">Select Shade No.</option>
//                               {products.map((product) => (
//                                 <option key={product.id} value={product.id}>
//                                   {product.purchase_shade_no}
//                                 </option>
//                               ))}
//                             </Form.Control>
//                           </td>
//                           <td>
//                             <Form.Control
//                               type="text"
//                               value={item.purchase_shadeNo}
//                               onChange={(e) => handleRowChange(index, 'purchase_shadeNo', e.target.value)}
//                               className="px-1"
//                             />
//                           </td>
//                           <td>
//                             <Form.Control
//                               type="text"
//                               value={item.total_product}
//                               onChange={(e) => handleRowChange(index, 'total_product', e.target.value)}
//                               className="px-1"
//                             />
//                           </td>
//                           <td>
//                             <Form.Control
//                               as="select"
//                               value={item.product_type}
//                               onChange={(e) => handleRowChange(index, 'product_type', e.target.value)}
//                               className="px-1"
//                             >
//                               <option value="roll">Roll</option>
//                               <option value="box">Box</option>
//                             </Form.Control>
//                           </td>
//                           <td>
//                             <Form.Control
//                               type="text"
//                               value={item.hsn_sac_code}
//                               onChange={(e) => handleRowChange(index, 'hsn_sac_code', e.target.value)}
//                               className="px-1"
//                             />
//                           </td>
//                           <td>
//                             <Form.Control
//                               type="number"
//                               value={item.quantity}
//                               className="px-1"
//                               onChange={(e) => handleRowChange(index, 'quantity', e.target.value)}
//                             />
//                           </td>
//                           <td>
//                             <Form.Control
//                               as="select"
//                               value={item.unit}
//                               onChange={(e) => handleRowChange(index, 'unit', e.target.value)}
//                               className="px-1"
//                             >
//                               <option value="sqft">Sq.ft.</option>
//                               <option value="pcs">Pcs.</option>
//                             </Form.Control>
//                           </td>
//                           <td>
//                             <Form.Control
//                               type="number"
//                               value={item.rate}
//                               className="px-1"
//                               onChange={(e) => handleRowChange(index, 'rate', e.target.value)}
//                             />
//                           </td>
//                           <td>
//                             <Form.Control
//                               type="number"
//                               value={item.amount}
//                               className="px-1"
//                               onChange={(e) => handleRowChange(index, 'amount', e.target.value)}
//                             />
//                           </td>
//                           <td>
//                             <Button variant="danger" onClick={() => handleDeleteRow(index)}>
//                               <FaTrash />
//                             </Button>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </Table>
//                 </div>

//                 <Row className="mt-4">
//                   <Col md={3}>
//                     <FormField
//                       icon={FaMoneyBillWave}
//                       label="Total Amount"
//                       name="total_amount"
//                       value={formData.total_amount}
//                       onChange={handleChange}
//                     />
//                   </Col>
//                   <Col md={3}>
//                     <FormField
//                       icon={FaPercentage}
//                       label="SGST(%)"
//                       name="sgst_percentage"
//                       value={formData.sgst_percentage}
//                       onChange={handleChange}
//                     />
//                   </Col>
//                   <Col md={3}>
//                     <FormField
//                       icon={FaPercentage}
//                       label="CGST(%)"
//                       name="cgst_percentage"
//                       value={formData.cgst_percentage}
//                       onChange={handleChange}
//                     />
//                   </Col>
//                   <Col md={3}>
//                     <FormField
//                       icon={FaCalendarAlt}
//                       label="Ack Date"
//                       type="date"
//                       name="ack_date"
//                       value={formData.ack_date}
//                       onChange={handleChange}
//                     />
//                   </Col>
//                 </Row>
//                 <div className="d-flex justify-content-center">
//                   <Button type="submit" variant="primary" className="btn btn-dark btn-lg px-4">
//                     Submit
//                   </Button>
//                 </div>
//               </Form>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>
//     </Container>
//   );
// };

// export default Add_quotation;

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
  const [godownProducts, setGodownProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
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
    products: [],
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
    payment_remarks: '',
    qr_code: '',
    out_products: [],
    lot_no: '', // New field
    sft: '', // New field
    paleament: '', // New field
    units: '', // New field
    operator: '', // New field
    people_id: '1', // New field, default value
    transport_agency: '' // New field
  });

  useEffect(() => {
    const fetchShadeNo = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/godownproducts`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        setShadeNo(response.data);
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
        console.log(response.data.data);
        const activeCustomers = response.data.data.filter((customer) => customer.status === 1);
        setCustomers(activeCustomers);
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

      // Calculate total amount and update formData
      const totalAmount = calculateTotalAmount(updatedRows);
      setFormData((prevFormData) => ({
        ...prevFormData,
        out_products: updatedRows,
        total_amount: totalAmount // Update total amount
      }));

      return updatedRows;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation for required fields
    if (!formData.receiver_id || !formData.customer_id || !formData.date || !formData.place_of_supply) {
      toast.error('Please fill in all required fields: Seller, Customer, Date, and Place of Supply.');
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/godownstockout`, formData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      toast.success('Stocks out successfully');
      navigate('/quotation');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error adding user';
      toast.error(errorMessage);
    }
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

  const calculateTotalAmount = (rows) => {
    return rows
      .reduce((total, row) => {
        return total + (Number(row.amount) || 0);
      }, 0)
      .toFixed(2);
  };

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
              <h2 className="m-0 text-white">Add Quotation</h2>
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
                    />
                    <FormField
                      icon={FaUser}
                      label="Customer"
                      name="customer_id"
                      value={formData.customer_id}
                      onChange={handleChange}
                      options={customers}
                      add={'/add-Customer'}
                    />
                    <FormField icon={FaCalendarAlt} label="Date" type="date" name="date" value={formData.date} onChange={handleChange} />
                    <FormField
                      icon={FaMapMarkerAlt}
                      label="Place of Supply"
                      name="place_of_supply"
                      value={formData.place_of_supply}
                      onChange={handleChange}
                    />
                  </Col>
                  <Col md={4}>
                    <FormField icon={FaTruck} label="Vehicle No" name="vehicle_no" value={formData.vehicle_no} onChange={handleChange} />
                    <FormField icon={FaCity} label="Station" name="station" value={formData.station} onChange={handleChange} />
                    <FormField icon={FaFileInvoice} label="LOT No" name="lot_no" value={formData.lot_no} onChange={handleChange} />
                    <FormField icon={FaFileInvoice} label="SFT" name="sft" value={formData.sft} onChange={handleChange} />
                    <FormField icon={FaFileInvoice} label="Paleament" name="paleament" value={formData.paleament} onChange={handleChange} />
                  </Col>

                  <Col md={4}>
                    <FormField icon={FaFileInvoice} label="GR/RR" name="gr_rr" value={formData.gr_rr} onChange={handleChange} />
                    <FormField icon={FaTruck} label="Transport" name="transport" value={formData.transport} onChange={handleChange} />
                    <FormField icon={FaFileInvoice} label="Units" name="units" value={formData.units} onChange={handleChange} />
                    <FormField icon={FaFileInvoice} label="Operator" name="operator" value={formData.operator} onChange={handleChange} />
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
                      style={{
                        width: '8rem',
                        minWidth: 'fit-content',
                        maxHeight: '150px', // Set maximum height for the dropdown
                        overflowY: 'auto' // Enable vertical scrolling
                      }}
                      onChange={handleShadeNoChange}
                    >
                      <option value="">Select</option>
                      {shadeNo.map((shade) => (
                        <option key={shade.id} value={shade.id}>
                          {shade.shadeNo}
                        </option>
                      ))}
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
                                      <input
                                        type="checkbox"
                                        
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
