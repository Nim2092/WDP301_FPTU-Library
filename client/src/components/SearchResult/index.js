import React, { useState, useContext } from "react";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";
import AuthContext from "../../contexts/UserContext";
import { toast, ToastContainer } from "react-toastify";

function SearchResults({ books }) {
  const { user } = useContext(AuthContext); // Get user information from context
  const [selectedBookId, setSelectedBookId] = useState(null); // Store selected book ID
  const [showModal, setShowModal] = useState(false); // State for modal visibility
  const [borrowDate, setBorrowDate] = useState(""); // State for borrow date
  const [dueDate, setDueDate] = useState(""); // State for due date
  const [bookSet, setBookSet] = useState(null); // Store book set info
  const [book, setBook] = useState([]); // Store available books

  const openBorrowModal = async (bookId) => {
    console.log("Opening modal for book ID:", bookId); // Debug
    setSelectedBookId(bookId);

    try {
      const response = await axios.get(`http://localhost:9999/api/book-sets/available/${bookId}`);
      console.log("API response:", response.data); // Debug response

      setBookSet(response.data.bookSet);
      setBook(response.data.availableBooks);

      // Cập nhật trực tiếp state `showModal` sau khi lấy được dữ liệu
      setShowModal(true);
      setBorrowDate(new Date().toISOString().slice(0, 10)); // Set current date as default
      setDueDate(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)); // Set default due date 14 days later

    } catch (error) {
      console.error("Error fetching book availability:", error);
      toast.error("Error fetching book availability.");
    }
  };

  const handleBorrowSubmit = async () => {
    try {
      const booksetCurrent = bookSet._id;
      const ordersResponse = await axios.get(`http://localhost:9999/api/orders/by-user/${user.id}`);
      const orders = ordersResponse.data.data;
      const hasDifferentBookSet = orders.some(order => order.book_id.bookSet_id._id === booksetCurrent);

      if (hasDifferentBookSet) {
        toast.error("You cannot borrow books from a different book set.");
        return;
      }

      if (book?.length > 0) {
        const firstBook = book[0];
        const response = await axios.post(`http://localhost:9999/api/orders/create-borrow/${firstBook._id}`, {
          book_id: firstBook._id,
          userId: user.id,
          borrowDate: borrowDate,
          dueDate: dueDate,
        });

        if (response.status === 201) {
          toast.success("Book borrowed successfully!");
          setShowModal(false);
        } else {
          console.error("Error borrowing the book:", response.data.message);
          toast.error("Error borrowing the book:", response.data.message);
        }
      }
    } catch (error) {
      const message = error.response?.data?.message || "An error occurred.";
      console.error(error);
      toast.error(message);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setBorrowDate("");
    setDueDate("");
  };

  console.log("showModal state:", showModal); // Debug showModal state

  return (
    <div className="container mt-4">
      <ToastContainer />
      {books.length === 0 ? (
        <p>No books found</p>
      ) : (
        books.map((book) => (
          <div className="card mb-4 p-3" key={book._id}>
            <div className="row no-gutters">
              <div className="col-md-3">
                <img
                  src={`http://localhost:9999/api/book-sets/image/${book.image.split("/").pop()}`}
                  alt={book.title}
                  style={{ width: "250px", height: "auto" }}
                />
              </div>
              <div className="col-md-9">
                <div className="card-body">
                  <h5 className="card-title">{book.title}</h5>
                  <p className="card-text">
                    <strong>Author:</strong> {book.author}
                  </p>
                  <p className="card-text">
                    <strong>Publisher:</strong> {book.publisher}
                  </p>
                  <p className="card-text">
                    <strong>Year:</strong> {new Date(book.publishedYear).getFullYear()}
                  </p>
                  <p className="card-text">
                    <strong>ISBN:</strong> {book.isbn}
                  </p>
                  <p className="card-text">
                    <strong>Total Copies:</strong> {book.totalCopies}
                  </p>
                  <p className="card-text">
                    <strong>Available Copies:</strong> {book.availableCopies}
                  </p>
                  <p className="card-text">
                    <strong>Borrowed Copies:</strong> {book.totalCopies - book.availableCopies}
                  </p>
                  <button
                    className="btn btn-primary float-end"
                    onClick={() => openBorrowModal(book._id)}
                  >
                    Borrow this book
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))
      )}

      {/* Borrow Modal */}
      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Borrow Book</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="borrowDate">
              <Form.Label>Borrow Date</Form.Label>
              <Form.Control
                type="date"
                value={borrowDate}
                onChange={(e) => setBorrowDate(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="dueDate" className="mt-3">
              <Form.Label>Due Date</Form.Label>
              <Form.Control
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleBorrowSubmit}>
            Confirm Borrow
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default SearchResults;
