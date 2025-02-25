import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Button, Modal, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MdEdit, MdDelete, MdPersonAdd } from 'react-icons/md';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import 'react-loading-skeleton/dist/skeleton.css';
import { FaFileCsv } from 'react-icons/fa';
import { AiOutlineFilePdf } from 'react-icons/ai';
import Papa from 'papaparse';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const WarehouseAccessoriesPage = () => {
  const [accessories, setAccessories] = useState([]);
  const [filteredAccessories, setFilteredAccessories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAccessory, setSelectedAccessory] = useState(null);

  useEffect(() => {
    const fetchAccessories = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/warehouseAccessory`, {
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
      Object.values(accessory).some((value) => (value ? value.toString().toLowerCase().includes(searchQuery.toLowerCase()) : false))
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
    {
      name: 'Accessory Code',
      selector: (row) => row.stock_code,
      sortable: true
    },
    { name: 'Length', selector: (row) => `${row.out_length}  ${row.length_unit}`, sortable: true },
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
        const response = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/warehouseAccessory/${accessoryId}`, {
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
      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/warehouseAccessory/${selectedAccessory.id}`,
        selectedAccessory,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );

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
    if (!filteredAccessories || filteredAccessories.length === 0) {
      toast.error('No data available for export.');
      return;
    }
  
    // Extract headers dynamically from columns array
    const headers = columns.map(col => col.name);
  
    // Prepare CSV data dynamically
    const csvData = filteredAccessories.map((row, index) => {
      let rowData = { 'Sr No': index + 1 }; // Add Serial Number manually
  
      columns.forEach(col => {
        if (typeof col.selector === 'function') {
          rowData[col.name] = col.selector(row);
        }
      });
  
      return rowData;
    });
  
    // Convert to CSV and save
    const csv = Papa.unparse({ fields: headers, data: csvData });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'warehouse_accessories.csv');
    toast.success('CSV exported successfully!');
  };
  
  const exportToPDF = () => {
    if (!filteredAccessories || filteredAccessories.length === 0) {
      toast.error('No data available for export.');
      return;
    }
  
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text('Stock List', 80, 10);
  
    // Extract headers from `columns` array, excluding "Action"
    const headers = columns
      .filter((col) => col.name !== 'Action') // Exclude Action column
      .map((col) => col.name);
  
    // Prepare data dynamically
    const body = filteredAccessories.map((row, index) => {
      return [
        index + 1, // Sr No
        row.product_category || 'N/A',
        row.product_accessory_name || 'N/A',
        row.stock_code || 'N/A',
        `${row.out_length} ${row.length_unit}` || 'N/A',
        row.items || 'N/A',
        row.box_bundle || 'N/A',
        row.quantity || 'N/A',
        row.out_quantity || 'N/A',
        'Edit/Delete' // Placeholder for the Action column
      ];
    });
  
    doc.autoTable({
      head: [headers],
      body: body,
      startY: 20,
      theme: 'grid',
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [44, 62, 80], textColor: 255, fontSize: 8 },
      alternateRowStyles: { fillColor: [240, 240, 240] },
      margin: { top: 20 }
    });
  
    doc.save('stock_list.pdf');
    toast.success('PDF exported successfully!');
  };
  
  
  return (
    <div className="container-fluid pt-4" style={{ border: '3px dashed #14ab7f', borderRadius: '8px', background: '#ff9d0014' }}>
      <div className="row mb-3">
        <div className="col-md-4">
          <label htmlFor="search" className="me-2">
            Search:{' '}
          </label>
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
          <Button variant="primary" onClick={() => navigate('/add_warehouse_accessories')}>
            <MdPersonAdd className="me-2" /> Add Warehouse Accessory
          </Button>
        </div>

        <div className="d-flex justify-content-end">
          <button type="button" className="btn btn-info" onClick={exportToCSV}>
            <FaFileCsv className="w-5 h-5 me-1" />
            Export as CSV
          </button>
          <button type="button" className="btn btn-info" onClick={exportToPDF}>
            <AiOutlineFilePdf className="w-5 h-5 me-1" />
            Export as PDF
          </button>
        </div>
      </div>

      <DataTable columns={columns} data={filteredAccessories} pagination highlightOnHover striped responsive customStyles={customStyles} />

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
                <Form.Control type="number" name="length" value={selectedAccessory?.length || ''} onChange={handleChange} />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Unit</Form.Label>
                <Form.Control type="text" name="unit" value={selectedAccessory?.unit || ''} onChange={handleChange} />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Items</Form.Label>
                <Form.Control type="number" name="items" value={selectedAccessory?.items || ''} onChange={handleChange} />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Box</Form.Label>
                <Form.Control type="number" name="box" value={selectedAccessory?.box || ''} onChange={handleChange} />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Quantity</Form.Label>
                <Form.Control type="number" name="quantity" value={selectedAccessory?.quantity || ''} onChange={handleChange} />
              </Form.Group>

              <div className="d-flex justify-content-end">
                <Button variant="primary" onClick={handleUpdateAccessory}>
                  Save Changes
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
};

export default WarehouseAccessoriesPage;
