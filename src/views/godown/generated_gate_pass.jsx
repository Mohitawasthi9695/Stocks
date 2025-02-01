// import React, { useEffect, useState } from 'react';
// import DataTable from 'react-data-table-component';
// import { Button, Modal, Form } from 'react-bootstrap';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { MdEdit, MdDelete, MdPersonAdd, MdPlusOne, MdAdd, MdPrint } from 'react-icons/md';
// import { FaEye } from 'react-icons/fa';
// import { toast } from 'react-toastify';
// import Skeleton from 'react-loading-skeleton';
// import 'react-loading-skeleton/dist/skeleton.css';
// import GatePass from 'components/PdfPreview';
// import { AiOutlineFilePdf } from 'react-icons/ai';
// import Swal from 'sweetalert2';
// import * as XLSX from 'xlsx';
// import { saveAs } from 'file-saver';
// import {FaFileExcel } from 'react-icons/fa';

// const Index = () => {
//   const [invoices, setInvoices] = useState([]);
//   const [filteredInvoices, setFilteredInvoices] = useState([]);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [invoiceAllDetails, setInvoiceAllDetails] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedInvoice, setSelectedInvoice] = useState(null);
//   const [showPdfModal, setShowPdfModal] = useState(false);
//   useEffect(() => {
//     const fetchInvoices = async () => {
//       try {
//         const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/godowns/getStockgatepass`, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`,
//             'Content-Type': 'application/json'
//           }
//         });
//         const invoicesDetails = response.data.data;
//         console.log(invoicesDetails);
//         setInvoiceAllDetails(invoicesDetails);
//         const filteredFields = invoicesDetails.map((gatepass) => ({
//           gatepass_no: gatepass.gate_pass_no,
//           id: gatepass.id,
//           godownSupervisor: gatepass.godown_supervisors.name,
//           warehouseSupervisor: gatepass.warehouse_supervisors.name,
//           date: gatepass.gate_pass_date,
//           total_amount: gatepass.total_amount,
//         }));
//         setInvoices(filteredFields);
//         setFilteredInvoices(filteredFields);
//       } catch (error) {
//         console.error(error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchInvoices();
//   }, []);

//   useEffect(() => {
//     const lowercasedQuery = searchQuery.toLowerCase();
//     const filtered = invoices.filter((invoice) => invoice.godownSupervisor.toLowerCase().includes(lowercasedQuery));
//     setFilteredInvoices(filtered);
//   }, [searchQuery, invoices]);

//   const handleSearch = (e) => {
//     setSearchQuery(e.target.value);
//   };

//   const navigate = useNavigate();

