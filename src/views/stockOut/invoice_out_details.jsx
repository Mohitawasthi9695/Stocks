import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Papa from 'papaparse';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { FaFileCsv } from 'react-icons/fa';
import { AiOutlineFilePdf } from 'react-icons/ai';
import { color } from 'd3';

const ShowProduct = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  useEffect(() => {
    const fetchStocksData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/godownstockout/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        console.log(response.data.data.stock_out_details);
        if (!response.data.data || !response.data.data.stock_out_details) {
          console.error('Invalid response structure');
          return;
        }

        const flattenedData = response.data.data.stock_out_details.map((detail, index) => ({
          sr_no: index + 1,
          invoice_no: response.data.data.invoice_no,
          date: response.data.data.date,
          customer: response.data.data.customer,
          company: response.data.data.company,
          place_of_supply: response.data.data.place_of_supply,
          vehicle_no: response.data.data.vehicle_no,
          station: response.data.data.station,
          ewaybill: response.data.data.ewaybill,
          transport: response.data.data.transport,
          gr_rr: response.data.data.gr_rr,
          payment_mode: response.data.data.payment_mode,
          payment_status: response.data.data.payment_status,
          payment_date: response.data.data.payment_date,
          stock_code: detail.stock_code || 'N/A',
          shadeNo: detail.product_shadeNo || 'N/A',
          pur_shade_no: detail.product_purchase_shade_no || 'N/A',
          product_name: detail.product_name || 'N/A',
          godown_supervisor: detail.godown_supervisor || 'N/A',
          product_category: detail.product_category || 'N/A',
          length: detail.length_unit === 'in' ? parseFloat(detail.length) * 39.3701 : parseFloat(detail.length),
          width: detail.width_unit === 'in' ? parseFloat(detail.width) * 39.3701 : parseFloat(detail.width),
          unit: detail.length_unit || 'meter',
          qty: detail.out_pcs || 'N/A',
          amount: detail.amount || 'N/A',
          status: detail.status,
          area: (parseFloat(detail.length) * parseFloat(detail.width) * parseFloat(detail.out_pcs) || 0).toFixed(3),
          area_sq_ft: (parseFloat(detail.length) * parseFloat(detail.width) * parseFloat(detail.out_pcs) * 10.7639 || 0).toFixed(3)
        }));

        setProducts(flattenedData);
        setFilteredProducts(flattenedData);
      } catch (error) {
        console.error('Error fetching stocks data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStocksData();
  }, []);

  useEffect(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = products.filter((product) =>
      ['width', 'length', 'invoice_no', 'lot_no']
        .map((key) => product[key]?.toString()?.toLowerCase() || '')
        .some((value) => value.includes(lowercasedQuery))
    );
    setFilteredProducts(filtered);
  }, [searchQuery, products]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const columns = [
    { name: 'Sr No', selector: (row) => row.sr_no, sortable: true },
    { name: 'Invoice No', selector: (row) => row.invoice_no, sortable: true },
    { name: 'Date', selector: (row) => row.date, sortable: true },
    { name: 'Customer', selector: (row) => row.customer, sortable: true },
    { name: 'Company', selector: (row) => row.company, sortable: true },
    { name: 'Place of Supply', selector: (row) => row.place_of_supply, sortable: true },
    { name: 'Godown Supervisor', selector: (row) => row.godown_supervisor, sortable: true },
    { name: 'Stock Code', selector: (row) => row.stock_code, sortable: true },
    { name: 'Shade No', selector: (row) => row.shadeNo, sortable: true },
    { name: 'Product Name', selector: (row) => row.product_name, sortable: true },
    { name: 'Product Category', selector: (row) => row.product_category, sortable: true },
    { name: 'Length', selector: (row) => row.length.toFixed(2), sortable: true },
    { name: 'Width', selector: (row) => row.width.toFixed(2), sortable: true },
    { name: 'Quantity', selector: (row) => row.qty, sortable: true },
    { name: 'Area (m²)', selector: (row) => row.area, sortable: true },
    { name: 'Area (sq. ft.)', selector: (row) => row.area_sq_ft, sortable: true },
    { name: 'Amount', selector: (row) => row.amount, sortable: true },
    {
      name: 'Status',
      selector: (row) => row.status,
      sortable: true,
      cell: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span
            className={`badge ${row.status == 1 ? 'bg-success' : row.status === 2 ? 'bg-warning' : 'bg-danger'
              }`}
            style={{
              padding: '5px 10px',
              borderRadius: '8px',
              whiteSpace: 'nowrap',
            }}
          >
            {row.status == 1 ? 'Approved' : row.status === 2 ? 'Rejected' : 'Pending'}
          </span>

        </div>
      )
    }




  ];

  const exportToCSV = () => {
    const csv = Papa.unparse(filteredProducts);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'stocks_list.csv');
  };

  const exportToPDF = () => {
    const doc = new jsPDF({
      orientation: "landscape", // Landscape mode to fit more columns
      unit: "mm",
      format: "a4",
    });

    doc.text("Stock Out Report", 14, 10);

    // Extract headers (column names)
    const headers = columns.map(col => col.name);

    // Extract row data (each row's values in correct order)
    const data = filteredProducts.map(row =>
      columns.map(col => {
        if (typeof col.selector === "function") {
          if (col.name === "Status") {
            return row.status === 1 ? "Approved" : "Pending"; // ✅ Fix status mapping
          }
          return col.selector(row) || "N/A";
        }
        return row[col.selector] || "N/A";
      })
    );

    doc.autoTable({
      head: [headers], // Column headers
      body: data, // Row data
      startY: 20,
      styles: { fontSize: 7, cellPadding: 2, lineWidth: 0.1 }, // Smaller font for better fit
      headStyles: { fillColor: [52, 152, 219], textColor: 255, fontSize: 8, lineWidth: 0.2 },
      bodyStyles: { textColor: 50, lineWidth: 0.2 },
      alternateRowStyles: { fillColor: [240, 240, 240] },
      columnStyles: { 0: { halign: "center" } }, // Center align first column
      theme: "grid", // Ensures row & column lines
      margin: { top: 15, left: 5, right: 5 }, // Adjust margins
      tableWidth: "auto", // Auto-adjust columns to fit
      didDrawPage: function (data) {
        doc.text(`Page ${doc.internal.getNumberOfPages()}`, 280, 200);
      },
    });

    doc.save("stocks_list.pdf");
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
            className="form-control"
            style={{ borderRadius: '5px' }}
          />
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <div className="card border-0 shadow-none" style={{ background: '#f5f0e6' }}>
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
              <div className="card-body p-0">
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
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowProduct;
