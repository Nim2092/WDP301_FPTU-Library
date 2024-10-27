import React from "react";
import BarChart from "../../components/BarChart";
import LineChart from "../../components/LineChart";
function Chart() {


    return (
        <div className="container mt-5">
            <div>
                <h2>Number of orders status by month</h2>
                <BarChart />
            </div>
            <div className="mt-5">
                <h2>Number of fines over time</h2>
                <LineChart />
            </div>
        </div>
    );
}

export default Chart;
