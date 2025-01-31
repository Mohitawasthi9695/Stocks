import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Button, Modal, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MdEdit, MdDelete, MdPersonAdd } from 'react-icons/md';
import { toast } from 'react-toastify';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import Swal from 'sweetalert2';
import { FaFileCsv } from 'react-icons/fa';
import { AiOutlineFilePdf } from 'react-icons/ai';

import Papa from 'papaparse';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const handleDelete = async (userId) => {
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
      try {
        await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/admin/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        toast.success('User deleted successfully');
        setUsers(users.filter((user) => user.id !== userId));
        setFilteredUsers(filteredUsers.filter((user) => user.id !== userId));
        Swal.fire('Deleted!', 'The user has been deleted.', 'success');
      } catch (error) {
        toast.error('Failed to delete user');
        Swal.fire('Error!', 'There was a problem deleting the user.', 'error');
      }
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/admin/users`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setUsers(response.data.data);
      setFilteredUsers(response.data.data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch users!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);
 const handleEdit = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      const updatedStatus = currentStatus === 1 ? 0 : 1; // Toggle status
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/users/${userId}`,
        { status: updatedStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );
      toast.success('Status updated successfully!');
      setUsers((prevUsers) => prevUsers.map((user) => (user.id === userId ? { ...user, status: updatedStatus } : user)));
    } catch (error) {
      toast.error('Failed to update status!');
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/admin/users`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });

        setUsers(response.data.data);
        setFilteredUsers(response.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = users.filter(
      (user) =>
        user.username.toLowerCase().includes(lowercasedQuery) ||
        user.name.toLowerCase().includes(lowercasedQuery) ||
        user.email.toLowerCase().includes(lowercasedQuery) ||
        user.phone.toString().toLowerCase().includes(lowercasedQuery) ||
        (user.status === 1 ? 'inactive' : 'active').includes(lowercasedQuery)
    );
    setFilteredUsers(filtered);
  }, [searchQuery, users]);

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
      name: 'Username',
      selector: (row) => row.username,
      sortable: true
    },
    {
      name: 'Name',
      selector: (row) => row.name,
      sortable: true
    },
    {
      name: 'Email',
      selector: (row) => row.email,
      sortable: true
    },
    {
      name: 'Phone',
      selector: (row) => row.phone,
      sortable: true
    },
    {
      name: 'Role',
      selector: (row) => (row.role === 1 ? 'Admin' : row.role === 2 ? 'Operator' : row.role === 3 ? 'Supervisor' : 'Superadmin'),
      sortable: true
    },
    {
      name: 'Status',
      selector: (row) => (row.status === 1 ? 'inactive' : 'active'),
      sortable: true,
      cell: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Toggle Switch */}
          <label style={{ position: 'relative', display: 'inline-block', width: '34px', height: '20px' , marginBottom:'0'}}>
            <input
              type="checkbox"
              checked={row.status === 0} // Active if 0
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
                borderRadius: '20px',
              }}
            ></span>
            <span
              style={{
                position: 'absolute',
                content: '',
                height: '14px',
                width: '14px',
                left: row.status === 0 ? '18px' : '3px',
                bottom: '3px',
                backgroundColor: 'white',
                transition: '0.4s',
                borderRadius: '50%',
              }}
            ></span>
          </label>
      
          {/* Status Badge */}
          <span
            className={`badge ${row.status === 0 ? 'bg-success' : 'bg-danger'}`}
            style={{
              padding: '5px 10px',
              borderRadius: '8px',
              whiteSpace: 'nowrap', // Prevents text wrapping
            }}
          >
            {row.status === 0 ? 'Active' : 'Inactive'}
          </span>
        </div>
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
  const handleUpdateUser = async () => {
    try {
      const response = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/admin/users/${selectedUser.id}`, selectedUser, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      toast.success('User updated successfully!');
      setUsers((prevUsers) => prevUsers.map((user) => (user.id === selectedUser.id ? response.data.data : user)));
      setShowEditModal(false);
    } catch (error) {
      toast.error('Error updating user!');
    }
  };

  const handleAddUser = () => {
    navigate('/add-user');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedUser((prevUser) => ({
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
    const csv = Papa.unparse(filteredUsers);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'user_list.csv');
  };
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text('User List', 20, 10);
    doc.autoTable({
      head: [['Username', 'Name', 'Email', 'Phone', 'Role', 'Status']],
      body: filteredUsers.map((row) => [row.username, row.name, row.email, row.phone, row.role, row.status === 1 ? 'Active' : 'Inactive'])
    });
    doc.save('user_list.pdf');
  };

  return (
    <div className="container-fluid pt-4" style={{ border: '3px dashed #14ab7f', borderRadius: '8px', background: '#ff9d0014' }}>
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
            <MdPersonAdd className="me-2" /> Add User
          </Button>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <div className="card rounded-lg shadow-none" style={{ background: '#f5f0e6' }}>
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
                  data={filteredUsers}
                  pagination
                  highlightOnHover
                  striped
                  responsive
                  customStyles={customStyles}
                  defaultSortFieldId={1}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this user?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Close
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control type="text" name="username" value={selectedUser?.username || ''} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" name="name" value={selectedUser?.name || ''} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" name="email" value={selectedUser?.email || ''} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control type="text" name="phone" value={selectedUser?.phone || ''} onChange={handleChange} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdateUser}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UsersPage;