import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Container, Button, Modal } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthContext from "../../contexts/UserContext";
import ReactPaginate from "react-paginate";

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
  const [currentPage, setCurrentPage] = useState(0);
  const [paymentSuccessful, setPaymentSuccessful] = useState(false);
  const [isSuccessToastShown, setIsSuccessToastShown] = useState(false); // New state for tracking success toast
  const finesPerPage = 10;

  useEffect(() => {
    const code = `TX${Date.now()}${Math.random().toString(36).substring(2)}`;
    setTransactionCode(code);

    const fetchFines = () => {
      axios
        .get(`https://fptu-library.xyz/api/fines/by-user/${user.id}`)
        .then((response) => setFines(response.data.data))
        .catch((error) => {
          console.error("Error fetching fines:", error.response?.data || error.message);
          toast.error("Failed to load fines. Please try again later.");
        });
    };

    fetchFines();

    const intervalId = setInterval(fetchFines, 5000);

    return () => clearInterval(intervalId);
  }, [user.id]);

  const handleSelectAll = () => {
    setSelectedFines(selectAll ? [] : fines.filter(fine => fine.status !== "Paid").map(fine => fine._id));
    setSelectAll(!selectAll);
  };

  const handleSelectFine = (fineId) => {
    setSelectedFines((prevSelected) =>
      prevSelected.includes(fineId)
        ? prevSelected.filter((id) => id !== fineId)
        : [...prevSelected, fineId]
    );
  };

  const handlePay = () => {
    setPaymentSuccessful(false);
    setIsSuccessToastShown(false); // Reset success toast state on new payment
    const total = fines
      .filter((fine) => selectedFines.includes(fine._id))
      .reduce((sum, fine) => sum + fine.totalFinesAmount, 0);
    setTotalAmount(total);
    setShowQRCode(true);

    const intervalId = setInterval(checkPayment, 5000);
    setPollingIntervalId(intervalId);

    const timeout = setTimeout(() => {
      clearInterval(intervalId);
      setShowQRCode(false);
      toast.error("Hết thời gian chờ thanh toán. Vui lòng thử lại.");
    }, 300000);
    setTimeoutId(timeout);
  };

  const checkPayment = () => {
    if (paymentSuccessful) return;

    axios
      .post(`https://fptu-library.xyz/api/fines/check-payment/${transactionCode}`, {
        fineId: selectedFines,
      })
      .then((response) => {
        if (response.data.message === "OK") {
          setPaymentSuccessful(true);
          clearInterval(pollingIntervalId);
          clearTimeout(timeoutId);
          setShowQRCode(false);

          if (!isSuccessToastShown) {
            toast.success("Thanh toán thành công");
            setIsSuccessToastShown(true); // Mark success toast as shown
          }
        }
      })
      .catch((error) => {
        console.error("Error in checkPayment:", error.response?.data || error.message);
      });
  };

  useEffect(() => {
    return () => {
      clearInterval(pollingIntervalId);
      clearTimeout(timeoutId);
    };
  }, [pollingIntervalId, timeoutId]);

  const totalPages = Math.ceil(fines.length / finesPerPage);

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const currentFines = fines.slice(
    currentPage * finesPerPage,
    (currentPage + 1) * finesPerPage
  );

  return (
    <Container className="mt-5">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      <div className="d-flex justify-content-center">
        <h2>Fines Management</h2>
      </div>
      <div className="d-flex justify-content-end" title={selectedFines.length === 0 ? "Chọn ít nhất 1 phạt để thanh toán" : "Thanh toán"}>
        <Button
          className="mb-3"
          variant="primary"
          onClick={handlePay}
          disabled={selectedFines.length === 0}
        >
          Thanh toán
        </Button>
      </div>
      {fines.length > 0 ? (
        <table className="table table-hover border">
          <thead>
            <tr>
              <th><input
                variant="secondary"
                onClick={handleSelectAll}
                type="checkbox"
              /></th>
              <th>STT</th>
              <th>Người bị phạt</th>
              <th>Lý do</th>
              <th>Tổng số tiền phạt</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {currentFines.map((fine, index) => (
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
                <td>{index + 1}</td>
                <td>{fine.user_id.fullName}</td>
                <td>{fine.reason || fine.fineReason_id.reasonName}</td>
                <td>{formatCurrency(fine.totalFinesAmount)}</td>
                <td style={{ color: fine.status === "Pending" ? "orange" : fine.status === "Paid" ? "green" : "red" }}>
                  {fine.status === "Pending" ? "Đang chờ" : fine.status === "Paid" ? "Đã thanh toán" : "Không xác định"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No fines available</p>
      )}
      {fines.length > 10 && (
        <ReactPaginate
          previousLabel={'<'}
          nextLabel={'>'}
          breakLabel={'...'}
          pageCount={totalPages}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageClick}
          containerClassName={'pagination justify-content-end'}
          pageClassName={'page-item'}
          pageLinkClassName={'page-link'}
          previousClassName={'page-item'}
          previousLinkClassName={'page-link'}
          nextClassName={'page-item'}
          nextLinkClassName={'page-link'}
          breakClassName={'page-item'}
          breakLinkClassName={'page-link'}
          activeClassName={'active'}
        />
      )}
      <Modal show={showQRCode} onHide={() => setShowQRCode(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Scan QR code để hoàn thành thanh toán</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>Tổng số tiền phạt: {formatCurrency(totalAmount)}</h4>
          <img
            src={`https://img.vietqr.io/image/mbbank-0985930695-compact2.jpg?amount=${totalAmount}&addInfo=start${transactionCode}end&accountName=FPTULibrary`}
            alt="QR Code for Payment"
            className="qr-code"
            style={{ width: "100%", height: "auto" }}
          />
          <p>Scan QR code để hoàn thành thanh toán</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowQRCode(false)}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default Fines;
