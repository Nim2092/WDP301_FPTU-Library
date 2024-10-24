import React, { useState, useContext } from "react";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap"; // Import Bootstrap components
import AuthContext from "../../contexts/UserContext"; // Import context for user ID
import { toast, ToastContainer } from "react-toastify";
function SearchResults({ books }) {
  const { user } = useContext(AuthContext); // Get user information from context
  const [selectedBookId, setSelectedBookId] = useState(null); // Store selected book ID
  const [showModal, setShowModal] = useState(false); // State for modal visibility
  const [borrowDate, setBorrowDate] = useState(""); // State for borrow date
  const [dueDate, setDueDate] = useState(""); // State for due date
  // Function to open the modal for a selected book

  // chua check theo status


  const [bookSet, setBookSet] = useState(null); // Lưu trữ thông tin bộ sách
  const [book, setBook] = useState([]); // Lưu trữ danh sách các quyển sách

  const openBorrowModal = async (bookId) => {
    setSelectedBookId(bookId);
    try {
      // Call the API to check availability or fetch book details
      const response = await axios.get(`http://localhost:9999/api/book-sets/available/${bookId}`);
      setBookSet(response.data.bookSet); // Lưu thông tin bộ sách
      setBook(response.data.availableBooks); // Lưu danh sách các quyển sách
      if (response.status === 200) {

        setShowModal(true); // Show modal after fetching availability
        setBorrowDate(new Date().toISOString().slice(0, 10)); // Set current date as default
        setDueDate(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)); // Set default due date 14 days later
      }
    } catch (error) {
      console.error("Error fetching book availability:", error);
      toast.error("Error fetching book availability:", error);
    }
  };

  const handleBorrowSubmit = async () => {
    try {
      const booksetCurrent = bookSet._id; // Get the current book set ID
  
      // Fetch the user's current orders
      const ordersResponse = await axios.get(`http://localhost:9999/api/orders/by-user/${user.id}`);
      const orders = ordersResponse.data.data;
  
      // Check if the user already has a book set borrowed
      const hasDifferentBookSet = orders.some(order => order.book_id.bookSet_id._id === booksetCurrent);
  
      if (hasDifferentBookSet) {
        toast.error("You cannot borrow books from a different book set.");
        return; // Exit if the book sets don't match
      }
  
      // Proceed with the borrowing process if book sets match
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
      const message = error.response?.data?.message || "123";
      console.error(error);
      toast.error( message);
    }
  };
  

  //2222222222
  // const handleBorrowSubmit = async () => {
  //   try {
  //     const booksetCurrent = bookSet._id; // Get the current book set ID
  
  //     // Fetch the user's current orders
  //     const ordersResponse = await axios.get(`http://localhost:9999/api/orders/by-user/${user.id}`);
  //     const orders = ordersResponse?.data?.data;
  
  //     // If there are no existing orders, allow borrowing from any book set
  //     if (orders.length === 0) {
  //       // Proceed with the borrowing process
  //       if (book?.length > 0) {
  //         const firstBook = book[0];
  //         const response = await axios.post(`http://localhost:9999/api/orders/create-borrow/${firstBook._id}`, {
  //           book_id: firstBook._id,
  //           userId: user.id,
  //           borrowDate: borrowDate,
  //           dueDate: dueDate,
  //         });
  
  //         if (response.status === 201) {
  //           toast.success("Book borrowed successfully!");
  //           setShowModal(false);
  //         } else {
  //           console.error("Error borrowing the book:", response.data.message);
  //           toast.error("Error borrowing the book:", response.data.message);
  //         }
  //       }
  //       return; // Exit after processing
  //     }
  
  //     // Check if the user already has a book set borrowed
  //     const hasDifferentBookSet = orders.some(order => order?.book_id?.bookSet_id?._id !== booksetCurrent);
  
  //     if (hasDifferentBookSet) {
  //       toast.error("You cannot borrow books from a different book set.");
  //       return; // Exit if the book sets don't match
  //     }
  
  //     // Proceed with the borrowing process if book sets match
  //     if (book?.length > 0) {
  //       const firstBook = book[0];
  //       const response = await axios.post(`http://localhost:9999/api/orders/create-borrow/${firstBook._id}`, {
  //         book_id: firstBook._id,
  //         userId: user.id,
  //         borrowDate: borrowDate,
  //         dueDate: dueDate,
  //       });
  
  //       if (response.status === 201) {
  //         toast.success("Book borrowed successfully!");
  //         setShowModal(false);
  //       } else {
  //         console.error("Error borrowing the book:", response.data.message);
  //         toast.error("Error borrowing the book:", response.data.message);
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error borrowing the book:", error);
  //     toast.error("Error borrowing the book:", error.message);
  //   }
  // };
  

  // Handle modal close
  const closeModal = () => {
    setShowModal(false);
    setBorrowDate("");
    setDueDate("");
  };

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
                  src="https://via.placeholder.com/150" // Replace with actual book image if available
                  alt={book.title}
                  className="img-fluid"
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
                    <strong>Total Copies:</strong>
                    {book.totalCopies}
                  </p>
                  <p className="card-text">
                    <strong>Available Copies:</strong>
                    {book.availableCopies}
                  </p>
                  <p className="card-text">
                    <strong>Borrowed Copies:</strong>
                    {book.totalCopies - book.availableCopies}
                  </p>
                  <button
                    className="btn btn-primary float-end"
                    onClick={() => openBorrowModal(book._id)} // Open modal to borrow
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
                onChange={(e) => setBorrowDate(e.target.value)} // Update borrow date
              />
            </Form.Group>
            <Form.Group controlId="dueDate" className="mt-3">
              <Form.Label>Due Date</Form.Label>
              <Form.Control
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)} // Update due date
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
