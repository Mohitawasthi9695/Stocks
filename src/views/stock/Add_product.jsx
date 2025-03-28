import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Table, Form, Button, Container, Row, Col } from 'react-bootstrap';
import { FaPlus, FaTrash, FaUserPlus, FaFileExcel, FaUpload, FaDownload } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';

const AddProduct = () => {
  const { id, no } = useParams();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const mainColor = '#3f4d67';
  const [items, setItems] = useState([
    {
      invoice_no: no,
      lot_no: '',
      product_category_id:'',
      product_id: '',
      purchase_shadeNo: '',
      width: '',
      length: '',
      date: '',
      rack: '',
<<<<<<< HEAD
=======
      warehouse: '',
>>>>>>> 13e947b6d0c72d6bcb6e252d5dae7e9a6bccfcea
      length_unit: '',
      width_unit: '',
      pcs: 1,
      quantity: 1
    }
  ]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/products/category`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        setCategories(response.data.data || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

<<<<<<< HEAD
  const handleCategoryChange = async (event, index) => {
=======
  const handleCategoryChange = (event, index) => {
>>>>>>> 13e947b6d0c72d6bcb6e252d5dae7e9a6bccfcea
    const categoryId = event.target.value;

    setItems((prevItems) => {
      const updatedItems = [...prevItems];
      updatedItems[index].product_category_id = categoryId;
      updatedItems[index].product_id = '';
      updatedItems[index].purchase_shadeNo = '';
      return updatedItems;
    });

    setItems((prevItems) => {
      const updatedItems = [...prevItems];
      updatedItems[index].product_category_id = categoryId;
      updatedItems[index].product_id = ''; // Reset product selection
      return updatedItems;
    });

    if (categoryId) {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/productshadeno/${categoryId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });

        // Update only the products list for the specific row
        setItems((prevItems) => {
          const updatedItems = [...prevItems];
          updatedItems[index].products = response.data.data;
          return updatedItems;
        });
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    }
  };

  const fetchAllProducts = async (categoryId) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/productshadeno/${categoryId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setAllProducts(response.data.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    if (selectedCategoryId) {
      fetchAllProducts(selectedCategoryId);
    }
  }, [selectedCategoryId]);

  const handleAddRow = () => {
    setItems((prevItems) => [
      ...prevItems,
      {
        invoice_no: no,
        lot_no: '',
        product_category_id: '',
        product_id: '',
        purchase_shadeNo: '',
        width: '',
        length: '',
        date: '',
        rack: '',
        length_unit: '',
        width_unit: '',
        pcs: 1,
        quantity: 1
      }
    ]);
  };

  const handleDeleteRow = (index) => {
    setItems((prevItems) => prevItems.filter((_, i) => i !== index));
  };

  // Handle changes to row fields
  const handleRowChange = (index, field, value) => {
    setItems((prevItems) => {
      const updatedItems = [...prevItems];
      if (field === 'product_id') {
        const selectedProduct = updatedItems[index].products.find((product) => product.id === parseInt(value));
        updatedItems[index].product_id = value;
        updatedItems[index].purchase_shadeNo = selectedProduct ? selectedProduct.purchase_shade_no : '';
      } else {
        updatedItems[index][field] = value;
      }
      return updatedItems;
    });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const fileExtension = selectedFile.name.split('.').pop().toLowerCase();
      if (!['xls', 'xlsx', 'csv'].includes(fileExtension)) {
        toast.error('Unsupported file format. Please upload an .xls or .xlsx file.');
        setFile(null);
      } else {
        setFile(selectedFile);
      }
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      toast.error('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('csv_file', file);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/stocks/import-csv`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      if (response.status === 201) {
        toast.success('Stock added successfully');
        setFile(null);
        navigate('/stocks');
      }
    } catch (error) {
      console.error(error);
      const errorMessage = error.response?.data?.error || 'Error adding stock';
      toast.error(errorMessage);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = items.map((item) => ({
      ...item,
      invoice_id: id,
      invoice_no: no
    }));

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/stocks`, payload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      toast.success('Stock added successfully');
      navigate('/stocks');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error adding stock';
      toast.error(errorMessage);
      console.error(error);
    }
  };

  const handleDownloadExcel = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/stocks/download-excel`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'stocks.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading the file:', error);
      toast.error('Error downloading the file');
    }
  };

  // handle date
  const handleDateChange = (event, index) => {
    const newDate = event.target.value;
    setItems((prevItems) => {
      const updatedItems = [...prevItems];
      updatedItems[index].date = newDate; // Update the date field
      return updatedItems;
    });
  };

  return (
    <Container fluid className="pt-4 px-2" style={{ border: '3px dashed #14ab7f', borderRadius: '8px', background: '#ff9d0014' }}>
      <Row className="justify-content-center">
        <Col md={12} lg={12} className="position-relative">
          <h2 className="text-center mb-4">Invoice Items</h2>
          <div className="card shadow border-0 rounded-lg mb-4" style={{ borderRadius: '10px', marginInline: '10rem' }}>
            <div className="card-body p-4" style={{ borderRadius: '8px' }}>
              <div className="d-flex flex-column align-items-center">
                <form onSubmit={handleFileUpload} encType="multipart/form-data">
                  <div className="mb-3 w-100">
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <div>
                        <label htmlFor="excel" className="form-label text-secondary" style={{ fontSize: '0.9rem' }}>
                          Choose file
                        </label>
                      </div>
                      <div>
                        <h4 className="text-center mb-4 d-flex align-items-center gap-2">
                          <FaFileExcel />
                          <a href="/StockIN.csv" download>
                            <FaDownload className="text-success" style={{ cursor: 'pointer' }} />
                          </a>
                        </h4>
                      </div>
                    </div>
                    <div className="input-group">
                      <input
                        type="file"
                        className="form-control form-control-sm"
                        name="excel"
                        id="excel"
                        onChange={handleFileChange}
                        style={{ fontSize: '0.9rem' }}
                      />
                      <button
                        type="submit"
                        className="btn btn-success d-flex align-items-center gap-2"
                        style={{ fontSize: '0.85rem', padding: '0.3rem 0.6rem' }}
                      >
                        <FaUpload />
                        Upload
                      </button>
                    </div>
                    <small className="form-text text-muted" style={{ fontSize: '0.8rem' }}>
                      Supported formats: .xls, .xlsx
                    </small>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </Col>
        <h4 className="text-center font-weight-bold">or</h4>
        <Col md={12} lg={12} className="absolute mt-3">
          <div className="card shadow-lg border-0 rounded-lg" style={{ borderRadius: '10px' }}>
            <div className="card-body p-5" style={{ borderRadius: '8px' }}>
              <h3 className="text-center mb-4 gap-2">Add Manually</h3>
              <Button variant="success" onClick={handleAddRow} className="px-1 py-1 ms-auto d-block">
                <FaPlus /> Add Item
              </Button>
              <form onSubmit={handleSubmit}>
                <div style={{ overflowX: 'auto' }}>
                  <Table bordered hover responsive style={{ minWidth: '1500px' }}>
                    <thead>
                      <tr className="text-white text-center">
                        <th style={{ width: '150px' }}>Invoice No</th>
                        <th style={{ width: '150px' }}>ProductName</th>
                        <th style={{ width: '200px' }}>Shade No</th>
                        <th style={{ width: '120px' }}>Pur. Shade No</th>
                        <th style={{ width: '150px' }}>Date</th>
                        <th style={{ width: '150px' }}>LOT No</th>
                        <th style={{ width: '150px' }}>Width</th>
                        <th style={{ width: '150px' }}>Unit</th>
                        <th style={{ width: '150px' }}>Length</th>
                        <th style={{ width: '150px' }}>Unit</th>
                        <th style={{ width: '120px' }}>Pcs</th>
                        <th style={{ width: '150px' }}>Quantity</th>
<<<<<<< HEAD
=======
                        <th style={{ width: '120px' }}>Type</th>
                        <th style={{ width: '190px' }}>Warehouse</th>
>>>>>>> 13e947b6d0c72d6bcb6e252d5dae7e9a6bccfcea
                        <th style={{ width: '120px' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item, index) => (
                        <tr key={index} className="text-center">
                          <td>
                            <Form.Control type="text" value={no} disabled style={{ fontSize: '0.9rem', height: '3rem' }} />
                          </td>
                          <td>
                            <Form.Control
                              as="select"
                              value={item.product_category_id}
                              className="form-select px-2"
                              style={{ width: '8rem', color: 'black' }}
                              onChange={(e) => handleCategoryChange(e, index)}
                            >
                              <option value="">Select</option>
                              {categories.map((category) => (
                                <option key={category.id} value={category.id} style={{ color: 'black' }}>
                                  {category.product_category}
                                </option>
                              ))}
                            </Form.Control>
                          </td>
                          <td>
                            <Form.Control
                              as="select"
                              value={item.product_id}
                              onChange={(e) => handleRowChange(index, 'product_id', e.target.value)}
                              style={{ fontSize: '0.9rem', height: '3rem' }}
                            >
                              <option value="">Select Shade No.</option>
                              {item.products?.map((product) => (
                                <option key={product.id} value={product.id}>
                                  {product.shadeNo}
                                </option>
                              ))}
                            </Form.Control>
                          </td>
                          <td>
                            <Form.Control
                              type="text"
                              value={item.purchase_shadeNo}
                              disabled
                              style={{ fontSize: '0.9rem', height: '3rem' }}
                            />
                          </td>
                          <td>
                            <Form.Control
                              type="date"
                              value={item.date}
                              className="form-control px-2"
                              style={{ width: '8rem', color: 'black' }}
                              onChange={(e) => handleDateChange(e, index)} // Add this function
                            />
                          </td>
                          <td>
                            <Form.Control
                              type="text"
                              value={item.lot_no}
                              onChange={(e) => handleRowChange(index, 'lot_no', e.target.value)}
                              style={{ fontSize: '0.9rem', height: '3rem' }}
                            />
                          </td>
                          <td>
                            <Form.Control
                              type="number"
                              value={item.width}
                              onChange={(e) => handleRowChange(index, 'width', e.target.value)}
                              style={{ fontSize: '0.9rem', height: '3rem' }}
                            />
                          </td>
                          <td>
                            <Form.Control
                              as="select"
                              value={item.width_unit}
                              onChange={(e) => handleRowChange(index, 'width_unit', e.target.value)}
                              style={{ fontSize: '0.9rem', height: '3rem' }}
                            >
                              <option value="">Select Unit</option>
                              <option value="meter">Meter</option>
                              <option value="inches">Inch</option>
                              <option value="feet">Feet</option>
                              <option value="mm">MM</option>
                            </Form.Control>
                          </td>
                          <td>
                            <Form.Control
                              type="number"
                              value={item.length}
                              onChange={(e) => handleRowChange(index, 'length', e.target.value)}
                              style={{ fontSize: '0.9rem', height: '3rem' }}
                            />
                          </td>
                          <td>
                            <Form.Control
                              as="select"
                              value={item.length_unit}
                              onChange={(e) => handleRowChange(index, 'length_unit', e.target.value)}
                              style={{ fontSize: '0.9rem', height: '3rem' }}
                            >
                              <option value="">Select Unit</option>
                              <option value="meter">Meter</option>
                              <option value="inches">Inch</option>
                              <option value="feet">Feet</option>
                            </Form.Control>
                          </td>
                          <td>
                            <Form.Control
                              type="number"
                              value={item.pcs}
                              onChange={(e) => handleRowChange(index, 'pcs', e.target.value)}
                              style={{ fontSize: '0.9rem', height: '3rem' }}
                            />
                          </td>
                          <td>
                            <Form.Control
                              type="number"
                              value={item.quantity}
                              onChange={(e) => handleRowChange(index, 'quantity', e.target.value)}
                              style={{ fontSize: '0.9rem', height: '3rem' }}
                            />
                          </td>
                          <td>
<<<<<<< HEAD
=======
                            <Form.Control
                              as="select"
                              value={item.type}
                              onChange={(e) => handleRowChange(index, 'type', e.target.value)}
                              style={{ fontSize: '0.9rem', height: '3rem' }}
                            >
                              <option value="">Select Type</option>
                              <option value="roll">Roll</option>
                              <option value="box">Box</option>
                            </Form.Control>
                          </td>
                          <td>
                            <Form.Control
                              as="select"
                              value={item.warehouse}
                              onChange={(e) => handleRowChange(index, 'warehouse', e.target.value)}
                              style={{ fontSize: '0.9rem', height: '3rem' }}
                            >
                              <option value="">Select Warehouse</option>
                              <option value="Dwarka">Dwarka</option>
                              <option value="Gujarat">Gujarat</option>
                            </Form.Control>
                          </td>

                          <td>
>>>>>>> 13e947b6d0c72d6bcb6e252d5dae7e9a6bccfcea
                            <Button variant="danger" onClick={() => handleDeleteRow(index)} style={{ fontSize: '0.8rem', height: '2rem' }}>
                              <FaTrash />
                            </Button>
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
                  style={{
                    backgroundColor: mainColor,
                    borderColor: mainColor,
                    width: '10rem'
                  }}
                >
                  <FaUserPlus className="me-2" /> Add Stock
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