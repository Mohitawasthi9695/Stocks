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
import { FaPlus, FaTrash, FaUserPlus, FaFileExcel, FaUpload, FaDownload } from 'react-icons/fa';

const SuppliersPage = () => {
  const [suppliers, setSupplier] = useState([]);
  const [filteredSuppliers, setFilteredSupplier] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedSupplier, setselectedSupplier] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const fetchSupplier = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/accessory`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        console.log("Fetched Suppliers:", response.data.data);
        setSupplier(response.data.data);
        setFilteredSupplier(response.data.data);
      } catch (error) {
        console.error("Error fetching suppliers:", error);
        toast.error("Failed to load accessories.");
      }
    };
    fetchSupplier();
  }, []);

  useEffect(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = suppliers.filter((supplier) => {
      const statusText = supplier.status === 1 ? 'active' : 'inactive';
      return (
        (supplier.product_category && supplier.product_category.toLowerCase().includes(lowercasedQuery)) ||
        (supplier.accessory_name && typeof supplier.accessory_name === 'string' && supplier.accessory_name.toLowerCase().includes(lowercasedQuery)) ||
        (supplier.accessory_name && typeof supplier.accessory_name === 'object' && supplier.accessory_name.code && supplier.accessory_name.code.toLowerCase().includes(lowercasedQuery)) ||
        (supplier.remark && supplier.remark.toLowerCase().includes(lowercasedQuery)) ||
        statusText.includes(lowercasedQuery)
      );
    });
    setFilteredSupplier(filtered);
  }, [searchQuery, suppliers]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const navigate = useNavigate();

  const columns = [
    {
      name: 'Sr No',
      selector: (_, index) => index + 1,
      sortable: true,
      width: '90px'
    },
    {
      name: 'Date',
      selector: (row) => row.date?.toUpperCase() || '',
      sortable: true,
      width: '100px'
    },
    {
      name: 'Product Category',
      selector: (row) => row.product_category?.toUpperCase() || '',
      sortable: true,
    },
    {
      name: 'Accessory Name',
      selector: (row) => (typeof row.accessory_name === 'string' ? row.accessory_name?.toUpperCase() : row.accessory_name?.code?.toUpperCase() || ''),
      sortable: true,
      width: '270px'
    },
    {
      name: 'Remarks',
      selector: (row) => row.remark || '',
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

  const handleDelete = async (supplierId) => {
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
        await axios.delete(`<span class="math-inline">\{import\.meta\.env\.VITE\_API\_BASE\_URL\}/api/accessory/</span>{supplierId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setSupplier((prevSuppliers) => prevSuppliers.filter((supplier) => supplier.id !== supplierId));
        setFilteredSupplier((prevFilteredSuppliers) => prevFilteredSuppliers.filter((supplier) => supplier.id !== supplierId));
        toast.success('Accessory deleted successfully');
        Swal.fire('Deleted!', 'The accessory has been deleted.', 'success');
      }
    } catch (error) {
      console.error('Error deleting accessory:', error);
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(`Failed to delete accessory: ${error.response.data.message}`);
      } else {
        toast.error('An unexpected error occurred while deleting the accessory.');
      }
      Swal.fire('Error!', 'There was a problem deleting the accessory.', 'error');
    }
  };

  const handleEdit = (supplier) => {
    // Ensure we extract product_category_id for editing
    const updatedSupplier = {
      ...supplier,
      product_category_id: supplier.product_category_id || supplier.product_category?.id || '', // Fallback if needed
      accessory_name: supplier.accessory_name,
      remark: supplier.remark,
      date: supplier.date
    };
    setselectedSupplier(updatedSupplier);
    setShowEditModal(true);
  };
  

  const handleUpdateUser = async () => {
    try {
      if (!selectedSupplier || !selectedSupplier.id) {
        toast.error('Invalid supplier selected for update!');
        return;
      }
  
      const payload = {
        product_category_id: selectedSupplier.product_category_id,
        accessory_name: selectedSupplier.accessory_name,
        remark: selectedSupplier.remark,
        date: selectedSupplier.date
      };
  
      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/accessory/${selectedSupplier.id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );
  
      if (response.status === 200) {
        toast.success('Supplier updated successfully!');
  
        // Update local state
        setSupplier((prev) => prev.map((sup) => (sup.id === selectedSupplier.id ? { ...sup, ...payload } : sup)));
        setFilteredSupplier((prev) => prev.map((sup) => (sup.id === selectedSupplier.id ? { ...sup, ...payload } : sup)));
  
        setShowEditModal(false);
      } else {
        throw new Error('Unexpected response status');
      }
    } catch (error) {
      console.error('Error during update:', error);
      toast.error('Error updating supplier!');
    }
  };
  
  const handleAddUser = () => {
    navigate('/add_accessories');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setselectedSupplier((prev) => {
      if (name === 'accessory_name' && typeof prev?.accessory_name === 'object') {
        return {
          ...prev,
          accessory_name: {
            ...prev.accessory_name,
            code: value, // Assuming you are editing the 'code' property
          },
        };
      }
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const customStyles = {
    table: {
      style: {
        borderCollapse: 'separate',
        borderSpacing: 0
      }
    },
    header: {
      style: {
        backgroundColor: '#2E8B57',
        color: '#fff',
        fontSize: '18px',
        fontWeight: 'bold',
        padding: '15px',
        borderRadius: '8px 8px 0 0'
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
        justifyContent: 'center',
        backgroundColor: '#20B2AA',
        color: '#fff',
        fontSize: '12px',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        padding: '15px',
        borderRight: '1px solid #e0e0e0'
      },
      lastCell: {
        style: {
          borderRight: 'none'
        }
      }
    },
    cells: {
      style: {
        justifyContent: 'center',
        fontSize: '14px',
        color: '#333',
        padding: '12px',
        borderRight: '1px solid grey'
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
        color: 'black',
        border: 'none',
        '&:hover': {
          backgroundColor: 'rgba(255,255,255,0.2)'
        },
        '& svg': {
          fill: 'white'
        },
        '&:focus': {
          outline: 'none',
          boxShadow: '0 0 5px rgba(255,255,255,0.5)'
        }
      }
    }
  };

  const exportToCSV = () => {
    const csv = Papa.unparse(
      filteredSuppliers.map((row, index) => ({
        'Sr No': index + 1,
        Date: row.date,
        'Product Category': row.product_category,
        'Accessory Name': typeof row.accessory_name === 'string' ? row.accessory_name : row.accessory_name?.code || '',
        Remarks: row.remark,
      }))
    );

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'accessories_list.csv');
  };


  const exportToPDF = () => {
    const doc = new jsPDF('potrait');
    doc.text('Accessories List', 14, 10);

    doc.autoTable({
      startY: 15,
      head: [['S no.', 'Date', 'Product Category', 'Accessory', 'Remarks']],
      body: filteredSuppliers.map((row, index) => [
        index + 1,
        row.date || '',
        row.product_category || '',
        typeof row.accessory_name === 'string' ? row.accessory_name : row.accessory_name?.code || '',
        row.remark || '',
      ]),
      styles: {
        fontSize: 9,
        cellPadding: 1,
        overflow: 'linebreak',
        halign: 'left',
      },
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 30 },
        2: { cellWidth: 40 },
        3: { cellWidth: 60 },
        4: { cellWidth: 40 },
      },
      theme: 'grid',
      tableWidth: 'wrap',
      margin: { top: 10, left: 5, right: 5, bottom: 5 },
    });

    doc.save('accessories_list.pdf');
  };


  return (
    <div className="container-fluid pt-4" style={{ border: '3px dashed #14ab7f', borderRadius: '8px', background: '#ff9d0014' }}>
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
        <div className="col-md-8 text-end mt-3 mt-md-0">
          <Button variant="primary" onClick={handleAddUser}
            style={{
              marginRight: isMobile ? "25px" : "auto",
              marginBottom: isMobile ? "-10px" : "auto",
            }}
          >
            <MdPersonAdd className="me-2" style={{
              height: '25px',
              width: '23px'
            }} />
            <span className='d-none d-md-inline'>
              Add Product Accessory
            </span>
          </Button>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <div className="card rounded-lg shadow-none" style={{ background: '#f5f0e6' }}>
            <div className="card-body p-0" style={{ borderRadius: '8px' }}>
              <div className="d-flex justify-content-end">
                <button type="button" className="btn btn-sm btn-info" onClick={exportToCSV}>
                  <FaFileCsv className="w-5 h-5 me-1" style={{
                    height: '25px',
                    width: '15px'
                  }} />
                  <span className='d-none d-md-inline'>
                    Export as CSV
                  </span>
                </button>
                <button type="button" className="btn btn-sm btn-info" onClick={exportToPDF}>
                  <AiOutlineFilePdf className="w-5 h-5 me-1" style={{
                    height: '25px',
                    width: '20px'
                  }} />
                  <span className='d-none d-md-inline'>Export as PDF</span>
                </button>
              </div>
              <DataTable
                columns={columns}
                data={filteredSuppliers}
                pagination
                highlightOnHover
                striped
                responsive
                customStyles={customStyles}
                defaultSortFieldId={1}
              />
            </div>
          </div>
        </div>
      </div>
      {showEditModal && selectedSupplier && (
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
          <Modal.Header closeButton style={{ backgroundColor: '#3f4d67' }}>
            <Modal.Title className="text-white">Edit Accessory</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ backgroundColor: '#f0fff4' }}>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Date</Form.Label>
                <Form.Control type="date" name="date" value={selectedSupplier.date || ''} onChange={handleChange} />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Product Category</Form.Label>
                <Form.Control type="text" name="product_category" value={selectedSupplier.product_category || ''} onChange={handleChange} />
              </Form.Group>

              {typeof selectedSupplier.accessory_name === 'string' ? (
                <Form.Group className="mb-3">
                  <Form.Label>Accessory Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="accessory_name"
                    value={selectedSupplier.accessory_name || ''}
                    onChange={handleChange}
                  />
                </Form.Group>
              ) : (
                <Form.Group className="mb-3">
                  <Form.Label>Accessory Code</Form.Label>
                  <Form.Control
                    type="text"
                    name="accessory_name" // This will target the 'code' property in handleChange
                    value={selectedSupplier.accessory_name?.code || ''}
                    onChange={handleChange}
                  />
                </Form.Group>
              )}

              <Form.Group className="mb-3">
                <Form.Label>Remark</Form.Label>
                <Form.Control type="text" name="remark" value={selectedSupplier.remark || ''} onChange={handleChange} />
                </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer style={{ backgroundColor: '#f0fff4' }}>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Close
            </Button>
            <Button variant="success" onClick={handleUpdateUser}>
              Update
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default SuppliersPage;