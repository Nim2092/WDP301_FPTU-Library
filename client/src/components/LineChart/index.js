import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

// Đăng ký các thành phần cần thiết cho biểu đồ đường
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function LineChart({ title, data, xAxisLabel, yAxisLabel }) {
  const chartData = {
    labels: data.map((item) => item.name), // Mốc thời gian hoặc tên nhãn trục X
    datasets: [
      {
        label: title,
        data: data.map((item) => item.value), // Giá trị của các vi phạm
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.4, // Độ cong của đường
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      title: {
        display: true,
        text: title,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: xAxisLabel,
        },
      },
      y: {
        title: {
          display: true,
          text: yAxisLabel,
        },
        beginAtZero: true,
      },
    },
  };

  return <Line data={chartData} options={options} />;
}

export default LineChart;