//   const columns = [
//     {
//       name: 'Invoice Number',
//       selector: (row) => row.gatepass_no,
//       sortable: true
//     },
//     {
//       name: 'Godown Supervisor Name',
//       selector: (row) => row.godownSupervisor,
//       sortable: true
//     },
//     {
//       name: 'WareHouser Supervisor',
//       selector: (row) => row.warehouseSupervisor,
//       sortable: true
//     },
//     {
//       name: 'Date',
//       selector: (row) => row.date,
//       sortable: true
//     },
//     {
//       name: 'Status',
//       selector: (row) => (row.status === 1 ? 'inactive' : 'active'),
//       sortable: true,
//       cell: (row) => (
//         <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
//           <span
//             className={`badge ${row.status === 1 ? 'bg-success' : 'bg-danger'}`}
//             style={{
//               padding: '5px 10px',
//               borderRadius: '8px',
//               whiteSpace: 'nowrap'
//             }}
//           >
//             {row.status === 1 ? 'Approved' : 'Pending'}
//           </span>
//         </div>
//       )
//     },
//     {
//       name: 'Action',
//       cell: (row) => (
//         <div className="d-flex" style={{ flexWrap: 'nowrap', gap: '8px', justifyContent: 'space-evenly', alignItems: 'center' }}>
//           <Button
//             variant="outline-warning"
//             size="sm"
//             className="me-2"
//             onClick={() => navigate(`/add-product/${row.id}/${row.gatepass_no}`)}
//           >
//             <MdAdd />
//           </Button>
//           <Button variant="outline-success" size="sm" className="me-2">
//             <FaEye onClick={() => navigate(`/show-product/${row.id}`)} />
//           </Button>
//           <Button
//             variant="outline-primary"
//             size="sm"
//             onClick={() => {
//               setSelectedInvoice(row.id);
//               setShowPdfModal(true);
//             }}
//           >
//             <Button  size="sm" onClick={() => handlePrint(row)}>
//             <MdPrint />
//           </Button>
//           </Button>
//           <Button variant="outline-info" size="sm" onClick={() => exportToExcel(row)}>
//             <FaFileExcel />
//           </Button>
//           <Button variant="outline-danger" size="sm" onClick={() => handleDelete(row.id)}>
//             <MdDelete />
//           </Button>
//         </div>
//       ),
//       width: '340px' 
//     }
//   ];
//   const handlePrint = (row) => {
//     const printWindow = window.open('', '', 'width=800,height=600');
//     printWindow.document.write(`
//       <html>
//       <head>
//         <title>Print Invoice</title>
//         <style>
//           body { font-family: Arial, sans-serif; padding: 20px; }
//           h2 { text-align: center; }
//           table { width: 100%; border-collapse: collapse; margin-top: 10px; }
//           th, td { border: 1px solid black; padding: 8px; text-align: left; }
//         </style>
//       </head>
//       <body>
//         <h2>Invoice Details</h2>
//         <table>
//           <tr><th>Invoice Number</th><td>${row.gatepass_no}</td></tr>
//           <tr><th>Godown Supervisor</th><td>${row.godownSupervisor}</td></tr>
//           <tr><th>Warehouse Supervisor</th><td>${row.warehouseSupervisor}</td></tr>
//           <tr><th>Date</th><td>${row.date}</td></tr>
//           <tr><th>Total Amount</th><td>${row.total_amount}</td></tr>
//           <tr><th>Product Category</th><td>${row.product_category}</td></tr>
//           <tr><th>Product Shade No</th><td>${row.product_shadeNo}</td></tr>
          
//         </table>
//         <script>
//           window.onload = function() { window.print(); window.close(); }
//         </script>
//       </body>
//       </html>
//     `);
//     printWindow.document.close();
//   };
  

//   const handleDelete = async (id) => {
//     try {
//       const result = await Swal.fire({
//         title: 'Are you sure?',
//         text: "You won't be able to revert this!",
//         icon: 'warning',
//         showCancelButton: true,
//         confirmButtonColor: '#3085d6',
//         cancelButtonColor: '#d33',
//         confirmButtonText: 'Yes, delete it!'
//       });

//       if (result.isConfirmed) {
//         await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/godowns/gatepass/${id}`, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`
//           }
//         });

//         setInvoices((prevInvoices) => prevInvoices.filter((invoice) => invoice.id !== id));
//         setFilteredInvoices((prevFilteredInvoices) => prevFilteredInvoices.filter((invoice) => invoice.id !== id));
//         Swal.fire('Deleted!', 'The Invoice has been deleted.', 'success');
//       }
//     } catch (error) {
//       console.error('Error deleting invoice:', error);
//       Swal.fire('Error!', 'There was a problem deleting the Invoice.', 'error');
//     }
//   };

//   const handleAddInvoice = () => {
//     navigate('/add-invoice');
//   };

