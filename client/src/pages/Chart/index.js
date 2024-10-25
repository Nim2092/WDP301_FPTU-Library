import React from "react";
import BarChart from "../../components/BarChart";
import LineChart from "../../components/LineChart";
function Chart() {
    return (
        <div className="container mt-5">
            <div>
                <h2>Number of orders over time</h2>
                <BarChart
                    title="Number of orders"
                    data={[
                        { name: "January", value: 10 },
                        { name: "February", value: 20 },
                        { name: "March", value: 15 },
                        { name: "April", value: 25 },
                        { name: "May", value: 30 },
                        { name: "June", value: 35 },
                        { name: "July", value: 40 },
                        { name: "August", value: 45 },
                        { name: "September", value: 50 },
                        { name: "October", value: 55 },
                    ]}
                    xAxisLabel="Month"
                    yAxisLabel="Number of orders"
                />
            </div>
            <div className="mt-5">
                <h2>Number of fines over time</h2>
                <LineChart
                    title="Number of fines over time"
                    data={[
                        { name: "January", value: 30 },
                        { name: "February", value: 45 },
                        { name: "March", value: 35 },
                        { name: "April", value: 50 },
                        { name: "May", value: 60 },
                        { name: "June", value: 70 },
                        { name: "July", value: 80 },
                        { name: "August", value: 90 },
                        { name: "September", value: 100 },
                        { name: "October", value: 110 },
                    ]}
                    xAxisLabel="Month"
                    yAxisLabel="Number of fines"
                />
            </div>
        </div>
    );
}

export default Chart;
