import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Table, Form, Button, Container, Row, Col } from 'react-bootstrap';
import { FaPlus, FaTrash, FaUserPlus, FaFileExcel, FaUpload, FaDownload } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';

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
      lot_no: '',
      product_category_id: '',
      product_id: '',
      purchase_shadeNo: '',
      width: '',
      length: '',
      date: '',
      rack: '',
      remark: '',
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

  const handleCategoryChange = async (event, index) => {
    const categoryId = event.target.value;

    setItems((prevItems) => {
      const updatedItems = [...prevItems];
      updatedItems[index].product_category_id = categoryId;
      updatedItems[index].product_id = '';
      updatedItems[index].purchase_shadeNo = '';
      return updatedItems;
    });

    if (categoryId) {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/productshadeno/${categoryId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });

        setItems((prevItems) => {
          const updatedItems = [...prevItems];
          updatedItems[index] = {
            ...updatedItems[index],
            product_category_id: categoryId,
            product_id: '',
            purchase_shadeNo: '',
            products: [...response.data.data],
          };

          console.log("Updated Products in State:", updatedItems[index].products);
          return updatedItems;
        });

      } catch (error) {
        console.error('Error fetching products:', error);
      }
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
        lot_no: '',
        product_category_id: '',
        product_id: '',
        purchase_shadeNo: '',
        width: '',
        length: '',
        date: '',
        rack: '',
        remark: '',
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

  const handleRowChange = (index, field, value) => {
    setItems((prevItems) => {
      const updatedItems = [...prevItems];

      if (field === 'product_id') {
        const selectedProduct = updatedItems[index].products.find(
          (product) => product.id === parseInt(value)
        );
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

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to submit the form?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, submit it!'
    });

    const payload = items.map((item) => ({
      ...item,
      invoice_id: id,
      invoice_no: no
    }));

    if (result.isConfirmed) {
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
    }

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
        <Col md={12} lg={12} className="position-relative mt-2">
          <div className="card shadow-lg border-0 rounded-lg">
            <div className="card-body p-3">
              <h3 className="text-center mb-3 fs-5">Add Manually</h3>
              <Button variant="success" onClick={handleAddRow} className="px-1 py-1 ms-auto d-block mb-2" size="sm">
                <FaPlus size={12} /> Add Item
              </Button>
              <form onSubmit={handleSubmit}>
                <div className="table-responsive">
                  <Table bordered hover responsive className="table-sm" style={{ fontSize: '0.85rem' }}>
                    <thead>
                      <tr className="text-white text-center">
                        <th>Product</th>
                        <th>Shade No/Purchase</th>
                        <th>Date</th>
                        <th>LOT No</th>
                        <th>Width </th>
                        <th>Length</th>
                        <th>Pcs</th>
                        <th>Qty</th>
                        <th>Remark</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item, index) => (
                        <tr key={index} className="text-center">
                          <td className="p-1">
                            <Form.Control
                              as="select"
                              value={item.product_category_id}
                              className="form-select py-1 px-1"
                              style={{ width: '6.5rem', fontSize: '0.8rem' }}
                              onChange={(e) => handleCategoryChange(e, index)}
                            >
                              <option value="">Select</option>
                              {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                  {category.product_category}
                                </option>
                              ))}
                            </Form.Control>
                          </td>
                          <td className="p-1">
                            <Form.Control
                              as="select"
                              value={item.product_id}
                              onChange={(e) => handleRowChange(index, 'product_id', e.target.value)}
                              className="py-1 px-1"
                              style={{ fontSize: '0.8rem', width: '9rem' }}
                            >
                              <option value="">Select</option>
                              {item.products?.map((product) => (
                                <option key={product.id} value={product.id}>
                                  {product.shadeNo} / {product.purchase_shade_no}
                                </option>
                              ))}
                            </Form.Control>
                          </td>
                          <td className="p-1">
                            <Form.Control
                              type="date"
                              value={item.date}
                              className="py-1 px-1"
                              style={{ fontSize: '1rem', width: '9rem' }}
                              onChange={(e) => handleDateChange(e, index)}
                            />
                          </td>
                          <td className="p-1">
                            <Form.Control
                              type="text"
                              value={item.lot_no}
                              onChange={(e) => handleRowChange(index, 'lot_no', e.target.value)}
                              className="py-1 px-1"
                              style={{ fontSize: '1rem', width: '7rem' }}
                            />
                          </td>
                          <td className="p-1">
                            <div className="d-flex gap-1">
                              <Form.Control
                                type="number"
                                value={item.width}
                                onChange={(e) => handleRowChange(index, 'width', e.target.value)}
                                className="py-1 px-1"
                                style={{ fontSize: '1rem', width: '5rem' }}
                              />
                              <Form.Control
                                as="select"
                                value={item.width_unit}
                                onChange={(e) => handleRowChange(index, 'width_unit', e.target.value)}
                                className="py-1 px-1"
                                style={{ fontSize: '1rem', width: '3rem' }}
                              >
                                <option value="">Unit</option>
                                <option selected value="m">m</option>
                                <option value="in">in</option>
                                <option value="ft">ft</option>
                              </Form.Control>
                            </div>
                          </td>
                          <td className="p-1">
                            <div className="d-flex gap-1">
                              <Form.Control
                                type="number"
                                value={item.length}
                                onChange={(e) => handleRowChange(index, 'length', e.target.value)}
                                className="py-1 px-1"
                                style={{ fontSize: '1rem', width: '5rem' }}
                              />
                              <Form.Control
                                as="select"
                                value={item.length_unit}
                                onChange={(e) => handleRowChange(index, 'length_unit', e.target.value)}
                                className="py-1 px-1"
                                style={{ fontSize: '1rem', width: '3rem' }}
                              >
                                <option value="">Unit</option>
                                <option selected value="m">m</option>
                                <option value="in">in</option>
                                <option value="ft">ft</option>
                              </Form.Control>
                            </div>
                          </td>
                          <td className="p-1">
                            <Form.Control
                              type="number"
                              value={item.pcs}
                              onChange={(e) => handleRowChange(index, 'pcs', e.target.value)}
                              className="py-1 px-1"
                              style={{ fontSize: '1rem', width: '4rem' }}
                            />
                          </td>
                          <td className="p-1">
                            <Form.Control
                              type="number"
                              value={item.quantity}
                              onChange={(e) => handleRowChange(index, 'quantity', e.target.value)}
                              className="py-1 px-1"
                              style={{ fontSize: '1rem', width: '4rem' }}
                            />
                          </td>
                          <td className="p-1">
                            <Form.Control
                              type="text"
                              value={item.remark}
                              onChange={(e) => handleRowChange(index, 'remark', e.target.value)}
                              className="py-1 px-1"
                              style={{ fontSize: '1rem', width: '5rem' }}
                            />
                          </td>
                          <td className="p-1">
                            <Button
                              variant="danger"
                              onClick={() => handleDeleteRow(index)}
                              size="sm"
                              className="py-1 px-2"
                            >
                              <FaTrash size={12} />
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
                  className="mt-3 d-block mx-auto"
                  size="sm"
                  style={{
                    backgroundColor: mainColor,
                    borderColor: mainColor,
                    width: '8rem'
                  }}
                >
                  <FaUserPlus className="me-1" size={12} /> Add Stock
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
