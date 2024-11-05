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
    axios.get("https://fptu-library.xyz/api/fines/chart-fines-by-month")
      .then((response) => {
        const monthlyData = response.data.data;

        // Process data for the chart
        const labels = monthlyData.map((item) => `Month ${item.month}`);
        const data = monthlyData.map((item) => item.totalFinesAmount);

        setChartData({
          labels,
          datasets: [
            {
              label: "Total Fines Amount",
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
    axios.get("https://fptu-library.xyz/api/fines/getAll")
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
        text: "Fines by Month",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Month",
        },
      },
      y: {
        title: {
          display: true,
          text: "Total Fines Amount",
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div>
      <p>Total Fines: {totalFines}</p>
      <Line data={chartData} options={options} />
    </div>
  );
}

export default FinesByMonthChart;
