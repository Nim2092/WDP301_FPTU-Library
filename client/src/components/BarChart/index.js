import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import axios from "axios";
// Đăng ký các thành phần cần thiết
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function BarChart({ title, data, xAxisLabel, yAxisLabel }) {
    const [orders, setOrders] = useState([]);
    useEffect(() => {
        axios.get("http://localhost:9999/api/orders/getAll")
            .then(res => {
                setOrders(res.data.data);
            })
            .catch(err => {
                console.log(err);
            })
    }, []);

    const chartData = {
        labels: data.map((item) => item.name), // Tên cột trục X
        datasets: [
            {
                label: title,
                data: data.map((item) => item.value), // Giá trị tương ứng
                backgroundColor: "rgba(75, 192, 192, 0.6)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
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

    return <Bar data={chartData} options={options} />;
}

export default BarChart;
