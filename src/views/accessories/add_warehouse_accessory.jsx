import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Form, Button, Container, Row, Col } from 'react-bootstrap';
import { FaPlus, FaTrash ,FaFileExcel, FaUpload, FaDownload,} from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';

const AddProduct = () => {
  const navigate = useNavigate();
  const [allProducts, setAllProducts] = useState([]);
  const mainColor = '#3f4d67';
  const [items, setItems] = useState([{
    product_accessory_id: '',
    lot_no: '',
    length: '',
    length_unit: '',
    items: '',
    box_bundle: '',
    quantity: '0'
  }]);

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/accessory`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setAllProducts(response.data.data);
      } catch (error) {
        console.error(error);
        toast.error('Failed to fetch products');
      }
    };
    fetchAllProducts();
  }, []);

  const handleAddRow = () => {
    setItems(prev => [...prev, {
      product_accessory_id: '',
      lot_no: '',
      length: '',
      length_unit: '',
      items: '',
      box_bundle: '',
      quantity: '0'
    }]);
  };

  const handleDeleteRow = (index) => {
    if (items.length > 1) {
      setItems(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleRowChange = (index, field, value) => {
    setItems(prev => {
      const updated = [...prev];
      updated[index][field] = value;
      if (field === 'items' || field === 'box_bundle') {
        const items = Number(updated[index].items) || 0;
        const boxBundle = Number(updated[index].box_bundle) || 0;
        updated[index].quantity = (items * boxBundle).toString();
      }
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = items.map(item => ({
      product_accessory_id: item.product_accessory_id,
      lot_no: item.lot_no,
      length: item.length,
      length_unit: item.length_unit,
      items: item.items,
      box_bundle: item.box_bundle,
      quantity: item.quantity
    }));
    console.log(payload);
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/warehouseAccessory`, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      toast.success('Stock added successfully');
      navigate('/warehouse_accessories');
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Error adding stock');
    }
  };
  const [file, setFile] = useState(null);
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
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/warehouseAccessory/import-file`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      if (response.status === 201) {
        toast.success('Stock added successfully');
        setFile(null);
        navigate('/shades');
      }
    } catch (error) {
      console.error(error);
      const errorMessage = error.response?.data?.error || 'Error adding stock';
      toast.error(errorMessage);
    }
  };

  return (
    <Container fluid className="pt-4 px-4" style={{ border: '3px dashed #14ab7f', borderRadius: '8px', background: '#ff9d0014' }}>
      <Row className="justify-content-center g-4">
        <h2 className="text-center mb-4 fw-bold">WareHouse Accessory</h2>

        <div
          className="card shadow-lg border-0 mb-4 mx-auto"
          style={{ borderRadius: '12px', maxWidth: '700px' }}
        >
          <div className="card-body p-4 mx-auto">
            <div className="d-flex flex-column align-items-center">
            <h4 className="text-center mb-4 fw-bold">Excel upload</h4>
              <form onSubmit={handleFileUpload} encType="multipart/form-data" className="w-100">
                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <label
                      htmlFor="excel"
                      className="form-label text-secondary fw-semibold"
                      style={{ fontSize: '0.95rem' }}
                    >
                      Choose File
                    </label>
                    <div className="d-flex align-items-center gap-2">
                      <FaFileExcel className="text-success fs-4" />
                      <a href="/products.csv" download className="text-decoration-none">
                        <FaDownload className="text-success fs-5" style={{ cursor: 'pointer' }} />
                      </a>
                    </div>
                  </div>

                  <div className="input-group">
                    <input
                      type="file"
                      className="form-control form-control-sm rounded-start"
                      name="excel"
                      id="excel"
                      onChange={handleFileChange}
                      style={{ fontSize: '0.9rem' }}
                    />
                    <button
                      type="submit"
                      className="btn btn-success d-flex align-items-center gap-2 px-3"
                      style={{ fontSize: '0.85rem' }}
                    >
                      <FaUpload />
                      Upload
                    </button>
                  </div>
                  <small className="form-text text-muted" style={{ fontSize: '0.8rem' }}>
                    Supported formats: <strong>.xls, .xlsx, .csv</strong>
                  </small>
                </div>
              </form>
            </div>
          </div>
        </div>
      <Col md={12}>
        <div className="card shadow border-0 rounded-lg">
          <div className="card-body p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4>
                <FaPlus className="me-2" />
                Add Manually
              </h4>
              <Button variant="success" onClick={handleAddRow}>Add Row</Button>
            </div>
            <Table bordered responsive className="align-middle">
              <thead className="text-white" style={{ backgroundColor: mainColor }}>
                <tr>
                  <th>Product</th>
                  <th>Lot No</th>
                  <th>Length</th>
                  <th>Length Unit</th>
                  <th>Items</th>
                  <th>Box/Bundle</th>
                  <th>Quantity</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <Form.Select
                        value={item.product_accessory_id}
                        onChange={(e) => handleRowChange(index, "product_accessory_id", e.target.value)}
                        required
                      >
                        <option value="">Select Product</option>
                        {allProducts.map((product) => (
                          <option key={product.id} value={product.id}>
                            {product.accessory_name}
                          </option>
                        ))}
                      </Form.Select>
                    </td>
                    <td>
                      <Form.Control
                        type="text"
                        value={item.lot_no}
                        onChange={(e) => handleRowChange(index, "lot_no", e.target.value)}
                      />
                    </td>
                    <td>
                      <Form.Control
                        type="number"
                        value={item.length}
                        onChange={(e) => handleRowChange(index, "length", e.target.value)}
                      />
                    </td>
                    <td>
                      <Form.Select
                        value={item.length_unit}
                        onChange={(e) => handleRowChange(index, "length_unit", e.target.value)}
                      >
                        <option value="">Unit</option>
                        <option value="meter">Meter</option>
                        <option value="feet">Feet</option>
                      </Form.Select>
                    </td>
                    <td>
                      <Form.Control
                        type="number"
                        value={item.items}
                        onChange={(e) => handleRowChange(index, "items", e.target.value)}
                      />
                    </td>
                    <td>
                      <Form.Control
                        type="number"
                        value={item.box_bundle}
                        onChange={(e) => handleRowChange(index, "box_bundle", e.target.value)}
                      />
                    </td>
                    <td>
                      <Form.Control
                        type="number"
                        value={item.quantity}
                        readOnly
                        disabled
                      />
                    </td>
                    <td>
                      <Button
                        variant="danger"
                        onClick={() => handleDeleteRow(index)}
                        disabled={items.length === 1}
                      >
                        <FaTrash />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            <div className="text-center mt-4">
              <Button
                type="submit"
                style={{ backgroundColor: mainColor, borderColor: mainColor }}
                size="lg"
                onClick={handleSubmit}
              >
                Submit Stock
              </Button>
            </div>
          </div>
        </div>
      </Col>
    </Row>
    </Container >
  );
};

export default AddProduct;