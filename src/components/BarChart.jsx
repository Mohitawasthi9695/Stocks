import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const BarChartData = () => {
  const [barData, setBarData] = useState([]); // State to hold bar chart data
  const [loading, setLoading] = useState(true); // State for loading status
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 375);

  useEffect(() => {
    const fetchGraphData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/barData`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        });
        setBarData(response.data.data); 
      } catch (error) {
        console.error('Error fetching bar chart data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGraphData();
  


  const handleResize = () => {
    setIsMobile(window.innerWidth <= 375);
  };

  window.addEventListener('resize', handleResize);

  return () => {
    window.removeEventListener('resize', handleResize);
  };
}, []);

  // Render a loading message while data is being fetched
  if (loading) {
    return <div>Loading...</div>;
  }
  

  return (
    <div>
      <h3 className="text-center" style={{
        paddingTop: '20px',
      }}>STOCK SALES</h3>
      <BarChart width={isMobile ? 300 : 450} height={400} data={barData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="shadeNo" /> 
        <YAxis />
        <Tooltip
          formatter={(value, name, props) => {
            const shadeNo = props.payload?.product_purchase_shade_no || 'N/A';
            return [`${value} (${shadeNo})`, name];
          }}
        />
        <Tooltip />
        <Bar dataKey="stock_in" fill="#8884d8" /> 
        <Bar dataKey="stock_out" fill="#82ca9d" />
      </BarChart>
    </div>
  );
};

export default BarChartData;

