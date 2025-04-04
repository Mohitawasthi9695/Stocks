import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Button, Modal, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MdEdit, MdDelete, MdPersonAdd } from 'react-icons/md';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import 'react-loading-skeleton/dist/skeleton.css';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

import Papa from 'papaparse';
import { saveAs } from 'file-saver';
import 'jspdf-autotable';
import { FaFileCsv } from 'react-icons/fa';
import { AiOutlineFilePdf } from 'react-icons/ai';

const ReceiversPage = () => {
  const [Receivers, setReceiver] = useState([]);
  const [filteredReceivers, setFilteredReceiver] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedReceiver, setselectedReceiver] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <600);

  const people_type = 'Company';
  useEffect(() => {
    const fetchReceiver = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/peoples?people_type=${people_type}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        console.log(response.data.data);
        setReceiver(response.data.data);
        setFilteredReceiver(response.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchReceiver();
  }, []);

  // Update filtered Receivers when the search query changes
  useEffect(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = Receivers.filter((Company) => {
      const statusText = Company.status === 1 ? 'active' : 'inactive';
      return (
        Company.name.toLowerCase().includes(lowercasedQuery) ||
        Company.code.toLowerCase().includes(lowercasedQuery) ||
        Company.gst_no.toLowerCase().includes(lowercasedQuery) ||
        Company.email.toLowerCase().includes(lowercasedQuery) ||
        Company.tel_no.toLowerCase().includes(lowercasedQuery) ||
        Company.owner_mobile.toLowerCase().includes(lowercasedQuery) ||
        statusText.includes(lowercasedQuery)
      );
    });
    setFilteredReceiver(filtered);
  }, [searchQuery, Receivers]);

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
      name: 'Company Name',
      selector: (row) => row.name,
      sortable: true,
      width: '200px',
      center: true,
      wrap: true
      
    },
    {
      name: 'Code',
      selector: (row) => row.code,
      sortable: true,
      width: '150px'
    },
    {
      name: 'GST No',
      selector: (row) => row.gst_no,
      sortable: true,
      width: '150px'
    },
    {
      name: 'CIN No',
      selector: (row) => row.cin_no,
      sortable: true,
      center: true,
      wrap: true,
      width: '150px'
    },
    {
      name: 'PAN No',
      selector: (row) => row.pan_no,
      sortable: true,
      center: true,
      wrap: true,
      width: '150px'
    },
    {
      name: 'MSME No',
      selector: (row) => row.msme_no,
      sortable: true,
      width: '150px',
      center: true,
      wrap: true
    },
    {
      name: 'Phone',
      selector: (row) => row.tel_no,
      sortable: true,
      width: '150px',
      center: true,
      wrap: true
    },
    {
      name: 'Email',
      selector: (row) => row.email,
      sortable: true,
      width: '220px',
      center: true,
      wrap: true
    },
    {
      name: 'Owner Mobile',
      selector: (row) => row.owner_mobile,
      sortable: true,
      center: true,
      wrap: true,
      width: '150px'
    },
    {
      name: 'Registered Address',
      selector: (row) => row.reg_address,
      sortable: true,
      center: true,
      wrap: true,
      width: '200px'
      // cell: (row) => (
      //   <details>
      //     <summary
      //       style={{
      //         cursor: 'pointer'
      //       }}
      //     >
      //       {row.reg_address.replace('\n', ', ').slice(0, 20)} {/* Show first 50 characters truncated */}
      //     </summary>
      //     <span>{row.reg_address.replace('\n', ', ')}</span> {/* Show full address when expanded */}
      //   </details>
      // )
    },
    {
      name: 'Work Address',
      selector: (row) => row.work_address,
      sortable: true,
      center: true,
      wrap: true,
      width: '200px'
      // cell: (row) => (
      //   <details>
      //     <summary
      //       style={{
      //         cursor: 'pointer'
      //       }}
      //     >
      //       {row.work_address.replace('\n', ', ').slice(0, 20)} {/* Show first 50 characters truncated */}
      //     </summary>
      //     <span>{row.work_address.replace('\n', ', ')}</span> {/* Show full address when expanded */}
      //   </details>
      // )
    },

    {
      name: 'Area',
      selector: (row) => row.area,
      sortable: true,
      width: '200px',
      center: true,
      wrap: true
    },
    {
      name: 'Action',
      width: '250px',
      cell: (row, index) => (
        <div className="d-flex">
          <Button
            variant="outline-info"
            size="sm"
            onClick={() => exportRowToPDF(row, index + 1)} // Corrected passing of `index`
          >
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
  const exportRowToPDF = (row, srNo) => {
    console.log('Exporting Row:', row);
    console.log('Sr No:', srNo);
  
    const doc = new jsPDF();
  
    doc.setFontSize(16);
    doc.text('Supplier Details', 14, 10);
  
    const tableColumn = ['Field', 'Value'];
    const tableRows = [
      ['Sr No', srNo || 'N/A'],
      ['Supplier Name', row.name || 'N/A'],
      ['Code', row.code || 'N/A'],
      ['GST No', row.gst_no || 'N/A'],
      ['CIN No', row.cin_no || 'N/A'],
      ['PAN No', row.pan_no || 'N/A'],
      ['MSME No', row.msme_no || 'N/A'],
      ['Phone', row.tel_no || 'N/A'],
      ['Email', row.email || 'N/A'],
      ['Owner Mobile', row.owner_mobile || 'N/A'],
      ['Registered Address', row.reg_address || 'N/A'],
      ['Work Address', row.work_address || 'N/A'],
      ['Area', row.area || 'N/A'],
      ['Status', row.status === 1 ? 'Active' : 'Inactive']
    ];
  
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: { fontSize: 9, cellPadding: 2, overflow: 'linebreak', lineWidth: 0.3 },
      columnStyles: { 0: { cellWidth: 50 }, 1: { cellWidth: 120 } },
      theme: 'grid'
    });
  
    console.log('Downloading PDF...');
    doc.save(`Supplier_${row.name || 'Unknown'}.pdf`);
  };
  

  const handleDelete = async (receiverId) => {
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
        // Attempt to delete supplier
        await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/peoples/${receiverId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });

        // Update state on successful deletion
        setReceiver((prevReceivers) => prevReceivers.filter((Receivers) => Receivers.id !== receiverId));
        setFilteredReceiver((prevFilteredReceivers) => prevFilteredReceivers.filter((Receivers) => Receivers.id !== receiverId));

        toast.success('Company deleted successfully');
        Swal.fire('Deleted!', 'The Company has been deleted.', 'success');
      }
    } catch (error) {
      // Log error for debugging and notify user
      console.error('Error deleting Company:', error);

      // Provide user feedback
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(`Failed to delete Company: ${error.response.data.message}`);
      } else {
        toast.error('An unexpected error occurred while deleting the Company.');
      }

      // Display error notification in confirmation dialog
      Swal.fire('Error!', 'There was a problem deleting the Company.', 'error');
    }
  };

  const handleEdit = (user) => {
    setselectedReceiver(user);
    setShowEditModal(true);
  };
  const handleUpdateUser = async () => {
    try {
      // Ensure the selectedReceiver is valid
      if (!selectedReceiver || !selectedReceiver.id) {
        toast.error('Invalid Company selected for update!');
        return;
      }

      // Perform the API call
      const response = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/peoples/${selectedReceiver.id}`, selectedReceiver, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      // Check the response status
      if (response.status === 200) {
        toast.success('Company updated successfully!');
        setReceiver((prev) => prev.map((sup) => (sup.id === selectedReceiver.id ? selectedReceiver : sup)));
        setFilteredReceiver((prev) => prev.map((sup) => (sup.id === selectedReceiver.id ? selectedReceiver : sup)));
        setShowEditModal(false);
      } else {
        throw new Error('Unexpected response status');
      }
    } catch (error) {
      console.error('Error during update:', error);
      toast.error('Error updating Company!');
    }
  };

  const handleAddUser = () => {
    navigate('/add-company');
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setselectedReceiver((prevUser) => ({
      ...prevUser,
      [name]: value
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
    const csv = Papa.unparse(filteredReceivers);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'supplier_list.csv');
  };
  const exportToPDF = () => {
    const doc = new jsPDF('landscape');
    doc.text('Seller List', 14, 10);

    const headers = [['Sr No', 'Company Name', 'Code', 'GST No', 'CIN No', 'PAN No', 'MSME No', 'Owner Mobile', 'Registered Address']];

    const body = filteredReceivers.map((row, index) => [
      index + 1, // Corrected index usage
      row.name,
      row.code,
      row.gst_no || 'N/A',
      row.cin_no || 'N/A',
      row.pan_no || 'N/A',
      row.msme_no || 'N/A',
      row.owner_mobile || 'N/A',
      row.reg_address || 'N/A'
    ]);

    doc.autoTable({
      head: headers,
      body: body,
      startY: 20,
      theme: 'grid',
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [22, 160, 133], textColor: 255, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [238, 238, 238] }
    });

    doc.save('receivers_list.pdf');
  };

  return (
    <div className="container-fluid pt-4 " style={{ border: '3px dashed #14ab7f', borderRadius: '8px', background: '#ff9d0014' }}>
      <div className="row mb-3">
        <div className="col-md-4">
          <label htmlFor="search" className="me-2">
          </label>
          <input
            type="text"
            placeholder="Type here..."
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
              marginRight: isMobile ? "20px" : "auto",
              marginBottom: isMobile ? "-10px" : "auto",
            }}
          >
            <MdPersonAdd className="me-2" 
              style={{
                width: isMobile ? "20px" : "auto",
                height: isMobile ? "20px" : "auto",
              }}
            /> 
            <span className='d-none d-md-inline'>Add Company</span>
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
                  <AiOutlineFilePdf className="w-5 h-5 me-1" 
                    style={{
                      height: '25px',
                      width :'20px'
                    }}
                  />
                  <span className='d-none d-sm-inline'>
                  Export as PDF
                  </span>
                </button>
              </div>
              <DataTable
                columns={columns}
                data={filteredReceivers}
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
      {/* Edit User Modal */}
      {showEditModal && (
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
          <Modal.Header closeButton style={{ backgroundColor: '#3f4d67' }}>
            <Modal.Title className="text-white">Edit Company</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ backgroundColor: '#f0fff4' }}>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Company Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={selectedReceiver.name || ''}
                  onChange={handleChange}
                  className="bg-white shadow-sm"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Company Code</Form.Label>
                <Form.Control
                  type="text"
                  name="code"
                  value={selectedReceiver.code || ''}
                  onChange={handleChange}
                  className="bg-white shadow-sm"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>GST Number</Form.Label>
                <Form.Control
                  type="text"
                  name="gst_no"
                  value={selectedReceiver.gst_no || ''}
                  onChange={handleChange}
                  className="bg-white shadow-sm"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>CIN Number</Form.Label>
                <Form.Control
                  type="text"
                  name="cin_no"
                  value={selectedReceiver.cin_no || ''}
                  onChange={handleChange}
                  className="bg-white shadow-sm"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>PAN Number</Form.Label>
                <Form.Control
                  type="text"
                  name="pan_no"
                  value={selectedReceiver.pan_no || ''}
                  onChange={handleChange}
                  className="bg-white shadow-sm"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>MSME Number</Form.Label>
                <Form.Control
                  type="text"
                  name="msme_no"
                  value={selectedReceiver.msme_no || ''}
                  onChange={handleChange}
                  className="bg-white shadow-sm"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Registered Address</Form.Label>
                <Form.Control
                  type="text"
                  name="reg_address"
                  value={selectedReceiver.reg_address || ''}
                  onChange={handleChange}
                  className="bg-white shadow-sm"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Work Address</Form.Label>
                <Form.Control
                  type="text"
                  name="work_address"
                  value={selectedReceiver.work_address || ''}
                  onChange={handleChange}
                  className="bg-white shadow-sm"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  type="text"
                  name="tel_no"
                  value={selectedReceiver.tel_no || ''}
                  onChange={handleChange}
                  className="bg-white shadow-sm"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Owner Mobile</Form.Label>
                <Form.Control
                  type="text"
                  name="owner_mobile"
                  value={selectedReceiver.owner_mobile || ''}
                  onChange={handleChange}
                  className="bg-white shadow-sm"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Select name="status" value={selectedReceiver.status || ''} onChange={handleChange} className="bg-white shadow-sm">
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

export default ReceiversPage;
