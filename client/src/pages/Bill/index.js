import axios from "axios";
import { useEffect, useState } from "react";

function Bill (){
    const [bills, setBills] = useState([]);
    useEffect(() => {
        axios.get(`http://localhost:9999/api/bill`)
        .then(res => {
            setBills(res.data);
        })
        .catch(err => {
            console.log(err);
        })
    }, []);
    
    return (
        <div className="container">
                
        </div>
    )
}

export default Bill;