//   const customStyles = {
//     table: {
//       style: {
//         borderCollapse: 'separate',
//         borderSpacing: 0
//       }
//     },
//     header: {
//       style: {
//         backgroundColor: '#2E8B57',
//         color: '#fff',
//         fontSize: '18px',
//         fontWeight: 'bold',
//         padding: '15px',
//         borderRadius: '8px 8px 0 0' // Adjusted to only affect top corners
//       }
//     },
//     rows: {
//       style: {
//         backgroundColor: '#f0fff4',
//         borderBottom: '1px solid #e0e0e0',
//         transition: 'background-color 0.3s ease',
//         '&:hover': {
//           backgroundColor: '#e6f4ea',
//           boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
//         }
//       }
//     },
//     headCells: {
//       style: {
//         backgroundColor: '#20B2AA',
//         color: '#fff',
//         fontSize: '12px',
//         fontWeight: 'bold',
//         textTransform: 'uppercase',
//         padding: '15px',
//         borderRight: '1px solid #e0e0e0' // Vertical lines between header cells
//       },
//       lastCell: {
//         style: {
//           borderRight: 'none' // Removes border for the last cell
//         }
//       }
//     },
//     cells: {
//       style: {
//         fontSize: '14px',
//         color: '#333',
//         padding: '12px',
//         borderRight: '1px solid grey' // Vertical lines between cells
//       }
//     },
//     pagination: {
//       style: {
//         backgroundColor: '#3f4d67',
//         color: '#fff',
//         borderRadius: '0 0 8px 8px'
//       },
//       pageButtonsStyle: {
//         backgroundColor: 'transparent',
//         color: 'black',
//         border: 'none',
//         '&:hover': {
//           backgroundColor: 'rgba(255,255,255,0.2)'
//         },
//         '& svg': {
//           fill: 'white'
//         },
//         '&:focus': {
//           outline: 'none',
//           boxShadow: '0 0 5px rgba(255,255,255,0.5)'
//         }
//       }
//     }
//   };

//   // Export data to Excel
//   const exportToExcel = (row) => {
//     const data = [{
//       'Invoice Number': row.gatepass_no,
//       'Godown Supervisor Name': row.godownSupervisor,
//       'Warehouse Supervisor': row.warehouseSupervisor,
//       'Date': row.date,
//       'Status': row.status === 1 ? 'Approved' : 'Pending',
//       'Total Amount': row.total_amount // Added total items/amount
//     }];
  
//     const ws = XLSX.utils.json_to_sheet(data);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, 'Invoice');
//     const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
//     const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });
//     saveAs(blob, `${row.gatepass_no}-Invoice.xlsx`);
//   };
  
  

//   // Helper function to convert string to array buffer
//   function s2ab(s) {
//     const buf = new ArrayBuffer(s.length);
//     const view = new Uint8Array(buf);
//     for (let i = 0; i < s.length; i++) {
//       view[i] = s.charCodeAt(i) & 0xff;
//     }
//     return buf;
//   }

//   return (
//     <div className="container-fluid pt-4" style={{ border: '3px dashed #14ab7f', borderRadius: '8px', background: '#ff9d0014' }}>
//       <div className="row mb-3">
//         <div className="col-md-4">
//           <input
//             type="text"
//             placeholder="Search..."
//             id="search"
//             value={searchQuery}
//             onChange={handleSearch}
//             className="pe-5 ps-2 py-2"
//             style={{ borderRadius: '5px' }}
//           />
//         </div>
//         <div className="col-md-8 text-end">
//           <Button variant="primary" onClick={handleAddInvoice}>
//             <MdPersonAdd className="me-2" /> Add Invoice
//           </Button>
//         </div>
//       </div>
//       <div className="row">
//         <div className="col-12">
//           <div className="card border-0 shadow-none" style={{ background: '#f5f0e6' }}>
//             {loading ? (
//               <div>
//                 {[...Array(8)].map((_, index) => (
//                   <div key={index} style={{ display: 'flex', gap: '10px', padding: '10px' }}>
//                     <Skeleton width={50} height={20} />
//                     <Skeleton width={200} height={20} />
//                     <Skeleton width={200} height={20} />
//                     <Skeleton width={200} height={20} />
//                     <Skeleton width={200} height={20} />
//                     <Skeleton width={200} height={20} />
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div className="card-body p-0" style={{ backgroundColor: '#fff' }}>
//                 {/* <div className="card-header" style={{ background: 'transparent' }}>
//                   <div className="card-title">
//                     <h4 style={{ fontWeight: 'bold' }}>Invoices</h4>
//                   </div>
//                 </div> */}
//                 <DataTable
//                   columns={columns}
//                   data={filteredInvoices}
//                   pagination
//                   highlightOnHover
//                   striped
//                   responsive
//                   customStyles={customStyles}
//                 />
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Index;



