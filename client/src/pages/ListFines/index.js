import { useEffect, useState } from "react"; 
import axios from "axios";
import Table from "react-bootstrap/Table";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ListFines() {
    const [fines, setFines] = useState([]);
    useEffect(() => {
        // Fetch fines data from the API
        axios.get("http://localhost:9999/api/fines/getAll")
            .then((response) => {
                setFines(response.data.data);
            })
            .catch((error) => {
                toast.error("Failed to load fines data.");
                console.error("Error fetching fines:", error);
            });
    }, []);

    return (
        <div className="container mt-4">
            <ToastContainer />
            <h1>List of Fines</h1>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Book</th>
                        <th>User</th>
                        <th>Book Condition</th>
                        <th>Total Fine Amount</th>
                        <th>Status</th>
                        <th>Reason</th>

                    </tr>
                </thead>
                <tbody>
                    {fines.map((fine, index) => (
                        <tr key={fine._id}>
                            <td>{index + 1}</td>
                            <td>
                                {fine.book_id.bookSet_id.title || "N/A"}
                            </td>
                            <td>{fine.user_id.code || "N/A"}</td>
                            <td>{fine.book_id.condition || "N/A"}</td>
                            <td>{fine.totalFinesAmount || "N/A"}</td>
                            <td>{fine.status}</td>
                            <td>{fine.reason || fine.fineReason_id.reasonName}</td>

                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
}

export default ListFines;
