import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import axios from 'axios';
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

  useEffect(() => {
    const fetchStocksData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/allstockout`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('stocks data:', response.data);

        const flattenedData = response.data.data.flatMap((invoice) =>
          invoice.stock_out_details.map((detail, index) => ({
            sr_no: index + 1,
            lot_no: detail.product.shadeNo,
            invoice_no: invoice.invoice_no,
            date: invoice.date,
            shade_no: detail.product?.shadeNo || 'N/A',
            pur_shade_no: detail.product?.purchase_shade_no || 'N/A',
            length: detail.unit === 'inches' ? detail.out_length * 39.3700 : detail.out_length,
            width: detail.unit === 'inches' ? detail.out_width * 39.3700 : detail.out_width,
            unit: detail.unit,
            qty: detail.out_quantity,
            stock_code:detail.stock_code,
            status: detail.status,
            waste: (parseFloat(detail.waste_width) * parseFloat(detail.out_length) * detail.out_quantity * 10.7639 || 0).toFixed(3),
            area: (parseFloat(detail.out_length) * parseFloat(detail.out_width) * detail.out_quantity || 0).toFixed(3), // Area in m²
            area_sq_ft: (parseFloat(detail.out_length) * parseFloat(detail.out_width) * detail.out_quantity * 10.7639 || 0).toFixed(3) // Area in sq. ft.
          }))
        );

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
    { name: 'Lot No', selector: (row) => row.lot_no, sortable: true },
    { name: 'Invoice No', selector: (row) => row.invoice_no, sortable: true },
    { name: 'Date', selector: (row) => row.date, sortable: true },
    {
      name: 'Stock Code',
      selector: (row) => `${row.shade_no}-${row.stock_code}` || 'N/A',
      sortable: true
    },
    { name: 'Shade No', selector: (row) => row.shade_no, sortable: true },
    { name: 'Pur. Shade No', selector: (row) => row.pur_shade_no, sortable: true },
    { name: 'Length', selector: (row) => Math.round(row.length), sortable: true },
    { name: 'Width', selector: (row) => Math.round(row.width), sortable: true },
    { name: 'Unit', selector: (row) => row.unit, sortable: true },
    { name: 'Area (m²)', selector: (row) => row.area, sortable: true },
    { name: 'Area (sq. ft.)', selector: (row) => row.area_sq_ft, sortable: true },
    { name: 'Wastage Area (sq. ft.)', selector: (row) => row.waste, sortable: true },
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
              whiteSpace: 'nowrap',
            }}
          >
            {row.status === 1 ? 'Approved' : 'Pending'}
          </span>
        </div>
      ),
    }
  ];

  const exportToCSV = () => {
    const csv = Papa.unparse(filteredProducts);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'stocks_list.csv');
  };
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text('stocks List', 20, 10);
    doc.autoTable({
      head: [
        [
          'Sr No',
          'Lot No',
          'Invoice No',
          'Date',
          'Shade No',
          'Pur. Shade No',
          'Length',
          'Width',
          'Unit',
          'Quantity',
          'Area (m²)',
          'Area (sq. ft.)'
        ]
      ],
      body: filteredProducts.map((row) => [
        row.sr_no,
        row.lot_no,
        row.invoice_no,
        row.date,
        row.shade_no,
        row.pur_shade_no,
        Math.round(row.length),
        Math.round(row.width),
        row.unit,
        row.qty,
        row.area,
        row.area_sq_ft
      ])
    });
    doc.save('stocks_list.pdf');
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
        '& svg': {
          fill: 'white',
        },
        '&:focus': {
          outline: 'none',
          boxShadow: '0 0 5px rgba(255,255,255,0.5)',
        },
      },
    },
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
