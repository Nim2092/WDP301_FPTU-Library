import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Card, Container, Button } from "react-bootstrap";
import AuthContext from "../../contexts/UserContext";

// Add this utility function at the top of your file
function formatCurrency(amount) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
}

function Fines() {

  const { user } = useContext(AuthContext);
  const [fines, setFines] = useState([]);
  const [selectedFines, setSelectedFines] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [transactionCode, setTransactionCode] = useState('');

  useEffect(() => {
    const transactionCode = `TX${Date.now()}${Math.random().toString(36).substring(2)}`;
    setTransactionCode(transactionCode);
  }, []);

  useEffect(() => {
    axios.get(`http://localhost:9999/api/fines/by-user/${user.id}`)
      .then((response) => {
        setFines(response.data.data); // Set fines data
      })
      .catch((error) => {
        console.error("Error fetching fines:", error);
      });
  }, []);

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedFines([]);
    } else {
      setSelectedFines(fines.map(fine => fine._id));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectFine = (fineId) => {
    if (selectedFines.includes(fineId)) {
      setSelectedFines(selectedFines.filter(id => id !== fineId));
    } else {
      setSelectedFines([...selectedFines, fineId]);
    }
  };

  return (
    <Container className="mt-5">
      {fines.length > 0 ? (
        <table className="table table-striped table-hover border">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                />
              </th>
              <th>Created By</th>
              <th>Reason</th>
              <th>Total Fine Amount</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {fines.map((fine) => (
              <tr key={fine._id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedFines.includes(fine._id)}
                    onChange={() => handleSelectFine(fine._id)}
                  />
                </td>
                <td>{fine.createBy.fullName}</td>
                <td>{fine.reason || fine.fineReason_id.reasonName}</td>
                <td>{formatCurrency(fine.totalFinesAmount)}</td>
                <td>
                  <Button variant="primary">Pay</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Loading fines...</p>
      )}
    </Container>
  );
}

export default Fines;
