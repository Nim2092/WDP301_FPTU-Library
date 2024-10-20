import { useState, useEffect } from "react";
import axios from "axios";
import { Card, Container } from "react-bootstrap";

function Fines() {
  // const [userId, setUserId] = useState("");
  const [fines, setFines] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:9999/api/fines/by-user/670bda6de2f01f73e5ef392b`)
      .then((response) => {
        setFines(response.data.data); // Set fines data
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching fines:", error);
      });
  }, []);

  return (
    <Container className="mt-5">
      {fines.length > 0 ? (
        fines.map((fine) => (
          <Card key={fine._id} className="mb-3">
            <Card.Header>
              <p><strong>Fines</strong></p>
            </Card.Header>
            <Card.Body>
              <p><strong>Created By:</strong> {fine.createBy.fullName}</p>
              <p><strong>Reason:</strong> {fine.fineReason_id.reasonName}</p>
              <p><strong>Penalty Amount:</strong> {fine.fineReason_id.penaltyAmount} VND</p>
              <p><strong>Total Fine Amount:</strong> {fine.totalFinesAmount} VND</p>
              {/* <p><strong>Payment Method:</strong> {fine.paymentMethod}</p> */}
              {/* <p><strong>Payment Date:</strong> {new Date(fine.paymentDate).toLocaleDateString()}</p> */}
            </Card.Body>
          </Card>
        ))
      ) : (
        <p>Loading fines...</p>
      )}
    </Container>
  );
}

export default Fines;
