import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Button, Modal, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MdEdit, MdDelete, MdPersonAdd } from 'react-icons/md';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import 'react-loading-skeleton/dist/skeleton.css';

import Papa from 'papaparse';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { FaFileCsv } from 'react-icons/fa';
import { AiOutlineFilePdf } from 'react-icons/ai';

const WarehouseAccessoriesPage = () => {
  const [accessories, setAccessories] = useState([]);
  const [filteredAccessories, setFilteredAccessories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAccessory, setSelectedAccessory] = useState(null);

  useEffect(() => {
    const fetchAccessories = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/warehouse/accessory`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        console.log(response.data.data);
        setAccessories(response.data.data);
        setFilteredAccessories(response.data.data);
      } catch (error) {
        console.error(error);
        toast.error('Failed to fetch accessories.');
      }
    };
    fetchAccessories();
  }, []);

  useEffect(() => {
    const filtered = accessories.filter((accessory) =>
      Object.values(accessory).some((value) =>
        value ? value.toString().toLowerCase().includes(searchQuery.toLowerCase()) : false
      )
    );
    setFilteredAccessories(filtered);
  }, [searchQuery, accessories]);

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
      name: 'Product Category',
      selector: (row) => row.product_category,
      sortable: true
    },
    {
      name: 'Product Accessory',
      selector: (row) => row.product_accessory_name,
      sortable: true
    },
    { name: "Length", selector: (row) => `${row.out_length}  ${row.length_unit}`, sortable: true },
    {
      name: 'Items',
      selector: (row) => row.items,
      sortable: true
    },
    {
      name: 'Box/Bundle',
      selector: (row) => row.box_bundle,
      sortable: true
    },
    {
      name: 'Quantity',
      selector: (row) => row.quantity,
      sortable: true
    },
    {
      name: 'Out Quantity',
      selector: (row) => row.out_quantity,
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

  const handleDelete = async (accessoryId) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      });

      if (result.isConfirmed) {
        const response = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/warehouse/accessory/${accessoryId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.status === 200) {
          setAccessories((prev) => prev.filter((item) => item.id !== accessoryId));
          setFilteredAccessories((prev) => prev.filter((item) => item.id !== accessoryId));
          toast.success('Accessory deleted successfully');
          Swal.fire('Deleted!', 'The accessory has been deleted.', 'success');
        } else {
          toast.error('Failed to delete accessory.');
        }
      }
    } catch (error) {
      toast.error('Failed to delete accessory.');
      console.error(error);
    }
  };

  const handleEdit = (accessory) => {
    setSelectedAccessory(accessory);
    setShowEditModal(true);
  };

  const handleUpdateAccessory = async () => {
    try {
      const response = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/warehouse/accessory/${selectedAccessory.id}`, selectedAccessory, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200) {
        toast.success('Accessory updated successfully!');
        setAccessories((prev) => prev.map((item) => (item.id === selectedAccessory.id ? selectedAccessory : item)));
        setFilteredAccessories((prev) => prev.map((item) => (item.id === selectedAccessory.id ? selectedAccessory : item)));
        setShowEditModal(false);
      } else {
        toast.error('Failed to update accessory.');
      }
    } catch (error) {
      console.error('Error during update:', error);
      toast.error('Failed to update accessory.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedAccessory((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const customStyles = {
    header: {
      style: {
        backgroundColor: '#2E8B57',
        color: '#fff',
        fontSize: '18px',
        fontWeight: 'bold',
        padding: '15px',
        borderRadius: '8px 8px 8px 8px',
      },
    },
    rows: {
      style: {
        backgroundColor: '#f0fff4',
        borderBottom: '1px solid #e0e0e0',
        transition: 'background-color 0.3s ease',
        '&:hover': {
          backgroundColor: '#e6f4ea',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        },
      },
    },
    headCells: {
      style: {
        backgroundColor: '#20B2AA',
        color: '#fff',
        fontSize: '12px',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        padding: '15px',
      },
    },
    cells: {
      style: {
        fontSize: '14px',
        color: '#333',
        padding: '12px',
      },
    },
    pagination: {
      style: {
        backgroundColor: '#3f4d67',
        color: '#fff',
        borderRadius: '0 0 8px 8px',
      },
      pageButtonsStyle: {
        backgroundColor: 'transparent',
        color: '#fff',
        '&:hover': {
          backgroundColor: 'rgba(255,255,255,0.2)',
        },
      },
    },
  };

  return (
    <div className="container-fluid pt-4" style={{ border: '3px dashed #14ab7f', borderRadius: '8px', background: '#ff9d0014' }}>
      <div className="row mb-3">
        <div className="col-md-4">
          <label htmlFor="search" className='me-2'>Search: </label>
          <input
            type="text"
            placeholder="Search accessories"
            id="search"
            value={searchQuery}
            onChange={handleSearch}
            className="pe-5 ps-2 py-2"
            style={{ borderRadius: '5px' }}
          />
        </div>
        <div className="col-md-8 text-end">
          <Button variant="primary" onClick={() => navigate('/add_warehouse_accessory')}>
            <MdPersonAdd className="me-2" /> Add Warehouse Accessory
          </Button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredAccessories}
        pagination
        highlightOnHover
        striped
        responsive
        customStyles={customStyles}
      />

      {showEditModal && (
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Edit Warehouse Accessory</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Product Accessory ID</Form.Label>
                <Form.Control
                  type="text"
                  name="product_accessory_id"
                  value={selectedAccessory?.product_accessory_id || ''}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Length</Form.Label>
                <Form.Control
                  type="number"
                  name="length"
                  value={selectedAccessory?.length || ''}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Unit</Form.Label>
                <Form.Control
                  type="text"
                  name="unit"
                  value={selectedAccessory?.unit || ''}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Items</Form.Label>
                <Form.Control
                  type="number"
                  name="items"
                  value={selectedAccessory?.items || ''}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Box</Form.Label>
                <Form.Control
                  type="number"
                  name="box"
                  value={selectedAccessory?.box || ''}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Quantity</Form.Label>
                <Form.Control
                  type="number"
                  name="quantity"
                  value={selectedAccessory?.quantity || ''}
                  onChange={handleChange}
                />
              </Form.Group>

              <div className="d-flex justify-content-end">
                <Button variant="primary" onClick={handleUpdateAccessory}>Save Changes</Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
};

export default WarehouseAccessoriesPage;
