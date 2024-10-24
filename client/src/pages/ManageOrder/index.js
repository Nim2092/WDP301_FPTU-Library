import React, { useState, useEffect, useContext } from "react";
import { Modal, Button, Container } from "react-bootstrap";
import axios from "axios";
import AuthContext from "../../contexts/UserContext";
import { toast, ToastContainer } from "react-toastify";

const BorrowBookList = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // 'approve' or 'reject'
  const [selectedBook, setSelectedBook] = useState(null); // Holds the selected book for rejection or approval
  const [reason, setReason] = useState(""); // Holds the reason for rejection
  const [borrowBooks, setBorrowBooks] = useState([]); // List of borrowed books
  const [status, setStatus] = useState(""); // Holds the status filter
  const { user } = useContext(AuthContext); // Get the user context
  const [selectedBooks, setSelectedBooks] = useState([]); // For storing selected books' IDs

  // Fetch books function
  const fetchBooks = async () => {
    try {
      const response = status === "" 
        ? await axios.get(`http://localhost:9999/api/orders/getAll`) 
        : await axios.get(`http://localhost:9999/api/orders/filter?status=${status}`);
      
      setBorrowBooks(response.data.data || []);
    } catch (error) {
      const errorMessage = error.response ? error.response.data.message : "An error occurred while fetching borrow books.";
      toast.error(errorMessage);
      console.error("Error fetching borrow books:", error);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [status]);

  // Handle the actions for approve/reject
  const handleActionClick = (book, type) => {
    setSelectedBook(book);
    setModalType(type); // Set the type of modal (approve/reject)
    setShowModal(true);
  };

  // Submit approval or rejection
  const handleSubmit = async () => {
    try {
      const updateData = {
        status: modalType === "approve" ? "Approved" : "Rejected",
        updated_by: user.id,
      };
      if (modalType === "reject") updateData.reason_order = reason; // Add reason if rejecting

      await axios.put(`http://localhost:9999/api/orders/change-status/${selectedBook._id}`, updateData);

      setShowModal(false);
      setReason(""); // Clear the reason input after action
      fetchBooks();
    } catch (error) {
      console.error(`Error ${modalType === 'approve' ? 'approving' : 'rejecting'} the book:`, error);
    }
  };

  // Select or unselect all books
  const handleSelectAll = () => {
    if (selectedBooks.length === borrowBooks.length) {
      // Unselect all if all are selected
      setSelectedBooks([]);
    } else {
      // Select all books
      const allBookIds = borrowBooks.map((book) => book._id);
      setSelectedBooks(allBookIds);
    }
  };

  // Handle individual book selection
  const handleSelectBook = (bookId) => {
    if (selectedBooks.includes(bookId)) {
      // If already selected, remove it
      setSelectedBooks(selectedBooks.filter((id) => id !== bookId));
    } else {
      // Otherwise, add it to the selected books
      setSelectedBooks([...selectedBooks, bookId]);
    }
  };

  return (
    <Container className="mt-4">
      <ToastContainer />
      <h2 className="mb-4">List of Borrowed Books</h2>
      <div className="d-flex justify-content-between">
        <div>
          {/* Status Filter Dropdown */}
          <select
            className="form-select mb-4"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">All Orders</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="Received">Received</option>
            <option value="Canceled">Canceled</option>
            <option value="Returned">Returned</option>
            <option value="Overdue">Overdue</option>
            <option value="Lost">Lost</option>
            <option value="Renew Pending">Renew Pending</option>
          </select>
        </div>
        {/* Approve and Select All */}
        <div>
          <Button variant="primary" style={{marginRight: "10px"}} onClick={handleSelectAll}>
            {selectedBooks.length === borrowBooks.length ? "Unselect All" : "Select All"}
          </Button>
          <Button variant="primary" style={{marginRight: "10px"}}>
            Approve Selected
          </Button>
          <Button variant="danger">
            Reject Selected
          </Button>
        </div>
      </div>
      {/* Borrowed Books Table */}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Select</th>
            <th>ID</th>
            <th>Book Title</th>
            <th>Borrow Date</th>
            <th>Due Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {borrowBooks.length > 0 ? (
            borrowBooks.map((book, index) => (
              <tr key={book._id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedBooks.includes(book._id)}
                    onChange={() => handleSelectBook(book._id)}
                  />
                </td>
                <td>{index + 1}</td>
                <td>{book.book_id.bookSet_id.title}</td>
                <td>{new Date(book.borrowDate).toLocaleDateString()}</td>
                <td>{new Date(book.dueDate).toLocaleDateString()}</td>
                <td>
                  <span className={`text-${book.status === "Pending" ? "warning" : book.status === "Approved" ? "success" : "danger"}`}>
                    {book.status}
                  </span>
                </td>
                <td className="d-flex justify-content-center">
                  <Button
                    variant="success"
                    className="me-2"
                    onClick={() => handleActionClick(book, "approve")}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleActionClick(book, "reject")}
                  >
                    Reject
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No books found</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal for approval/rejection */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{modalType === "approve" ? "Confirm Approval" : "Reason for Rejection"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalType === "approve" ? (
            <p>
              Are you sure you want to approve the request for the book: <strong>{selectedBook?.book_id?.bookSet_id?.title}</strong>?
            </p>
          ) : (
            <div className="form-group">
              <label htmlFor="reason">Reason</label>
              <input
                type="text"
                className="form-control"
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter reason for rejection"
              />
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {modalType === "approve" ? "Confirm" : "Submit"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default BorrowBookList;
