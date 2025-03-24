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

const SuppliersPage = () => {
  const [suppliers, setSupplier] = useState([]);
  const [filteredSuppliers, setFilteredSupplier] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedSupplier, setselectedSupplier] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);

  const people_type = 'Supplier';
  useEffect(() => {
    const fetchSupplier = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/peoples?people_type=${people_type}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        console.log(response);
        setSupplier(response.data.data);
        setFilteredSupplier(response.data.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchSupplier();
  }, []);

  // Update filtered Suppliers when the search query changes
  useEffect(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = suppliers.filter((supplier) => {
      const statusText = supplier.status === 1 ? 'active' : 'inactive';
      return (
        supplier.name.toLowerCase().includes(lowercasedQuery) ||
        supplier.code.toLowerCase().includes(lowercasedQuery) ||
        supplier.gst_no.toLowerCase().includes(lowercasedQuery) ||
        supplier.email.toLowerCase().includes(lowercasedQuery) ||
        supplier.tel_no.toLowerCase().includes(lowercasedQuery) ||
        supplier.owner_mobile.toLowerCase().includes(lowercasedQuery) ||
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
      width: '85px'
    },
    {
      name: 'Supplier Name',
      width: '140px',
      selector: (row) => row.name,
      sortable: true
    },
    {
      name: 'Code',
      selector: (row) => row.code,
      sortable: true,
   

    },
    {
      name: 'GST No',
      selector: (row) => row.gst_no,
      sortable: true
    },
    {
      name: 'CIN No',
      selector: (row) => row.cin_no,
      sortable: true
    },
    {
      name: 'PAN No',
      selector: (row) => row.pan_no,
      sortable: true
    },
    {
      name: 'MSME No',
      selector: (row) => row.msme_no,
      sortable: true
    },
    {
      name: 'Phone',
      selector: (row) => row.tel_no,
      sortable: true
    },
    {
      name: 'Email',
      selector: (row) => row.email,
      sortable: true
    },
    {
      name: 'Owner Mobile',
      width: '150px',
      selector: (row) => row.owner_mobile,
      sortable: true
    },
    {
      name: 'Registered Address',
      width: '300px',
      selector: (row) => row.reg_address,
      sortable: true,
      cell: (row) => (
        <details>
          <summary style={{ cursor: 'pointer' }}>
            {row.reg_address.split('\n')[0]} {/* Show only the first line in truncated view */}
          </summary>
          <span>{row.reg_address.replace('\n', ', ')}</span> {/* Show full address when expanded */}
        </details>
      )
    },
    {
      name: 'Work Address',
      selector: (row) => row.work_address,
      sortable: true,
      cell: (row) => (
        <details>
          <summary style={{ cursor: 'pointer' }}>{row.work_address.split('\n')[0]}</summary>
          <span>{row.work_address.replace('\n', ', ')}</span>
        </details>
      ),
      width: '150px'
    },
    {
      name: 'Area',
      selector: (row) => row.area,
      sortable: true
    },
    {
      name: 'Action',
      width: '200px',
      cell: (row) => (
        <div className="d-flex">
          <Button variant="outline-info" size="sm" onClick={() => exportRowToPDF(row)}>
            <AiOutlineFilePdf />
          </Button>
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
  const exportRowToPDF = (row) => {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' }); // Use portrait mode
    doc.text(`Supplier Details - ${row.name}`, 14, 10);

    doc.autoTable({
      head: [['Field', 'Value']],
      body: [
        ['Supplier Name', row.name],
        ['Code', row.code],
        ['GST No', row.gst_no],
        ['CIN No', row.cin_no],
        ['PAN No', row.pan_no],
        ['MSME No', row.msme_no],
        ['Phone', row.tel_no],
        ['Email', row.email],
        ['Owner Mobile', row.owner_mobile],
        ['Registered Address', row.reg_address],
        ['Work Address', row.work_address],
        ['Area', row.area],
        ['Status', row.status === 1 ? 'Active' : 'Inactive']
      ],
      styles: {
        fontSize: 9, // Reduce font size
        cellPadding: 2, // Reduce padding to fit more text
        overflow: 'linebreak', // Ensures text wraps properly
        lineWidth: 0.3 // Border thickness
      },
      columnStyles: {
        0: { cellWidth: 50 }, // Adjust column width for fields
        1: { cellWidth: 120 } // Adjust width for values
      },
      theme: 'grid', // Adds vertical and horizontal lines
      tableWidth: 'auto', // Ensures table fits the page
      margin: { top: 15, left: 10, right: 10, bottom: 10 } // Optimize margins
    });

    doc.save(`Supplier_${row.name}.pdf`);
  };

  const handleDelete = async (supplierId) => {
    try {
      // Display confirmation modal
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
        background: 'white'
      });

      if (result.isConfirmed) {
        // Attempt to delete supplier
        await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/peoples/${supplierId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });

        // Update state on successful deletion
        setSupplier((prevSuppliers) => prevSuppliers.filter((supplier) => supplier.id !== supplierId));
        setFilteredSupplier((prevFilteredSuppliers) => prevFilteredSuppliers.filter((supplier) => supplier.id !== supplierId));

        toast.success('Supplier deleted successfully');
        Swal.fire({
          title: 'Deleted!',
          text: 'The supplier has been deleted.',
          icon: 'success',
          background: '#FFFFFF' // or simply 'white'
        });
      }
    } catch (error) {
      // Log error for debugging and notify user
      console.error('Error deleting supplier:', error);

      // Provide user feedback
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(`Failed to delete supplier: ${error.response.data.message}`);
      } else {
        toast.error('An unexpected error occurred while deleting the supplier.');
      }

      // Display error notification in confirmation dialog
      Swal.fire('Error!', 'There was a problem deleting the supplier.', 'error');
    }
  };

  const handleEdit = (supplier) => {
    setselectedSupplier({ ...supplier }); // Copy supplier data to state
    setShowEditModal(true);
  };

  // const handleUpdateUser = async () => {
  //   try {
  //     if (!selectedSupplier || !selectedSupplier.id) {
  //       toast.error('Invalid supplier selected for update!');
  //       return;
  //     }

  //     const response = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/supplier/${selectedSupplier.id}`, selectedSupplier, {
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem('token')}`,
  //         'Content-Type': 'application/json'
  //       }
  //     });

  //     if (response.status === 200) {
  //       toast.success('Supplier updated successfully!');

  //       setSupplier((prev) => prev.map((sup) => (sup.id === selectedSupplier.id ? selectedSupplier : sup)));

  //       setFilteredSupplier((prev) => prev.map((sup) => (sup.id === selectedSupplier.id ? selectedSupplier : sup)));

  //       setShowEditModal(false);
  //     } else {
  //       throw new Error('Unexpected response status');
  //     }
  //   } catch (error) {
  //     console.error('Error during update:', error);
  //     toast.error('Error updating supplier!');
  //   }
  // };
  const handleUpdateUser = async () => {
    if (!selectedSupplier || !selectedSupplier.id) {
      toast.error('Invalid supplier selected!');
      return;
    }

    try {
      const response = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/peoples/${selectedSupplier.id}`, selectedSupplier, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200) {
        setSupplier((prev) => prev.map((sup) => (sup.id === selectedSupplier.id ? selectedSupplier : sup)));
        setFilteredSupplier((prev) => prev.map((sup) => (sup.id === selectedSupplier.id ? selectedSupplier : sup)));
        toast.success('Supplier updated successfully!');
        setShowEditModal(false);
      }
    } catch (error) {
      console.error('Error updating supplier:', error);
      toast.error('Error updating supplier!');
    }
  };

  const handleAddUser = () => {
    navigate('/add-supplier');
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setselectedSupplier((prev) => ({
      ...prev,
      [name]: value // Dynamically update input fields
    }));
  };

  const customStyles = {
    table: {
      style: {
        borderCollapse: 'separate', // Ensures border styles are separate
        borderSpacing: 0 // Removes spacing between cells
      }
    },
    header: {
      style: {
        backgroundColor: '#2E8B57',
        color: '#fff',
        fontSize: '18px',
        fontWeight: 'bold',
        padding: '15px',
        borderRadius: '8px 8px 0 0' // Adjusted to only affect top corners
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
        borderRight: '1px solid #e0e0e0' // Vertical lines between header cells
      },
      lastCell: {
        style: {
          borderRight: 'none' // Removes border for the last cell
        }
      }
    },
    cells: {
      style: {
        justifyContent: 'center',
        fontSize: '14px',
        color: '#333',
        padding: '12px',
        borderRight: '1px solid grey' // Vertical lines between cells
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
        color: 'black', // Makes the arrows white
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
    const csv = Papa.unparse(filteredSuppliers);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'supplier_list.csv');
  };
  const exportToPDF = () => {
    const doc = new jsPDF('landscape'); // Landscape for more width
    doc.text('Suppliers List', 14, 10);

    doc.autoTable({
      head: [
        [
          'Supplier Name',
          'Code',
          'GST No',
          'CIN No',
          'PAN No',
          'MSME No',
          'Phone',
          'Email',
          'Owner Mobile',
          'Registered Address',
          'Work Address',
          'Area',
          'Status'
        ]
      ],
      body: filteredSuppliers.map((row) => [
        row.name,
        row.code,
        row.gst_no,
        row.cin_no,
        row.pan_no,
        row.msme_no,
        row.tel_no,
        row.email,
        row.owner_mobile,
        row.reg_address,
        row.work_address,
        row.area,
        row.status === 1 ? 'Active' : 'Inactive'
      ]),
      styles: {
        fontSize: 7, // Adjusted to fit more text
        cellPadding: 0.5, // Reduce padding to utilize space
        overflow: 'linebreak', // Prevent text from overflowing outside cells
        lineWidth: 0.3 // Border thickness
      },
      columnStyles: {
        0: { cellWidth: 'auto' },
        1: { cellWidth: 'auto' },
        2: { cellWidth: 'auto' },
        3: { cellWidth: 'auto' },
        4: { cellWidth: 'auto' },
        5: { cellWidth: 'auto' },
        6: { cellWidth: 'auto' },
        7: { cellWidth: 'auto' },
        8: { cellWidth: 'auto' },
        9: { cellWidth: 'auto' },
        10: { cellWidth: 'auto' },
        11: { cellWidth: 'auto' },
        12: { cellWidth: 'auto' }
      },
      theme: 'grid', // Ensures vertical and horizontal table lines
      tableWidth: 'wrap', // Ensures no extra gaps on the page
      margin: { top: 10, left: 5, right: 5, bottom: 5 } // Utilize full page
    });

    doc.save('supplier_list.pdf');
  };

  return (
    <div className="container-fluid pt-4" style={{ border: '3px dashed #14ab7f', borderRadius: '8px', background: '#ff9d0014' }}>
      <div className="row mb-3">
        <div className="col-md-4">
          <label htmlFor="search" className="me-2">
            
          </label>
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
        <div className="col-md-8 text-end mt-3 mt-md-0" >
          <Button variant="primary" className='' onClick={handleAddUser} style={{
            marginRight: isMobile ? "20px" : "auto",
            marginBottom: isMobile ? "-10px" : "auto",
          }}>
            <MdPersonAdd className="me-2"  style={{
            width: isMobile ? "20px" : "auto",
            height: isMobile ? "20px" : "auto",
          }}/> 
            <span className='d-none d-sm-inline'>Add Supplier</span>
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
                    width :'15px'
                  }}/>
                  <span className='d-none d-sm-inline'>Export as CSV</span> 
                </button>
                <button type="button" className="btn btn-sm btn-info" onClick={exportToPDF}>
                  <AiOutlineFilePdf className="w-5 h-5 me-1" style={{
                    height: '25px',
                    width: '20px'
                  }} />
                  <span className='d-none d-sm-inline'>Export as PDF</span>
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
      {showEditModal && (
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
          <Modal.Header closeButton style={{ backgroundColor: '#3f4d67' }}>
            <Modal.Title className="text-white">Edit Supplier</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ backgroundColor: '#f0fff4' }}>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Supplier Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={selectedSupplier?.name || ''}
                  onChange={handleChange}
                  className="bg-white shadow-sm"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Supplier Code</Form.Label>
                <Form.Control
                  type="text"
                  name="code"
                  value={selectedSupplier?.code || ''}
                  onChange={handleChange}
                  className="bg-white shadow-sm"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>GST Number</Form.Label>
                <Form.Control
                  type="text"
                  name="gst_no"
                  value={selectedSupplier?.gst_no || ''}
                  onChange={handleChange}
                  className="bg-white shadow-sm"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>CIN Number</Form.Label>
                <Form.Control
                  type="text"
                  name="cin_no"
                  value={selectedSupplier?.cin_no || ''}
                  onChange={handleChange}
                  className="bg-white shadow-sm"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>PAN Number</Form.Label>
                <Form.Control
                  type="text"
                  name="pan_no"
                  value={selectedSupplier?.pan_no || ''}
                  onChange={handleChange}
                  className="bg-white shadow-sm"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>MSME Number</Form.Label>
                <Form.Control
                  type="text"
                  name="msme_no"
                  value={selectedSupplier?.msme_no || ''}
                  onChange={handleChange}
                  className="bg-white shadow-sm"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Registered Address</Form.Label>
                <Form.Control
                  type="text"
                  name="reg_address"
                  value={selectedSupplier?.reg_address || ''}
                  onChange={handleChange}
                  className="bg-white shadow-sm"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Work Address</Form.Label>
                <Form.Control
                  type="text"
                  name="work_address"
                  value={selectedSupplier?.work_address || ''}
                  onChange={handleChange}
                  className="bg-white shadow-sm"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  type="text"
                  name="tel_no"
                  value={selectedSupplier?.tel_no || ''}
                  onChange={handleChange}
                  className="bg-white shadow-sm"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Owner Mobile</Form.Label>
                <Form.Control
                  type="text"
                  name="owner_mobile"
                  value={selectedSupplier?.owner_mobile || ''}
                  onChange={handleChange}
                  className="bg-white shadow-sm"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Select name="status" value={selectedSupplier?.status || ''} onChange={handleChange} className="bg-white shadow-sm">
                  <option value={1}>Active</option>
                  <option value={0}>Inactive</option>
                </Form.Select>
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
