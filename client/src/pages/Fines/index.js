import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Container, Button, Modal } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthContext from "../../contexts/UserContext";

function formatCurrency(amount) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

function Fines() {
  const { user } = useContext(AuthContext);
  const [fines, setFines] = useState([]);
  const [selectedFines, setSelectedFines] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [transactionCode, setTransactionCode] = useState("");
  const [showQRCode, setShowQRCode] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [pollingIntervalId, setPollingIntervalId] = useState(null);
  const [timeoutId, setTimeoutId] = useState(null);

  // Generate transaction code on component mount
  useEffect(() => {
    const code = `TX${Date.now()}${Math.random().toString(36).substring(2)}`;
    setTransactionCode(code);
  }, []);

  // Fetch fines on component mount
  useEffect(() => {
    axios.get(`https://fptu-library.xyz/api/fines/by-user/${user.id}`)
      .then((response) => setFines(response.data.data))
      .catch((error) => console.error("Error fetching fines:", error));
  }, [user.id]);

  // Handle select all
  const handleSelectAll = () => {
    setSelectedFines(selectAll ? [] : fines.filter(fine => fine.status !== "Paid").map(fine => fine._id));
    setSelectAll(!selectAll);
  };

  // Handle individual fine selection
  const handleSelectFine = (fineId) => {
    setSelectedFines((prevSelected) =>
      prevSelected.includes(fineId)
        ? prevSelected.filter((id) => id !== fineId)
        : [...prevSelected, fineId]
    );
  };

  // Calculate total amount and initiate payment process
  const handlePay = () => {
    const total = fines
      .filter((fine) => selectedFines.includes(fine._id))
      .reduce((sum, fine) => sum + fine.totalFinesAmount, 0);
    setTotalAmount(total);
    setShowQRCode(true);

    // Start payment polling and timeout when "Pay" is clicked
    const intervalId = setInterval(checkPayment, 5000);
    setPollingIntervalId(intervalId);

    const timeout = setTimeout(() => {
      clearInterval(intervalId);
      setShowQRCode(false);
      toast.error("Hết thời gian chờ thanh toán. Vui lòng thử lại.");
    }, 300000); // 5-minute timeout
    setTimeoutId(timeout);
  };

  // Polling function to check payment status
  const checkPayment = () => {
    axios.post(`https://fptu-library.xyz/api/fines/check-payment/${transactionCode}`, {
      fineId: selectedFines,
    })
      .then((response) => {
        if (response.data.message === "OK") {
          clearInterval(pollingIntervalId);
          clearTimeout(timeoutId);
          setShowQRCode(false);
          toast.success("Thanh toán thành công");

          // Reload the page
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }
      })
      .catch(() => {
        toast.error("Lỗi kiểm tra thanh toán, thử lại sau.");
        // console.log("Lỗi kiểm tra thanh toán, thử lại sau.");
      });
  };

  // Clean up intervals and timeouts when component unmounts or QR code modal closes
  useEffect(() => {
    return () => {
      clearInterval(pollingIntervalId);
      clearTimeout(timeoutId);
    };
  }, [pollingIntervalId, timeoutId]);

  return (
    <Container className="mt-5">
      <div className="d-flex justify-content-center">
        <h3>Fines</h3>
        <ToastContainer />
      </div>
      <Button
        className="mb-3 float-end"
        variant="primary"
        onClick={handlePay}
        disabled={selectedFines.length === 0}
      >
        Pay
      </Button>
      <Button
        className="mb-3"
        variant="secondary"
        onClick={handleSelectAll}
      >
        {selectAll ? "Deselect All" : "Select All"}
      </Button>
      {fines.length > 0 ? (
        <table className="table table-hover border">
          <thead>
            <tr>
              <th>#</th>
              <th>Created By</th>
              <th>Reason</th>
              <th>Total Fine Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {fines.map((fine) => (
              <tr key={fine._id}>
                <td>
                  {fine.status === "Pending" && (
                    <input
                      type="checkbox"
                      checked={selectedFines.includes(fine._id)}
                      onChange={() => handleSelectFine(fine._id)}
                    />
                  )}
                </td>
                <td>{fine.createBy.fullName}</td>
                <td>{fine.reason || fine.fineReason_id.reasonName}</td>
                <td>{formatCurrency(fine.totalFinesAmount)}</td>
                <td>{fine.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}
      {/* QR Code Modal */}
      <Modal show={showQRCode} onHide={() => setShowQRCode(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Scan QR code to complete payment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>Total Amount: {formatCurrency(totalAmount)}</h4>
          <img
            src={`https://img.vietqr.io/image/mbbank-0985930695-compact2.jpg?amount=${totalAmount}&addInfo=start${transactionCode}end&accountName=FPTULibrary`}
            alt="QR Code for Payment"
            className="qr-code"
            style={{ width: "100%", height: "auto" }}
          />
          <p>Scan the QR code to pay the total fine amount</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowQRCode(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default Fines;
