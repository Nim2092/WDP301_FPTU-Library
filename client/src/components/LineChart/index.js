import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import axios from "axios";

// Register necessary components for the line chart
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function FinesByMonthChart() {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });
  const [totalFines, setTotalFines] = useState(0);

  useEffect(() => {
    // Fetch monthly fines data from the API
    axios.get("http://localhost:9999/api/fines/chart-fines-by-month")
      .then((response) => {
        const monthlyData = response.data.data;

        // Process data for the chart
        const labels = monthlyData.map((item) => `Month ${item.month}`);
        const data = monthlyData.map((item) => item.totalFinesAmount);

        setChartData({
          labels,
          datasets: [
            {
              label: "Tổng tiền phạt",
              data: data,
              borderColor: "rgba(75, 192, 192, 1)",
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              tension: 0.4,
              fill: true,
            },
          ],
        });
      })
      .catch((error) => {
        console.error("Error fetching monthly fines data:", error);
      });
  }, []);

  useEffect(() => {
    axios.get("http://localhost:9999/api/fines/getAll")
      .then((res) => {
        setTotalFines(res.data.data.length);
      });
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      title: {
        display: true,
        text: "Thống kê phạt theo tháng",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Tháng",
        },
      },
      y: {
        title: {
          display: true,
          text: "Tổng tiền phạt",
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div>
      <p>Tổng tiền phạt: {totalFines}</p>
      <Line data={chartData} options={options} />
    </div>
  );
}

export default FinesByMonthChart;
