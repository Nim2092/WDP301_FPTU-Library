import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import axios from "axios";

// Register necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function MonthlyOrderChart() {
    const [chartData, setChartData] = useState({ labels: [], datasets: [] });

    useEffect(() => {
        axios.get("http://localhost:9999/api/orders/chart-order-by-month")
            .then((res) => {
                const monthlyData = res.data.data;

                const labels = monthlyData.map((item) => `Month ${item.month}`);
                const statuses = Array.from(new Set(monthlyData.flatMap((item) => item.statuses.map((status) => status.status))));

                const datasets = statuses.map((status) => ({
                    label: status,
                    data: monthlyData.map((month) => {
                        const statusData = month.statuses.find((s) => s.status === status);
                        return statusData ? statusData.count : 0;
                    }),
                    backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.6)`,
                    borderColor: "rgba(75, 192, 192, 1)",
                    borderWidth: 1,
                }));

                setChartData({ labels, datasets });
            })
            .catch((error) => {
                console.error("Error fetching monthly order stats:", error);
            });
    }, []);

    const options = {
        responsive: true,
        plugins: {
            legend: { display: true, position: "top" },
            title: { display: true, text: "Monthly Order Statistics" },
        },
        scales: {
            x: { title: { display: true, text: "Month" } },
            y: { title: { display: true, text: "Order Count" }, beginAtZero: true },
        },
    };

    return <Bar data={chartData} options={options} />;
}

export default MonthlyOrderChart;
