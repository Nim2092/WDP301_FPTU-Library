import axios from "axios";
import { useEffect, useState } from "react";

function Bill({ bookID }) {
    const [bills, setBills] = useState([]);

    useEffect(() => {
        if (bookID) {
            axios
              .get(`https://fptu-library/api/fines/by-order/671d21a5ae1bf265548bf8ba`)
              .then(res => {
                  setBills(res.data);
              })
              .catch(err => {
                  console.log(err);
              });
        }
    }, [bookID]);

    return (
        <div className="container">
            <h1>Bill</h1>
            {/* Render bill information */}
            {bills.length > 0 ? (
              bills.map((bill, index) => (
                  <div key={index}>
                      {/* Render chi tiết hoá đơn tại đây */}
                  </div>
              ))
            ) : (
              <p>No bill data available.</p>
            )}
        </div>
    );
}

export default Bill;
