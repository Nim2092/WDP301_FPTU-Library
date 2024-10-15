import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";

const BorrowBookList = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [reason, setReason] = useState("");

  const borrowBooks = [
    {
      id: 1,
      book: "Kinh te...",
      borrowDate: "10/08/2024",
      dueDate: "10/09/2024",
      studentId: "HE163676",
    },
    {
      id: 2,
      book: "Kinh te...",
      borrowDate: "10/08/2024",
      dueDate: "10/09/2024",
      studentId: "HE163676",
    },
    {
      id: 3,
      book: "Kinh te...",
      borrowDate: "10/08/2024",
      dueDate: "10/09/2024",
      studentId: "HE163676",
    },
    {
      id: 4,
      book: "Kinh te...",
      borrowDate: "10/08/2024",
      dueDate: "10/09/2024",
      studentId: "HE163676",
    },
    // Add more data as needed
  ];

  const handleRejectClick = (book) => {
    setSelectedBook(book);
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
    <div className="container mt-4">
      <h2>List Borrow Book</h2>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Book</th>
            <th>Borrow date</th>
            <th>Due date</th>
            <th>StudentID</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {borrowBooks.map((book, index) => (
            <tr key={index}>
              <td>{book.id}</td>
              <td>{book.book}</td>
              <td>{book.borrowDate}</td>
              <td>{book.dueDate}</td>
              <td>{book.studentId}</td>
              <td className="d-flex justify-content-between">
                <button className="btn btn-success">Approve</button>{" "}
                <button
                  className="btn btn-danger"
                  onClick={() => handleRejectClick(book)}
                >
                  Reject
                </button>
              </td>
            </tr>
          ))}
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
    </div>
  );
};

export default BorrowBookList;
