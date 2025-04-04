import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Button, Modal, Form } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { MdEdit, MdDelete, MdPersonAdd } from 'react-icons/md';
import { toast } from 'react-toastify';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { MdFileDownload } from 'react-icons/md';
import { FaFileCsv } from 'react-icons/fa';
import { AiOutlineFilePdf } from 'react-icons/ai';
import Papa from 'papaparse';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import 'jspdf-autotable';


const Show_product = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/stocks/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        });
        console.log(response.data);
        setProducts(response.data);
        setFilteredProducts(response.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProductData();
  }, [id]);

  useEffect(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = products.filter((product) =>
      Object.values(product).some((value) => value && value.toString().toLowerCase().includes(lowercasedQuery))
    );
    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset to first page after filtering
  }, [searchQuery, products]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const navigate = useNavigate();

  const columns = [
    { name: 'Sr No', selector: (_, index) => index + 1, sortable: true, 
    center: true,
    width: '90px' },
    { name: 'Date', selector: (row) => row.date, sortable: true,
    center: true, 
    width: '100px' },
    { name: 'Ware Code', selector: (row) => row.stock_code, sortable: true, center: true},
    { name: 'Lot No', selector: (row) => row.lot_no, sortable: true, center: true},
    { name: 'Invoice no', selector: (row) => row.invoice_no, sortable: true, center: true},
    { name: 'Product Category', selector: (row) => row.product_category_name, sortable: true, center: true },
    { name: 'Shade no', selector: (row) => row.shadeNo, sortable: true, center: true },
    { name: 'Pur. Shade no', selector: (row) => row.purchase_shade_no, sortable: true, center: true },
    { name: 'Length', selector: (row) => `${Number(row.length).toFixed(2)} ${row.length_unit}`, sortable: true, center: true },
    { name: 'Width', selector: (row) => `${Number(row.width).toFixed(2)} ${row.width_unit}`, sortable: true, center: true },
    { name: 'Pcs', selector: (row) => row.pcs, sortable: true , center: true },
    { name: 'Quantity', selector: (row) => row.quantity, sortable: true, center: true },
    {
      name: 'Action',
      center: true,
      cell: (row) => (
        <div className="d-flex">
          <Button variant="outline-danger" size="sm" onClick={() => handleDelete(row.id)}>
            <MdDelete />
          </Button>
          <Button variant="outline-success" size="sm" onClick={() => handleDownloadExcel(row)}>
            <MdFileDownload />
          </Button>
        </div>
      ),
    },
  ];

  const handleDownloadExcel = (row) => {
    const worksheet = XLSX.utils.json_to_sheet([row]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Product Data');
    XLSX.writeFile(workbook, `Product_${row.lot_no}.xlsx`);
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setShowEditModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedProduct((prevProduct) => ({ ...prevProduct, [name]: value }));
  };

  const handleUpdateProduct = async () => {
    try {
      console.log(selectedProduct);
      const response = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/stocks/${selectedProduct.id}`, selectedProduct, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      console.log(response.data);
      setProducts((prevProducts) => prevProducts.map((products) => (products.id === selectedProduct.id ? selectedProduct : products)));
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
      confirmButtonText: 'Yes, delete it!',
    });

    if (!result.isConfirmed) return;

    try {
      const response = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/stocks/${productId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
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
    const csv = Papa.unparse(filteredProducts);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'Products_list.csv');
  };

  const exportToPDF = () => {
    const doc = new jsPDF('landscape');
    doc.text('Invoice Product List', 14, 10);

    const headers = [
      ['Sr No', 'Date', 'Ware Code', 'Lot No', 'Invoice No', 'Product Category', 'Shade No', 'Pur. Shade No', 'Length', 'Width', 'Pcs', 'Quantity'],
    ];

    const body = filteredProducts.map((row, index) => [
      index + 1,
      row.date,
      row.stock_code,
      row.lot_no,
      row.invoice_no,
      row.product_category_name,
      row.shadeNo,
      row.purchase_shade_no,
      `${Number(row.length).toFixed(2)} ${row.length_unit}`,
      `${Number(row.width).toFixed(2)} ${row.width_unit}`,
      row.pcs,
      row.quantity,
    ]);

    doc.autoTable({
      head: headers,
      body: body,
      startY: 20,
      theme: 'grid',
      styles: { fontSize: 10, cellPadding: 3, valign: 'middle' },
      headStyles: { fillColor: [22, 160, 133], textColor: 255, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [238, 238, 238] },
      tableLineColor: [0, 0, 0],
      tableLineWidth: 0.2,
    });

    doc.save('Invoice_product_list.pdf');
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

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
          <div className="card rounded-lg shadow-none" style={{ background: '#f5f0e6' }}>
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
              {loading ? (
                <div>
                  {[...Array(8)].map((_, index) => (
                    <div key={index} style={{ display: 'flex', gap: '10px', padding: '10px' }}>
                      <Skeleton width={50} height={20} />
                      <Skeleton width={200} height={20} />
                      <Skeleton width={200} height={20} />
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  <DataTable
                    columns={columns}
                    data={currentItems}
                    pagination={false}
                    highlightOnHover
                    striped
                    responsive
                    customStyles={customStyles}
                    defaultSortFieldId={1}
                  />
                  <nav>
                    <ul className="pagination justify-content-center pt-3">
                      <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => paginate(currentPage - 1)}>
                          Previous
                        </button>
                      </li>
                      {Array.from({ length: totalPages }).map((_, index) => (
                        <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                          <button className="page-link" onClick={() => paginate(index + 1)}>
                            {index + 1}
                          </button>
                      </li>
                    ))}
                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                      <button className="page-link" onClick={() => paginate(currentPage + 1)}>
                        Next
                      </button>
                    </li>
                  </ul>
                </nav>
              </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Show_product;