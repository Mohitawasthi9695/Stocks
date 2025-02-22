// import React, { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { Table, Form, Button, Container, Row, Col } from 'react-bootstrap';
// import { FaUserPlus } from 'react-icons/fa';
// import axios from 'axios';
// import { toast } from 'react-toastify';

// const AddProduct = () => {
//   const { id, no } = useParams();
//   const navigate = useNavigate();
//   const [items, setItems] = useState([
//     {
//       gate_pass_no: '',
//       lot_no: '',
//       product_category_id: '',
//       product_id: '',
//       purchase_shadeNo: '',
//       width: '',
//       length: '',
//       date: '',
//       rack: '',
//       length_unit: '',
//       width_unit: '',
//       pcs: '2',
//       quantity: ''
//     }
//   ]);
//   const [godownStocks, setGodownStocks] = useState([]);

//   useEffect(() => {
//     const fetchGodownStocks = async () => {
//       try {
//         const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

//         if (!API_BASE_URL) {
//           console.error('API_BASE_URL is not defined');
//           return;
//         }

//         console.log('Fetching from:', `${API_BASE_URL}/api/godownverticalstock/${id}`);

//         const response = await axios.get(`${API_BASE_URL}/api/godownverticalstock/${id}`, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`
//           }
//         });

//         console.log('Response Data:', response.data);

//         if (!response.data || !Array.isArray(response.data.data)) {
//           throw new Error('Invalid API response format');
//         }

//         setGodownStocks(response.data.data);
//       } catch (error) {
//         toast.error(error.response?.data?.message || 'Error fetching godown stocks');
//         console.error('Fetch Error:', error);
//       }
//     };

//     fetchGodownStocks();
//   }, []);

