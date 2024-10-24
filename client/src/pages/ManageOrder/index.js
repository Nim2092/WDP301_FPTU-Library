import React, { useState, useEffect, useContext } from "react";
import { Modal, Button, Container } from "react-bootstrap";
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
  const [sortOrder, setSortOrder] = useState("asc"); // Holds the sort order
  // Fetch books function
  const fetchBooks = async () => {
    try {
      let response;
      if (status === "") {
        response = await axios.get(`http://localhost:9999/api/orders/getAll`);
      } else {
        response = await axios.get(`http://localhost:9999/api/orders/filter?status=${status}`);
        if (response.data.data.length === 0) {
          toast.info("No books found with this status. Showing all orders.");
          setStatus(""); // Reset status to show all orders
          response = await axios.get(`http://localhost:9999/api/orders/getAll`); // Fetch all orders
        }
      }

      setBorrowBooks(response.data.data || []);
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

  // Handle the actions for approve/reject/receive
  const handleActionClick = (book, type) => {
    setSelectedBook(book);
    setModalType(type); // Set the type of modal (approve/reject/receive)
    setShowModal(true);
  };

  // Submit approval, rejection, or other status changes
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
        case "cancel":
          newStatus = "Canceled";
          break;
        case "return":
          newStatus = "Returned";
          break;
        case "overdue":
          newStatus = "Overdue";
          break;
        case "lost":
          newStatus = "Lost";
          break;
        case "renew_pending":
          newStatus = "Renew Pending";
          break;
        default:
          newStatus = "Pending"; // Default to Pending if no modalType
          break;
      }

      const updateData = {
        status: newStatus,
        updated_by: user.id,
      };

      if (modalType === "reject") updateData.reason_order = reason; // Add reason if rejecting

      await axios.put(`http://localhost:9999/api/orders/change-status/${selectedBook._id}`, updateData);

      setShowModal(false);
      setReason(""); // Clear the reason input after action
      fetchBooks();  // Refresh the list after updating status
    } catch (error) {
      const errorMessage = error.response ? error.response.data.message : "An error occurred while updating the book status.";
      toast.error(errorMessage);
      console.error(`Error ${modalType === 'approve' ? 'approving' : 'updating'} the book:`, error);
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
    console.log(bookId);

    if (selectedBooks.includes(bookId)) {
      // If already selected, remove it
      setSelectedBooks(selectedBooks.filter((id) => id !== bookId));
    } else {
      // Otherwise, add it to the selected books
      setSelectedBooks([...selectedBooks, bookId]);
    }
  };

  // Bulk approve selected orders
  const handleApproveSelected = async () => {
    if (selectedBooks.length === 0) {
      toast.error("No orders selected.");
      return;
    }

    try {
      const updateData = {
        orderIds: selectedBooks, // Send the selected order IDs
        updated_by: user.id,
      };
      console.log(updateData);
      await axios.put(`http://localhost:9999/api/orders/approve-all`, updateData); // Use the bulk approval endpoint
      toast.success("Selected orders approved successfully!");
      fetchBooks(); // Refresh the list after approval
      setSelectedBooks([]); // Clear selection
    } catch (error) {
      const errorMessage = error.response ? error.response.data.message : "An error occurred while approving the selected books.";
      toast.error(errorMessage);
      console.error("Error approving selected books:", error);
    }
  };

  // Search by identifier code
  const handleSearchByIdentifierCode = async () => {
    try {
      const response = await axios.get(`http://localhost:9999/api/orders/search-by-identifier-code?identifierCode=${identifierCode}`);
      setBorrowBooks(response.data.data || []);
    } catch (error) {
      console.error("Error searching by identifier code:", error);
    }
  };

  const handleSortByBookTitle = () => {
    const sortedBooks = [...borrowBooks].sort((a, b) => {
      const titleA = a.book_id.bookSet_id.title.toLowerCase();
      const titleB = b.book_id.bookSet_id.title.toLowerCase();
      return sortOrder === "asc" ? titleA.localeCompare(titleB) : titleB.localeCompare(titleA);
    });

    setBorrowBooks(sortedBooks);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const handleSortByBorrowDate = () => {
    const sortedBooks = [...borrowBooks].sort((a, b) => {
      return sortOrder === "asc" ? new Date(a.borrowDate) - new Date(b.borrowDate) : new Date(b.borrowDate) - new Date(a.borrowDate);
    });

    setBorrowBooks(sortedBooks);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  }


  return (
    <Container className="mt-4">
      <ToastContainer />
      
      <div className="d-flex justify-content-between">
        <div>
          <h2 className="mb-4">List of Borrowed Books</h2>
        </div>
        <div className="d-flex align-items-center">
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
      </div>
      <div className="d-flex justify-content-between " style={{ marginBottom: "10px" }}>
        {/* Search Bar */}
        <div className="search-bar d-flex align-items-center" >
          <input type="text" style={{ width: "300px",height: "40px", borderRadius: "10px", border: "1px solid #ccc" }} placeholder="Search by book identifier code" value={identifierCode} onChange={(e) => setIdentifierCode(e.target.value)} />
          <Button variant="primary" style={{ marginLeft: "10px" }} onClick={handleSearchByIdentifierCode}>Search</Button>
        </div>
        {/* Approve and Select All */}

        <div>
          <Button variant="primary" style={{ marginRight: "10px" }} onClick={handleSelectAll}>
            {selectedBooks.length === borrowBooks.length ? "Unselect All" : "Select All"}
          </Button>
          <Button variant="primary" style={{ marginRight: "10px" }} onClick={handleApproveSelected}>
            Approve Selected
          </Button>
        </div>
      </div>
      {/* Borrowed Books Table */}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Select</th>
            <th>ID</th>
            <th onClick={handleSortByBookTitle}>Book Title <i className={`fa fa-sort-${sortOrder === "asc" ? "up" : "down"}`}></i></th>
            <th onClick={handleSortByBorrowDate}>Borrow Date <i className={`fa fa-sort-${sortOrder === "asc" ? "up" : "down"}`}></i></th>
            <th>Due Date</th>
            <th>Identify Book Code</th>
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
                <td>{book.book_id.identifier_code}</td>
                <td>
                  <span className={`text-${book.status === "Pending" ? "warning" : book.status === "Approved" ? "success" : "danger"}`}>
                    {book.status}
                  </span>
                </td>
                {book.status === "Pending" && (
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
                )}
                {book.status === "Approved" && (
                  <td className="d-flex justify-content-center">
                    <Button variant="primary" onClick={() => handleActionClick(book, "receive")}> Receive</Button>
                  </td>
                )}
                {book.status === "Renew Pending" && (
                  <td className="d-flex justify-content-center">
                    <Button variant="primary" onClick={() => handleActionClick(book, "receive")}> Approve Renew</Button>
                  </td>
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

      {/* Modal for approval/rejection/receiving */}
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
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {modalType === "approve" || modalType === "receive" ? "Confirm" : "Submit"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default BorrowBookList;
