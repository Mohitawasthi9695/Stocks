import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Button, Modal, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MdEdit, MdDelete, MdPersonAdd } from 'react-icons/md';
import { toast } from 'react-toastify';
import { FaFileCsv } from 'react-icons/fa';
import { AiOutlineFilePdf } from 'react-icons/ai';
import Swal from 'sweetalert2';


const CustomersPage = () => {
  const [Customers, setCustomer] = useState([]);
  const [filteredCustomers, setFilteredCustomer] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCustomer, setselectedCustomer] = useState(null);
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/customers`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        console.log(response);
        
        setCustomer(response.data.data);
        setFilteredCustomer(response.data.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCustomer();
  }, []);

  // Update filtered Customers when the search query changes
  useEffect(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = Customers.filter((Customer) => {
      const statusText = Customer.status === 1 ? 'active' : 'inactive';
      return (
        Customer.name.toLowerCase().includes(lowercasedQuery) ||
        Customer.code.toLowerCase().includes(lowercasedQuery) ||
        Customer.gst_no.toLowerCase().includes(lowercasedQuery) ||
        Customer.email.toLowerCase().includes(lowercasedQuery) ||
        Customer.tel_no.toLowerCase().includes(lowercasedQuery) ||
        Customer.owner_mobile.toLowerCase().includes(lowercasedQuery) ||
        statusText.includes(lowercasedQuery)
      );
    });
    setFilteredCustomer(filtered);
  }, [searchQuery, Customers]);

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
      name: 'Customer Name',
      selector: (row) => row.name,
      sortable: true
    },
    {
      name: 'Code',
      selector: (row) => row.code,
      sortable: true
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
      selector: (row) => row.owner_mobile,
      sortable: true
    },
    {
      name: 'Registered Address',
      selector: (row) => row.reg_address,
      sortable: true,
      cell: (row) => <span>{row.reg_address.replace('\n', ', ')}</span>
    },
    {
      name: 'Work Address',
      selector: (row) => row.work_address,
      sortable: true,
      cell: (row) => <span>{row.work_address.replace('\n', ', ')}</span>
    },
    {
      name: 'Area',
      selector: (row) => row.area,
      sortable: true
    },
    {
      name: 'Status',
      selector: (row) => (row.status === 1 ? 'active' : 'inactive'),
      sortable: true,

      cell: (row) => (
        
        <label style={{ position: 'relative', display: 'inline-block', width: '34px', height: '20px' }}>
          <div style={{marginLeft:"10px",marginTop:"4px"}}>
          <span
            className={`badge ${row.status === 1 ? 'bg-success' : 'bg-danger'}`}
            style={{ padding: '5px 10px', borderRadius: '8px' }}
          >
            {row.status === 0 ? 'Active' : 'Inactive'}
          </span>
          </div>
           
          <input
            type="checkbox"
            checked={row.status === 1} 
            onChange={() => handleToggleStatus(row.id, row.status)}
            style={{ opacity: 0, width: 0, height: 0 }}
          />
          <span
            style={{
              position: 'absolute',
              cursor: 'pointer',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: row.status === 0 ? '#4caf50' : '#ccc',
              transition: '0.4s',
              borderRadius: '20px'
            }}
          ></span>
          <span
            style={{
              position: 'absolute',
              content: "",
              height: '14px',
              width: '14px',
              left: row.status === 0 ? '18px' : '3px',
              bottom: '3px',
              backgroundColor: 'white',
              transition: '0.4s',
              borderRadius: '50%'
            }}
          ></span>
        </label>
      )
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

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      const updatedStatus = currentStatus === 1 ? 0 : 1; 
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/customers/${userId}`,
        { status: updatedStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        }
      );
      toast.success('Status updated successfully!');
      setCustomer((prevCustomers) =>
        prevCustomers.map((customer) =>
          customer.id === userId ? { ...customer, status: updatedStatus } : customer
        )
      );
    } catch (error) {
      toast.error('Failed to update status!');
    }
  };
  // const handleDelete = async (userId) => {
  //   try {
  //     const response = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/customers/${userId}`, {
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem('token')}`,
  //         'Content-Type': 'application/json'
  //       }
  //     });

  //     // Check if the response indicates success
  //     if (response.status === 200) {
  //       toast.success('User deleted successfully');
  //       setCustomer(Customers.filter((user) => user.id !== userId));
  //       setFilteredCustomer(filteredCustomers.filter((user) => user.id !== userId));
  //     } else {
  //       throw new Error('Unexpected response status');
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     toast.error('Failed to delete user');
  //   }
  // };

  const handleDelete = async (userId) => {
    try {
      // Display confirmation modal
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
        // Attempt to delete customer
        await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/customers/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
  
        // Update state on successful deletion
        setCustomer((prevCustomers) => prevCustomers.filter((customer) => customer.id !== userId));
        setFilteredCustomer((prevFilteredCustomers) => prevFilteredCustomers.filter((customer) => customer.id !== userId));
  
        toast.success('Customer deleted successfully');
        Swal.fire('Deleted!', 'The customer has been deleted.', 'success');
      }
    } catch (error) {
      // Log error for debugging and notify user
      console.error('Error deleting customer:', error);
  
      // Provide user feedback
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(`Failed to delete customer: ${error.response.data.message}`);
      } else {
        toast.error('An unexpected error occurred while deleting the customer.');
      }
  
      // Display error notification in confirmation dialog
      Swal.fire('Error!', 'There was a problem deleting the customer.', 'error');
    }
  };
  


  const handleUpdateCustomer = async () => {
    try {
      if (!selectedCustomer || !selectedCustomer.id) {
        toast.error('Invalid Customer selected for update!');
        return;
      }

      // Perform the API call
      const response = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/customers/${selectedCustomer.id}`, selectedCustomer, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.status === 200) {
        toast.success('Customer updated successfully!');
        setCustomer((prev) => prev.map((sup) => (sup.id === selectedCustomer.id ? selectedCustomer : sup)));

        // Update the filtered Customers list
        setFilteredCustomer((prev) => prev.map((sup) => (sup.id === selectedCustomer.id ? selectedCustomer : sup)));

        // Close the modal
        setShowEditModal(false);
      } else {
        throw new Error('Unexpected response status');
      }
    } catch (error) {
      console.error('Error during update:', error);
      toast.error('Error updating Customer!');
    }
  };
  const handleEdit = (user) => {
    setselectedCustomer(user);
    setShowEditModal(true);
  };
  
  const handleAddUser = () => {
    navigate('/add-Customer');
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setselectedCustomer((prevUser) => ({
      ...prevUser,
      [name]: value
    }));
  };

  const customStyles = {
     table: {
       style: {
         borderCollapse: 'separate', // Ensures border styles are separate
         borderSpacing: 0, // Removes spacing between cells
       },
     },
     header: {
       style: {
         backgroundColor: '#2E8B57',
         color: '#fff',
         fontSize: '18px',
         fontWeight: 'bold',
         padding: '15px',
         borderRadius: '8px 8px 0 0', // Adjusted to only affect top corners
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
         justifyContent: 'center',
         backgroundColor: '#20B2AA',
         color: '#fff',
         fontSize: '12px',
         fontWeight: 'bold',
         textTransform: 'uppercase',
         padding: '15px',
         borderRight: '1px solid #e0e0e0', // Vertical lines between header cells
       },
       lastCell: {
         style: {
           borderRight: 'none', // Removes border for the last cell
         },
       },
     },
     cells: {
       style: {
         justifyContent: 'center',
         fontSize: '14px',
         color: '#333',
         padding: '12px',
         borderRight: '1px solid grey', // Vertical lines between cells
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
         color: 'black', // Makes the arrows white
         border: 'none',
         '&:hover': {
           backgroundColor: 'rgba(255,255,255,0.2)',
         },
         '& svg':{
           fill: 'white',
         },
         '&:focus': {
           outline: 'none',
           boxShadow: '0 0 5px rgba(255,255,255,0.5)',
         },
       },
     },
   };
  
  const exportToCSV = () => {
      const csv = Papa.unparse(filteredSuppliers);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      saveAs(blob, 'supplier_list.csv');
    };
    const exportToPDF = () => {
      const doc = new jsPDF('landscape');
      doc.text('Suppliers List', 20, 10);
      doc.autoTable({
        head: [
          [
            'Customer Name',
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
        ])
      });
      doc.save('user_list.pdf');
    };

  return (
    <div className="container-fluid pt-4 " style={{ border: '3px dashed #14ab7f', borderRadius: '8px', background: '#ff9d0014' }}>
      <div className="row mb-3">
      <div className="col-md-4">
          <label htmlFor="search" className='me-2'>Search: </label>
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
        <div className="col-md-8 text-end">
          <Button variant="primary" onClick={handleAddUser}>
            <MdPersonAdd className="me-2" /> Add Customer
          </Button>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <div className="card border-0 shadow-none" style={{ background: '#f5f0e6' }}>
          <div className="card  border-0 shadow-none" style={{ background: '#f5f0e6' }}>
            {/* <div
              className="card-header d-flex justify-content-between align-items-center"
              style={{ backgroundColor: '#3f4d67', color: 'white' }}
            >
              <h2 className="m-0 text-white">Customers Management</h2>
            </div> */}
            <div className="card-body p-0" style={{ borderRadius: '8px' }}>
              <div className="d-flex justify-content-end">
                <button type="button" className="btn btn-sm btn-info" onClick={exportToCSV}>
                  <FaFileCsv className="w-5 h-5 me-1" />
                  Export as CSV
                </button>
                <button type="button" className="btn btn-sm btn-info" onClick={exportToPDF}>
                  <AiOutlineFilePdf className="w-5 h-5 me-1" />
                  Export as PDF
                </button>
              </div>
              <DataTable
                columns={columns}
                data={filteredCustomers}
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
      {/* Delete Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this Customer?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Close
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit User Modal */}
      {showEditModal && (
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
          <Modal.Header closeButton style={{ backgroundColor: '#3f4d67' }}>
            <Modal.Title className="text-white">Edit Customer</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ backgroundColor: '#f0fff4' }}>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Customer Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={selectedCustomer.name || ''}
                  onChange={handleChange}
                  className="bg-white shadow-sm"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Customer Code</Form.Label>
                <Form.Control
                  type="text"
                  name="code"
                  value={selectedCustomer.code || ''}
                  onChange={handleChange}
                  className="bg-white shadow-sm"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>GST Number</Form.Label>
                <Form.Control
                  type="text"
                  name="gst_no"
                  value={selectedCustomer.gst_no || ''}
                  onChange={handleChange}
                  className="bg-white shadow-sm"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>CIN Number</Form.Label>
                <Form.Control
                  type="text"
                  name="cin_no"
                  value={selectedCustomer.cin_no || ''}
                  onChange={handleChange}
                  className="bg-white shadow-sm"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>PAN Number</Form.Label>
                <Form.Control
                  type="text"
                  name="pan_no"
                  value={selectedCustomer.pan_no || ''}
                  onChange={handleChange}
                  className="bg-white shadow-sm"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>MSME Number</Form.Label>
                <Form.Control
                  type="text"
                  name="msme_no"
                  value={selectedCustomer.msme_no || ''}
                  onChange={handleChange}
                  className="bg-white shadow-sm"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Registered Address</Form.Label>
                <Form.Control
                  type="text"
                  name="reg_address"
                  value={selectedCustomer.reg_address || ''}
                  onChange={handleChange}
                  className="bg-white shadow-sm"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Work Address</Form.Label>
                <Form.Control
                  type="text"
                  name="work_address"
                  value={selectedCustomer.work_address || ''}
                  onChange={handleChange}
                  className="bg-white shadow-sm"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  type="text"
                  name="tel_no"
                  value={selectedCustomer.tel_no || ''}
                  onChange={handleChange}
                  className="bg-white shadow-sm"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Owner Mobile</Form.Label>
                <Form.Control
                  type="text"
                  name="owner_mobile"
                  value={selectedCustomer.owner_mobile || ''}
                  onChange={handleChange}
                  className="bg-white shadow-sm"
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer style={{ backgroundColor: '#f0fff4' }}>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Close
            </Button>
            <Button variant="success" onClick={handleUpdateCustomer}>
              Update
            </Button>
          </Modal.Footer>
        </Modal>
      )}
      </div>
      </div>
    );
  };

export default CustomersPage;