//   const handleRowChange = (index, field, value) => {
//     setItems((prevItems) => {
//       const updatedItems = [...prevItems];
//       updatedItems[index] = { ...updatedItems[index], [field]: value };
//       return updatedItems;
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const payload = items.map((item) => ({ ...item, invoice_id: id, invoice_no: no }));
//       await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/godownverticalstock`, payload, {
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${localStorage.getItem('token')}`
//         }
//       });
//       toast.success('Stock added successfully');
//       navigate('/vertical_stock');
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Error adding stock');
//       console.error(error);
//     }
//   };

//   return (
//     <Container fluid className="pt-4 px-2" style={{ border: '3px dashed #14ab7f', borderRadius: '8px', background: '#ff9d0014' }}>
//       <Row className="justify-content-center">
//         <Col md={12} lg={12}>
//           <div className="card shadow-lg border-0 rounded-lg">
//             <div className="card-body p-5">
//               <h3 className="text-center mb-4">Show vertical stock</h3>
//               <form onSubmit={handleSubmit}>
//                 <div style={{ overflowX: 'auto' }}>
//                   <Table bordered hover responsive style={{ minWidth: '1500px' }}>
//                     <thead>
//                       <tr className="text-white text-center">
//                         <th>Gate pass No</th>
//                         <th>Lot no</th>
//                         <th>Product Category ID</th>
//                         <th>Product ID</th>
//                         <th>Purchase Shade NO</th>
//                         <th>width</th>
//                         <th>Length</th>
//                         <th>Date</th>
//                         <th>Length</th>
//                         <th>Rack</th>
//                         <th>Length unit </th>
//                         <th>Width Unit</th>
//                         <th>Pcs</th>
//                         <th>Quantity</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {items.flatMap((item, itemIndex) =>
//                         Array.from({ length: item.pcs }).map((_, rowIndex) => (
//                           <tr key={`${itemIndex}-${rowIndex}`} className="text-center">
//                             <td>
//                               <Form.Control type="text" value={no || ''} disabled />
//                             </td>
//                             <td>
//                               <Form.Control type="text" value={item.product_category_id || ''} disabled />
//                             </td>
//                             <td>
//                               <Form.Control type="text" value={item.product_id || ''} disabled />
//                             </td>
//                             <td>
//                               <Form.Control type="text" value={item.purchase_shadeNo || ''} disabled />
//                             </td>
//                             <td>
//                               <Form.Control type="date" value={item.date || ''} disabled />
//                             </td>
//                             <td>
//                               <Form.Control type="text" value={item.lot_no || ''} disabled />
//                             </td>
//                             <td>
//                               <Form.Control type="number" value={item.width || ''} disabled />
//                             </td>
//                             <td>
//                               <Form.Control type="text" value={item.width_unit || ''} disabled />
//                             </td>
//                             <td>
//                               <Form.Control
//                                 type="number"
//                                 value={item.length || ''}
//                                 onChange={(e) => handleRowChange(itemIndex, 'length', e.target.value)}
//                               />
//                             </td>
//                             <td>
//                               <Form.Control type="text" value={item.length_unit || ''} disabled />
//                             </td>
//                             <td>
//                               <Form.Control type="number" value="1" disabled />
//                             </td>
//                             <td>
//                               <Form.Control type="number" value={item.quantity || ''} disabled />
//                             </td>
//                             <td>
//                               <Form.Control
//                                 type="text"
//                                 value={item.rack || ''}
//                                 onChange={(e) => handleRowChange(itemIndex, 'rack', e.target.value)}
//                               />
//                             </td>
//                           </tr>
//                         ))
//                       )}
//                     </tbody>
//                   </Table>
//                 </div>
//                 <Button
//                   variant="primary"
//                   type="submit"
//                   className="mt-5 d-block m-auto"
//                   style={{ backgroundColor: '#3f4d67', borderColor: '#3f4d67', width: '10rem' }}
//                 >
//                   <FaUserPlus className="me-2" /> Add Stock
//                 </Button>
//               </form>
//             </div>
//           </div>
//         </Col>
//       </Row>
//     </Container>
//   );
// };

// export default AddProduct;

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Table, Form, Button, Container, Row, Col } from 'react-bootstrap';
import { FaUserPlus } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';

const AddProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [godownStocks, setGodownStocks] = useState([]);

  useEffect(() => {
    const fetchGodownStocks = async () => {
      try {
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
        if (!API_BASE_URL) {
          console.error('API_BASE_URL is not defined');
          return;
        }
        const response = await axios.get(`${API_BASE_URL}/api/godownverticalstock/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (!response.data || !response.data.data) {
          throw new Error('Invalid API response format');
        }
        setGodownStocks([response.data.data]);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Error fetching godown stocks');
        console.error('Fetch Error:', error);
      }
    };
    fetchGodownStocks();
  }, [id]);

  const handleRowChange = (index, field, value) => {
    setGodownStocks((prevStocks) => {
      const updatedStocks = [...prevStocks];
      updatedStocks[index] = { ...updatedStocks[index], [field]: value };
      return updatedStocks;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = godownStocks.map((item) => ({
        gate_pass_id: item.gate_pass_id,
        stock_in_id: item.stock_in_id || '',
        gate_pass_no: item.gate_pass_no,
        gate_pass_date: item.gate_pass_date,
        date: item.date || new Date().toISOString().split('T')[0],
        product_id: item.product_id,
        lot_no: item.lot_no,
        length: parseFloat(item.length) || 0,
        length_unit: item.length_unit,
        type:'data',
        rack: item.rack
      }));

      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/godownverticalstock/${id}`, payload[0], {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      toast.success('Godown Vertical Stock Updated');
      navigate('/vertical_stock');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error updating stock');
      console.error(error);
    }
  };

  return (
    <Container fluid className="pt-4 px-2" style={{ border: '3px dashed #14ab7f', borderRadius: '8px', background: '#ff9d0014' }}>
      <Row className="justify-content-center">
        <Col md={12} lg={12}>
          <div className="card shadow-lg border-0 rounded-lg">
            <div className="card-body p-5">
              <h3 className="text-center mb-4">Show Vertical Stock</h3>
              <form onSubmit={handleSubmit}>
                <div style={{ overflowX: 'auto' }}>
                  <Table bordered hover responsive style={{ minWidth: '1500px' }}>
                    <thead>
                      <tr className="text-white text-center">
                        <th>Gate Pass No</th>
                        <th>Gate Pass Date</th>
                        <th>Stock Code</th>
                        <th>Product Category Name</th>
                        <th>Product Name</th>
                        <th>Lot No</th>
                        <th>Length</th>
                        <th>Length Unit</th>
                        <th>Rack</th>
                      </tr>
                    </thead>
                    <tbody>
                      {godownStocks.map((item, index) => (
                        <tr key={index} className="text-center">
                          <td>
                            <Form.Control type="text" value={item.gate_pass_no || ''} disabled />
                          </td>
                          <td>
                            <Form.Control type="text" value={item.gate_pass_date || ''} disabled />
                          </td>
                          <td>
                            <Form.Control type="text" value={item.stock_code || ''} disabled />
                          </td>
                          <td>
                            <Form.Control type="text" value={item.product_category_name || ''} disabled />
                          </td>
                          <td>
                            <Form.Control type="text" value={item.product_name || ''} disabled />
                          </td>
                          <td>
                            <Form.Control type="text" value={item.lot_no || ''} disabled />
                          </td>
                          <td>
                            <Form.Control
                              type="number"
                              value={item.length || ''}
                              onChange={(e) => handleRowChange(index, 'length', e.target.value)}
                            />
                          </td>
                          <td>
                            <Form.Control type="text" value={item.length_unit || ''} disabled />
                          </td>
                          <td>
                            <Form.Control
                              type="text"
                              value={item.rack || ''}
                              onChange={(e) => handleRowChange(index, 'rack', e.target.value)}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
                <Button
                  variant="primary"
                  type="submit"
                  className="mt-5 d-block m-auto"
                  style={{ backgroundColor: '#3f4d67', borderColor: '#3f4d67', width: '10rem' }}
                >
                  <FaUserPlus className="me-2" /> Update Stock
                </Button>
              </form>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default AddProduct;
