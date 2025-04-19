import React, { useState, useEffect } from "react";
import axios from "axios";
import { PieChart, Pie, Cell } from "recharts";

const PieChartData = () => {
  const [pieData, setPieData] = useState([]);
  const [loading, setLoading] = useState(true); // State for loading

  useEffect(() => {
    const fetchPieData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/pieData`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });

        // Transform barData to match pie chart format
        const transformedData = response.data.data.map((item) => ({
          name: item.category,
          value: item.total_stock,
        }));
        
        setPieData(transformedData);
      } catch (error) {
        console.error("Error fetching pie chart data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPieData();
  }, []);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042","#FF8072","#FF8042","#FF8062","#FF8442","#FF6042","#FF8842"];

  // Render loading message while fetching data
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h3 className="text-center pt-3 fw-bold ">STOCK IN</h3>
      <PieChart width={600} height={400}>
        <Pie
          data={pieData}
          cx="50%"
          cy="40%"
          labelLine={false}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
        >
          {pieData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </div>
  );
};

export default PieChartData;


