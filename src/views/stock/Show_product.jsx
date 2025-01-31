import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Button, Modal, Form } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { MdEdit, MdDelete, MdPersonAdd } from 'react-icons/md';
import { toast } from 'react-toastify';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import DataTableExtensions from 'react-data-table-component-extensions';
import Swal from 'sweetalert2';

const Show_product = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]); // For search
  const [searchQuery, setSearchQuery] = useState(''); // Search query
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/stocks/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        const productsWithArea = response.data.filter((product) => (product.quantity) > 0).map((product) => {
          const areaM2 = product.length * product.width * product.quantity;
          const areaSqFt = areaM2 * 10.7639;
          return {
            ...product,
            area: areaM2.toFixed(3), 
            area_sq_ft: areaSqFt.toFixed(3), 
          };
        });
        setProducts(productsWithArea);
        setFilteredProducts(productsWithArea);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false); // Stop loading
      }
    };
    fetchProductData();
  }, [id]);

  // Update filtered Products when the search query changes
  useEffect(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = products.filter(
      (product) =>
        product.width.toLowerCase().includes(lowercasedQuery) ||
        product.length.toLowerCase().includes(lowercasedQuery) ||
        product.invoice_no.toLowerCase().includes(lowercasedQuery) ||
        product.lot_no.toString().toLowerCase().includes(lowercasedQuery)
    );
    setFilteredProducts(filtered);
  }, [searchQuery, products]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const navigate = useNavigate();

  const columns = [
    {
      name: 'Sr No',
      selector: (_, index) => index + 1,
      sortable: true
    },
    {
      name: 'Lot No',
      selector: (row) => row.lot_no,
      sortable: true
    },
    {
      name: 'Invoice no',
      selector: (row) => row.stock_invoice.invoice_no,
      sortable: true
    },
    {
      name: 'Shade no',
      selector: (row) => row.stock_product.shadeNo,
      sortable: true
    },
    {
      name: 'Pur. Shade no',
      selector: (row) => row.stock_product.purchase_shade_no,
      sortable: true
    },
    {
      name: 'type',
      selector: (row) => row.type,
      sortable: true
    },
    {
      name: 'Length',
      selector: (row) => row.length,
      sortable: true
    },
    {
      name: 'width',
      selector: (row) => row.width,
      sortable: true
    },
    {
      name: 'Unit',
      selector: (row) => row.unit,
      sortable: true
    },
    {
      name: 'Quantity',
      selector: (row) => row.quantity,
      sortable: true
    },
    {
      name: 'Out Quantity',
      selector: (row) => row.out_quantity ?? 0,
      sortable: true,
    },
    {
      name: 'Avaible Quantity',
      selector: (row) => row.quantity - row.out_quantity,
      sortable: true,
    },
    {
      name: 'Area(m.sq.)',
      selector: (row) => row.area,
      sortable: true
    },
    {
      name: 'Area(sq.ft.)',
      selector: (row) => row.area_sq_ft,
      sortable: true
    },
    {
      name: 'Rack No',
      selector: (row) => row.rack,
      sortable: true
    },
    {
      name: 'Warehouse',
      selector: (row) => row.warehouse,
      sortable: true
    },
    {
      name: 'Action',
      cell: (row) => (
        <div className="d-flex">
          <Button variant="outline-success" size="sm" className="me-2" onClick={() => handleEdit(row)}>
            <MdEdit />
          </Button>
          <Button variant="outline-danger" size="sm" onClick={() => handleDelete(row.id)}>
            <MdDelete />
          </Button>
        </div>
      )
    }
  ];
  const handleEdit = (product) => {
    setSelectedProduct(product);
    setShowEditModal(true);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };
  const handleUpdateProduct = async () => {
    try {
      console.log(selectedProduct);
      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/stocks/${selectedProduct.id}`,
        selectedProduct,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      console.log(response.data)
      setProducts((prevProducts) =>
        prevProducts.map((products) =>
          products.id === selectedProduct.id ? selectedProduct : products
        )
      );
      toast.success('Product updated successfully!');
      setShowEditModal(false);
    } catch (error) {
      toast.error('Error updating Product!');
    }
  };

  const handleDelete = async (productId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });
  
    if (!result.isConfirmed) {
      return; // Exit if user cancels
    }
  
    try {
      const response = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/stocks/${productId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      console.log(response.data);
      toast.success('Product deleted successfully');
      setProducts((prev) => prev.filter((product) => product.id !== productId));
      setFilteredProducts((prev) => prev.filter((product) => product.id !== productId));
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete Product');
    }
  };
  
  const customStyles = {
    header: {
      style: {
        backgroundColor: '#2E8B57',
        color: '#fff',
        fontSize: '18px',
        fontWeight: 'bold',
        padding: '15px',
        borderRadius: '8px 8px 8px 8px'
      }
    },
    rows: {
      style: {
        backgroundColor: '#f0fff4',
        borderBottom: '1px solid #e0e0e0',
        transition: 'background-color 0.3s ease',
        '&:hover': {
          backgroundColor: '#e6f4ea',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }
      }
    },
    headCells: {
      style: {
        backgroundColor: '#20B2AA',
        color: '#fff',
        fontSize: '12px',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        padding: '15px'
      }
    },
    cells: {
      style: {
        fontSize: '14px',
        color: '#333',
        padding: '12px'
      }
    },
    footer: {
      style: {
        fontWeight: 'bold',
        textAlign: 'right'
      }
    },
    pagination: {
      style: {
        backgroundColor: '#3f4d67',
        color: '#fff',
        borderRadius: '0 0 8px 8px'
      },
      pageButtonsStyle: {
        backgroundColor: 'transparent',
        color: '#fff',
        '&:hover': {
          backgroundColor: 'rgba(255,255,255,0.2)'
        }
      }
    }
  };
  
  const totalArea = filteredProducts.reduce((acc, product) => acc + (Number(product.area) || 0), 0);
  const totalAreaSqFt = filteredProducts.reduce((acc, product) => acc + (Number(product.area_sq_ft) || 0), 0);

  return (
    <div className="container-fluid pt-4 " style={{ border: '3px dashed #14ab7f', borderRadius: '8px', background: '#ff9d0014' }}>
      <div className="row mb-3">
        <div className="col-md-4">
          <input
            type="text"
            placeholder="Search..."
            id="search"
            value={searchQuery}
            onChange={handleSearch}
            className="pe-5 ps-2 py-2"
            style={{ borderRadius: '5px' }}
          />
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <div className="card shadow-lg border-0 rounded-lg">
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
                <DataTable
                  columns={columns}
                  data={filteredProducts}
                  pagination
                  highlightOnHover
                  striped
                  responsive
                  customStyles={customStyles}
                  defaultSortFieldId={1}
                />
                <div className="d-flex justify-content-between p-3 bg-light border-top">
                  <span>Total Area (m.sq.): {totalArea.toFixed(2)}</span>
                  <span>Total Area (sq.ft.): {totalAreaSqFt.toFixed(2)}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Edit Product Modal */}
<Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
  <Modal.Header closeButton>
    <Modal.Title>Edit Product</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Form>
      <Form.Group className="mb-3">
        <Form.Label>Lot Number</Form.Label>
        <Form.Control
          type="text"
          name="lot_no"
          value={selectedProduct?.lot_no || ''}
          onChange={handleChange}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Length</Form.Label>
        <Form.Control
          type="number"
          step="0.01"
          name="length"
          value={selectedProduct?.length || ''}
          onChange={handleChange}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Width</Form.Label>
        <Form.Control
          type="number"
          step="0.01"
          name="width"
          value={selectedProduct?.width || ''}
          onChange={handleChange}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Unit</Form.Label>
        <Form.Control
          type="read-only"
          name="unit"
          value={selectedProduct?.unit || ''}
          disabled={true}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Type</Form.Label>
        <Form.Control
          type="text"
          name="type"
          value={selectedProduct?.type || ''}
          onChange={handleChange}
          
        />
      </Form.Group>
    </Form>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowEditModal(false)}>
      Close
    </Button>
    <Button variant="primary" onClick={handleUpdateProduct}>
      Save Changes
    </Button>
  </Modal.Footer>
</Modal>

    </div>
    
  );
};

export default Show_product;
