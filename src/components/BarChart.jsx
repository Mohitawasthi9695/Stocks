
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const BarChartData = () => {
  const [barData, setBarData] = useState([]); // State to hold bar chart data
  const [loading, setLoading] = useState(true); // State for loading status

  useEffect(() => {
    const fetchGraphData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/barData`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        });
        setBarData(response.data.data); // Bind the API response to the barData state
      } catch (error) {
        console.error('Error fetching bar chart data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGraphData();
  }, []);

  // Render a loading message while data is being fetched
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h3 className="text-center pt-3 fw-bold">
      
          STOCK SALES
        
      </h3>
      <BarChart width={380} height={400} data={barData}>
          <defs>
            <linearGradient id="stockInGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1aff1a" stopOpacity={1} />
              <stop offset="100%" stopColor="#003300" stopOpacity={1} />
            </linearGradient>
            <linearGradient id="stockOutGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ff416c" stopOpacity={1} />
              <stop offset="100%" stopColor="#ff4b2b" stopOpacity={1} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="product_name" />
          <YAxis />
          <Tooltip
            formatter={(value, name, props) => {
              const category = props.payload?.category || 'N/A';
              return [`${value} (${category})`, name];
            }}
          />
          <Bar dataKey="stock_in" fill="url(#stockInGradient)" />
          <Bar dataKey="stock_out" fill="url(#stockOutGradient)" />
      </BarChart>
    </div>
  );
};

export default BarChartData;