import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Button, Modal, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MdEdit, MdDelete, MdPersonAdd, MdPlusOne, MdAdd, MdPrint } from 'react-icons/md';
import { FaEye } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import GatePass from 'components/PdfPreview';
import { AiOutlineFilePdf } from 'react-icons/ai';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { FaFileExcel } from 'react-icons/fa';
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const Index = () => {
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [invoiceAllDetails, setInvoiceAllDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showPdfModal, setShowPdfModal] = useState(false);
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/godowns/getStockgatepass`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        const invoicesDetails = response.data.data;
        console.log(invoicesDetails);
        setInvoiceAllDetails(invoicesDetails);
        const filteredFields = invoicesDetails.map((gatepass) => ({
          gatepass_no: gatepass.gate_pass_no,
          id: gatepass.id,
          godownSupervisor: gatepass.godown_supervisors.name,
          warehouseSupervisor: gatepass.warehouse_supervisors.name,
          date: gatepass.gate_pass_date,
          total_amount: gatepass.total_amount
        }));
        setInvoices(filteredFields);
        setFilteredInvoices(filteredFields);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, []);

  useEffect(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = invoices.filter((invoice) => invoice.godownSupervisor.toLowerCase().includes(lowercasedQuery));
    setFilteredInvoices(filtered);
  }, [searchQuery, invoices]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // handle download pdf
  const downloadRowAsPDF = (row) => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("User Information", 14, 15);

    doc.autoTable({
      startY: 25,
      head: [["Invoice Number", "Godown Supervisor Name", "WareHouser Supervisor", "Date"]],
      body: [[row.gatepass_no ,row.godownSupervisor, row.warehouseSupervisor, row.date]],
    });

    doc.save(`User_${row.name}.pdf`);
  };

  const navigate = useNavigate();

  const columns = [
    {
      name: 'Invoice Number',
      selector: (row) => row.gatepass_no,
      sortable: true
    },
    {
      name: 'Godown Supervisor Name',
      selector: (row) => row.godownSupervisor,
      sortable: true
    },
    {
      name: 'WareHouser Supervisor',
      selector: (row) => row.warehouseSupervisor,
      sortable: true
    },
    {
      name: 'Date',
      selector: (row) => row.date,
      sortable: true
    },
    {
      name: 'Status',
      selector: (row) => (row.status === 1 ? 'inactive' : 'active'),
      sortable: true,
      cell: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span
            className={`badge ${row.status === 1 ? 'bg-success' : 'bg-danger'}`}
            style={{
              padding: '5px 10px',
              borderRadius: '8px',
              whiteSpace: 'nowrap'
            }}
          >
            {row.status === 1 ? 'Approved' : 'Pending'}
          </span>
        </div>
      )
    },
    {
      name: 'Action',
      cell: (row) => (
        <div className="d-flex" style={{ flexWrap: 'nowrap', gap: '8px', justifyContent: 'space-evenly', alignItems: 'center' }}>
          <Button variant="outline-success" size="sm" className="me-2">
            <FaEye onClick={() => navigate(`/show-gatepass_details/${row.id}`)} />
          </Button>
          
          <Button variant="outline-secondary" size="sm" onClick={() => handlePrint(row)}>
        <MdPrint />
      </Button>

          <Button variant="outline-info" size="sm" onClick={() => downloadExcel(row)}>
            <FaFileExcel />
          </Button>
          <Button variant="outline-danger" size="sm" onClick={() => handleDelete(row.id)}>
            <MdDelete />
          </Button>
        </div>
      ),
      width: '300px'
    }
  ];
  const handlePrint = (row) => {
    // Find the full invoice details from invoiceAllDetails using the row id
    const fullInvoice = invoiceAllDetails.find(invoice => invoice.id === row.id);
  
    if (!fullInvoice || !fullInvoice.godowns) {
      console.error("Godown data not found for this row:", row);
      return;
    }
  
    // Create the content for the print view
    let printContent = `
      <html>
        <head>
          <title>Gate Pass ${row.gatepass_no}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { border: 1px solid black; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <h2>Gate Pass Details</h2>
          <table>
            <tr><th>Invoice Number</th><td>${row.gatepass_no}</td></tr>
            <tr><th>Godown Supervisor</th><td>${row.godownSupervisor}</td></tr>
            <tr><th>Warehouse Supervisor</th><td>${row.warehouseSupervisor}</td></tr>
            <tr><th>Date</th><td>${row.date}</td></tr>
          </table>
          <h3>Items:</h3>
          <table>
            <thead>
              <tr>
                <th>Product Type</th>
                <th>Lot No</th>
                <th>Stock Code</th>
                <th>Width</th>
                <th>Length</th>
                <th>Available Height</th>
                <th>Available Width</th>
                <th>Quantity</th>
                <th>Supervisor</th>
              </tr>
            </thead>
            <tbody>
    `;
  
    // Loop through godowns and print the full data for Excel
    fullInvoice.godowns.forEach((godown) => {
      printContent += `
        <tr>
          <td>${godown.product_type}</td>
          <td>${godown.lot_no}</td>
          <td>${godown.stock_code}</td>
          <td>${godown.get_width}</td>
          <td>${godown.get_length}</td>
          <td>${godown.available_height}</td>
          <td>${godown.available_width}</td>
          <td>${godown.get_quantity}</td>
          <td>${fullInvoice.warehouse_supervisors.name}</td>
        </tr>
      `;
    });
  
    printContent += `
            </tbody>
          </table>
        </body>
      </html>
    `;
  
    // Open a new window and print the content
    const printWindow = window.open("", "_blank");
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };
  
  const handleDelete = async (id) => {
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
        await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/godowns/gatepass/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });

        setInvoices((prevInvoices) => prevInvoices.filter((invoice) => invoice.id !== id));
        setFilteredInvoices((prevFilteredInvoices) => prevFilteredInvoices.filter((invoice) => invoice.id !== id));
        Swal.fire('Deleted!', 'The Invoice has been deleted.', 'success');
      }
    } catch (error) {
      console.error('Error deleting invoice:', error);
      Swal.fire('Error!', 'There was a problem deleting the Invoice.', 'error');
    }
  };

  const handleAddInvoice = () => {
    navigate('/add-invoice');
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


  const downloadExcel = (row) => {
    // Find the full invoice details from invoiceAllDetails
    const fullInvoice = invoiceAllDetails.find(invoice => invoice.id === row.id);
  
    if (!fullInvoice || !fullInvoice.godowns) {
      console.error("Godown data not found for this row:", row);
      return;
    }
  
    // Extract required data
    const extractedData = fullInvoice.godowns.map((godown) => ({
      GatePassNo: fullInvoice.gate_pass_no,   // Displayed in table
      Date: fullInvoice.gate_pass_date,       // Displayed in table
      ProductType: godown.product_type,       // Displayed in table
      LotNo: godown.lot_no,                   // Displayed in table
  
      // Hidden Columns (only in Excel)
      StockCode: godown.stock_code,
      Width: godown.get_width,
      Length: godown.get_length,
      AvailableHeight: godown.available_height,
      AvailableWidth: godown.available_width,
      Quantity: godown.get_quantity,
      Supervisor: fullInvoice.warehouse_supervisors.name,
    }));
  
    // Create a worksheet
    const ws = XLSX.utils.json_to_sheet(extractedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "GatePassData");
  
    // Save as an Excel file
    XLSX.writeFile(wb, `GatePass_${fullInvoice.gate_pass_no}.xlsx`);
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
        <div className="col-md-8 text-end">
          <Button variant="primary" onClick={handleAddInvoice}>
            <MdPersonAdd className="me-2" /> Add Invoice
          </Button>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <div className="card border-0 shadow-none" style={{ background: '#f5f0e6' }}>
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
              <div className="card-body p-0" style={{ backgroundColor: '#fff' }}>
                {/* <div className="card-header" style={{ background: 'transparent' }}>
                  <div className="card-title">
                    <h4 style={{ fontWeight: 'bold' }}>Invoices</h4>
                  </div>
                </div> */}
                <DataTable
                  columns={columns}
                  data={filteredInvoices}
                  pagination
                  highlightOnHover
                  striped
                  responsive
                  customStyles={customStyles}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      {showPdfModal && selectedInvoice && (
      <GatePass
        invoiceData={selectedInvoice} // Pass the full row data
        onClose={() => setShowPdfModal(false)}
      />
    )};
    </div>
  );
};

export default Index;
