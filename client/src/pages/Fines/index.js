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
  const finesPerPage = 10; // Number of fines per page

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
      });
  };

  // Clean up intervals and timeouts when component unmounts or QR code modal closes
  useEffect(() => {
    return () => {
      clearInterval(pollingIntervalId);
      clearTimeout(timeoutId);
    };
  }, [pollingIntervalId, timeoutId]);

  // Calculate total pages
  const totalPages = Math.ceil(fines.length / finesPerPage);

  // Handle page click
  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  // Get current fines to display
  const currentFines = fines.slice(
    currentPage * finesPerPage,
    (currentPage + 1) * finesPerPage
  );

  return (
    <Container className="mt-5">
      <div className="d-flex justify-content-center">
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
              >
              </input></th>
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

      ) : null}
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
      {/* QR Code Modal */}
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
