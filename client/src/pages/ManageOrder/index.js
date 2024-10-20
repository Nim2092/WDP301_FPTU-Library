import React, { useState, useEffect } from "react";
import { Modal, Button, Container } from "react-bootstrap";
import axios from "axios";

const BorrowBookList = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [reason, setReason] = useState("");
  const [borrowBooks, setBorrowBooks] = useState([]); // Initialize as an array
  const [status, setStatus] = useState(""); // To filter by status

  // Fetch books based on the selected status filter
  useEffect(() => {
    if (status === "") {
      // If no status is selected, fetch all books
      axios
        .get(`http://localhost:9999/api/orders/getAll`)
        .then((response) => {
          const books = response.data.data || [];
          setBorrowBooks(books);
          console.log(books);
        })
        .catch((error) => {
          console.error("Error fetching borrow books:", error);
        });

    } else {
      // Fetch books filtered by status
      // status is the status of the book that we want to filter by
      // api ???
      axios
        .get(`http://localhost:9999/api/orders/filter-by-status/${status}`)
        .then((response) => {
          const books = response.data.data || [];
          setBorrowBooks(books);
          console.log(books);
        })
        .catch((error) => {
          console.error("Error fetching books by status:", error);
        });
    }
  }, [status]);

  const handleRejectClick = (book) => {
    setSelectedBook(book._id);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setReason("");
  };

  const handleSubmit = () => {
    // Logic to handle the reason for rejection
    console.log("Rejected:", selectedBook, "Reason:", reason);
    handleCloseModal();
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-4">List of Borrowed Books</h2>
      
      {/* Status Filter Dropdown */}
      <select
        className="form-select mb-4 w-25 float-end"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        <option value="">Select Status</option>
        <option value="Pending">Pending</option>
        <option value="Approved">Approved</option>
        <option value="Rejected">Rejected</option>
      </select>

      {/* Borrowed Books Table */}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Book Title</th>
            <th>Borrow Date</th>
            <th>Due Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(borrowBooks) && borrowBooks.length > 0 ? (
            borrowBooks.map((book, index) => (
              <tr key={book._id}>
                <td>{index + 1}</td>
                <td>{book.book_id}</td>
                <td>{new Date(book.borrowDate).toLocaleDateString()}</td>
                <td>{new Date(book.dueDate).toLocaleDateString()}</td>
                <td>
                  {book.status === "Pending" ? (
                    <span className="text-warning">Pending</span>
                  ) : book.status === "Approved" ? (
                    <span className="text-success">Approved</span>
                  ) : (
                    <span className="text-danger">Rejected</span>
                  )}
                </td>
                <td className="d-flex justify-content-center">
                  <Button variant="success" className="me-2">
                    Approve
                  </Button>
                  <Button variant="danger" onClick={() => handleRejectClick(book)}>
                    Reject
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No books found</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal for rejection reason */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Reason for Rejection</Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default BorrowBookList;
