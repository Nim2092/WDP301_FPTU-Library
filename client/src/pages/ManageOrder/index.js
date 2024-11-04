import React, { useState, useEffect, useContext } from "react";
import { Modal, Button, Container, Pagination } from "react-bootstrap";
import axios from "axios";
import AuthContext from "../../contexts/UserContext";
import { toast, ToastContainer } from "react-toastify";

const BorrowBookList = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // 'approve', 'reject', 'receive', etc.
  const [selectedBook, setSelectedBook] = useState(null); // Holds the selected book for rejection or approval
  const [reason, setReason] = useState(""); // Holds the reason for rejection
  const [borrowBooks, setBorrowBooks] = useState([]); // List of borrowed books
  const [status, setStatus] = useState(""); // Holds the status filter
  const { user } = useContext(AuthContext); // Get the user context
  const [selectedBooks, setSelectedBooks] = useState([]); // For storing selected books' IDs
  const [identifierCode, setIdentifierCode] = useState(""); // Holds the identifier code for search
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10; // Number of items per page

  // Fetch books function with identifierCode parameter
  const fetchBooks = async (identifierCode = "") => {
    try {
      let response;
      
      if (identifierCode) {
        response = await axios.get(`https://fptu-library.xyz/api/orders/by-identifier-code/${identifierCode}`);
      } else if (status === "") {
        response = await axios.get(`https://fptu-library.xyz/api/orders/getAll`);
      } else {
        response = await axios.get(`https://fptu-library.xyz/api/orders/filter?status=${status}`);
      }

      const data = response.data.data || [];
      const formattedData = Array.isArray(data) ? data : [data];

      if (formattedData.length === 0) {
        toast.info("No books found with the specified criteria.");
      }

      // Sắp xếp borrowBooks theo ngày gần nhất
      const sortedData = formattedData.sort((a, b) => new Date(b.borrowDate) - new Date(a.borrowDate));
      setBorrowBooks(sortedData);
    } catch (error) {
      const errorMessage = error.response ? error.response.data.message : "An error occurred while fetching borrow books.";
      toast.error(errorMessage);
      setBorrowBooks([]);
      console.error("Error fetching borrow books:", error);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [status]);

  const handleActionClick = (book, type) => {
    setSelectedBook(book);
    setModalType(type);
    setShowModal(true);
  };

  const handleSubmit = async () => {
    try {
      let newStatus = "";
      switch (modalType) {
        case "approve":
          newStatus = "Approved";
          break;
        case "reject":
          newStatus = "Rejected";
          break;
        case "receive":
          newStatus = "Received";
          break;
        default:
          newStatus = "Pending";
          break;
      }

      const updateData = {
        status: newStatus,
        updated_by: user.id,
      };

      if (modalType === "reject") updateData.reason_order = reason;

      await axios.put(`https://fptu-library.xyz/api/orders/change-status/${selectedBook._id}`, updateData);

      setShowModal(false);
      setReason("");
      fetchBooks();
    } catch (error) {
      const errorMessage = error.response ? error.response.data.message : "An error occurred while updating the book status.";
      toast.error(errorMessage);
      console.error(`Error ${modalType === 'approve' ? 'approving' : 'updating'} the book:`, error);
    }
  };

  const handleSelectAll = () => {
    if (selectedBooks.length === borrowBooks.length) {
      setSelectedBooks([]);
    } else {
      const allBookIds = borrowBooks.map((book) => book._id);
      setSelectedBooks(allBookIds);
    }
  };

  const handleSelectBook = (bookId) => {
    if (selectedBooks.includes(bookId)) {
      setSelectedBooks(selectedBooks.filter((id) => id !== bookId));
    } else {
      setSelectedBooks([...selectedBooks, bookId]);
    }
  };

  const handleApproveSelected = async () => {
    if (selectedBooks.length === 0) {
      toast.error("No orders selected.");
      return;
    }

    try {
      const updateData = {
        orderIds: selectedBooks,
        updated_by: user.id,
      };
      await axios.put(`https://fptu-library.xyz/api/orders/approve-all`, updateData);
      toast.success("Selected orders approved successfully!");
      fetchBooks();
      setSelectedBooks([]);
    } catch (error) {
      const errorMessage = error.response ? error.response.data.message : "An error occurred while approving the selected books.";
      toast.error(errorMessage);
      console.error("Error approving selected books:", error);
    }
  };

  const handleSearchByIdentifierCode = () => {
    fetchBooks(identifierCode);
  };

  const offset = currentPage * itemsPerPage;
  const currentBooks = borrowBooks.slice(offset, offset + itemsPerPage);

  const totalPages = Math.ceil(borrowBooks.length / itemsPerPage);

  return (
    <Container className="mt-4">
      <ToastContainer />
      <div className="d-flex justify-content-between">
        <h2 className="mb-4">List of Borrowed Books</h2>
        <div className="d-flex align-items-center">
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
      </div>
      <div className="d-flex justify-content-between mb-3">
        <div className="search-bar d-flex align-items-center">
          <input
            type="text"
            style={{ width: "300px", height: "40px", borderRadius: "10px", border: "1px solid #ccc" }}
            placeholder="Search by book identifier code"
            value={identifierCode}
            onChange={(e) => setIdentifierCode(e.target.value)}
          />
          <Button variant="primary" style={{ marginLeft: "10px" }} onClick={handleSearchByIdentifierCode}>Search</Button>
        </div>
        <div>
          <Button variant="primary" style={{ marginRight: "10px" }} onClick={handleSelectAll}>
            {selectedBooks.length === borrowBooks.length ? "Unselect All" : "Select All"}
          </Button>
          <Button variant="primary" style={{ marginRight: "10px" }} onClick={handleApproveSelected}>
            Approve Selected
          </Button>
        </div>
      </div>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Select</th>
            <th>ID</th>
            <th>Book Title</th>
            <th>Borrow Date</th>
            <th>Due Date</th>
            <th>Identify Book Code</th>
            <th>Status</th>
            <th>Book Condition</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentBooks.length > 0 ? (
            currentBooks.map((book, index) => (
              <tr key={book._id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedBooks.includes(book._id)}
                    onChange={() => handleSelectBook(book._id)}
                  />
                </td>
                <td>{index + 1}</td>
                <td>{book.book_id?.bookSet_id?.title}</td>
                <td>{new Date(book.borrowDate).toLocaleDateString()}</td>
                <td>{new Date(book.dueDate).toLocaleDateString()}</td>
                <td>{book.book_id?.identifier_code}</td>
                <td>
                  <span className={`text-${book.status === "Pending" ? "warning" : book.status === "Approved" ? "success" : "danger"}`}>
                    {book.status}
                  </span>
                </td>
                <td>{book.book_id?.condition}</td>
                {book.status === "Pending" && (
                  <td>
                    <Button variant="success" className="me-2" onClick={() => handleActionClick(book, "approve")}>Approve</Button>
                    <Button variant="danger" onClick={() => handleActionClick(book, "reject")}>Reject</Button>
                  </td>
                )}
                {book.status === "Approved" && (
                  <td><Button variant="primary" onClick={() => handleActionClick(book, "receive")}>Loaned</Button></td>
                )}
                {book.status === "Renew Pending" && (
                  <td><Button variant="primary" onClick={() => handleActionClick(book, "receive")}>Approve Renew</Button></td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="text-center">No books found</td>
            </tr>
          )}
        </tbody>
      </table>

      <Pagination className="float-end">
        <Pagination.First onClick={() => setCurrentPage(0)} disabled={currentPage === 0} />
        <Pagination.Prev onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 0} />
        {[...Array(totalPages)].map((_, index) => (
          <Pagination.Item
            key={index}
            active={index === currentPage}
            onClick={() => setCurrentPage(index)}
          >
            {index + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages - 1} />
        <Pagination.Last onClick={() => setCurrentPage(totalPages - 1)} disabled={currentPage === totalPages - 1} />
      </Pagination>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{modalType === "approve" ? "Confirm Approval" : modalType === "receive" ? "Confirm Receive" : "Reason for Rejection"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalType === "approve" || modalType === "receive" ? (
            <p>
              Are you sure you want to {modalType} the request for the book: <strong>{selectedBook?.book_id?.bookSet_id?.title}</strong>?
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
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit}>{modalType === "approve" || modalType === "receive" ? "Confirm" : "Submit"}</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default BorrowBookList;
