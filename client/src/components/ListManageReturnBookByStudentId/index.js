import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap"; // Import Bootstrap components for modal
import { ToastContainer, toast } from "react-toastify";
function ListManageReturnBookByStudentId({ userID, onNextStep, onPreviousStep }) {
  const [bookList, setBookList] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null); // Lưu trữ sách được chọn
  const [showModal, setShowModal] = useState(false); // Quản lý trạng thái popup
  const [identifierInput, setIdentifierInput] = useState(""); // Nhập mã nhận dạng
  const [errorMessage, setErrorMessage] = useState(""); // Thông báo lỗi nếu mã không đúng

  // Fetch books when userID changes
  useEffect(() => {
    if (userID) {
      axios.get(`http://localhost:9999/api/orders/by-user/${userID}`)
        .then(response => {
          setBookList(response.data.data);
        })
        .catch(error => {
          console.error("Error fetching orders:", error);
        });
    }
  }, [userID]);

  // Handle confirm action for selected book
  const handleConfirm = (book) => {
    setSelectedBook(book); // Lưu sách đã chọn
    setShowModal(true); // Hiển thị popup
  };

  // Kiểm tra mã nhận dạng khi người dùng nhấn "Submit" trong popup
  const handleSubmitIdentifier = () => {
    if (identifierInput === selectedBook.book_id.identifier_code) {
      setShowModal(false); // Đóng popup
      setErrorMessage(""); // Xóa lỗi
      onNextStep(selectedBook._id); // Chuyển sang bước tiếp theo với bookID
    } else {
      toast.error("The identification code is incorrect. Please try again.");
      // setErrorMessage("The identification code is incorrect. Please try again.");
    }
  };

  // Handle previous step navigation
  const handlePreviousStep = () => {
    onPreviousStep(); // Quay lại bước trước
  };

  return (
    <div className="container mt-4">
       
      <table className="table table-bordered">
        <thead className="thead-light">
          <tr>
            <th>ID</th>
            <th>Book</th>
            <th>Borrow date</th>
            <th>Due date</th>
            <th>Status</th>
            <th>Confirm</th>
          </tr>
        </thead>
        <tbody>
          {bookList.length > 0 ? (
            bookList
              .filter(book => book.status === "Received") // Chỉ hiển thị sách có trạng thái "Received"
              .map((book, index) => (
                <tr key={book._id}>
                  <td>{index + 1}</td>
                  <td>{book.book_id.bookSet_id.title}</td>
                  <td>{new Date(book.borrowDate).toLocaleDateString()}</td>
                  <td>{new Date(book.dueDate).toLocaleDateString()}</td>
                  <td>{book.status}</td>
                  <td>
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => handleConfirm(book)}
                    >
                      Confirm
                    </button>
                  </td>
                </tr>
              ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">No books found</td>
            </tr>
          )}
        </tbody>
      </table>
      <button className="btn btn-primary mt-3" onClick={handlePreviousStep}>
        Previous
      </button>

      {/* Popup nhập mã nhận dạng */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Enter Book Identification Code</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="identifierCode">
              <Form.Label>Identification Code:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter code"
                value={identifierInput}
                onChange={(e) => setIdentifierInput(e.target.value)}
              />
            </Form.Group>
            {errorMessage && <p className="text-danger mt-2">{errorMessage}</p>}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmitIdentifier}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ListManageReturnBookByStudentId;
