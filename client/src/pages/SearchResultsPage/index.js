import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { Modal, Button, Form } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Search from "../../components/Search";
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function SearchResultsPage() {
  const query = useQuery();
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [borrowDate, setBorrowDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage] = useState(5); // Number of books per page
  const hasFetched = useRef(false);

  useEffect(() => {
    const queryTitle = query.get("title");
    if (queryTitle && queryTitle !== title) {
      setTitle(queryTitle);
      hasFetched.current = false;
    }
  }, [query, title]);

  useEffect(() => {
    const fetchBooks = async () => {
      if (title && !hasFetched.current) {
        try {
          const response = await axios.get("https://fptu-library.xyz/api/book-sets/list", {
            params: { title },
          });
          setBooks(response.data.data);
          hasFetched.current = true;
        } catch (error) {
          console.error("Error fetching books:", error);
        }
      }
    };
    fetchBooks();
  }, [title]);

  const openBorrowModal = (bookId) => {
    setSelectedBookId(bookId);
    setShowModal(true);
    setBorrowDate(new Date().toISOString().split("T")[0]);
    setDueDate(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]);
  };

  const handleBorrowSubmit = async () => {
    if (!borrowDate || !dueDate) {
      toast.error("Please select borrow and due dates.");
      return;
    }

    try {
      const response = await axios.post(`https://fptu-library.xyz/api/orders/create-borrow/${selectedBookId}`, {
        book_id: selectedBookId,
        borrowDate,
        dueDate,
      });

      if (response.status === 201) {
        toast.success("Book borrowed successfully!");
        setShowModal(false);
      } else {
        toast.error("Error borrowing the book.");
      }
    } catch (error) {
      console.error("Error borrowing the book:", error);
      toast.error("An error occurred.");
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setBorrowDate("");
    setDueDate("");
  };

  // Calculate the current books to display
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = books.slice(indexOfFirstBook, indexOfLastBook);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mt-4">
      <ToastContainer />
      <div className="row mb-4">
        <div className="col-12">
          <Search />
        </div>
      </div>
      {currentBooks.length > 0 ? (
        currentBooks.map((book) => (
          <div className="card mb-4 p-3" key={book._id}>
            <div className="row no-gutters">
              <div className="col-md-3">
                <img
                  src={`https://fptu-library.xyz/api/book-sets/image/${book.image.split("/").pop()}`}
                  alt={book.title}
                  style={{ width: "250px", height: "auto" }}
                />
              </div>
              <div className="col-md-9">
                <div className="card-body">
                  <h5 className="card-title">{book.title}</h5>
                  <p className="card-text"><strong>Author:</strong> {book.author}</p>
                  <p className="card-text"><strong>Publisher:</strong> {book.publisher}</p>
                  <p className="card-text"><strong>Year:</strong> {new Date(book.publishedYear).getFullYear()}</p>
                  <p className="card-text"><strong>ISBN:</strong> {book.isbn}</p>
                  <p className="card-text"><strong>Total Copies:</strong> {book.totalCopies}</p>
                  <p className="card-text"><strong>Available Copies:</strong> {book.availableCopies}</p>
                  <p className="card-text"><strong>Borrowed Copies:</strong> {book.totalCopies - book.availableCopies}</p>
                  {book.availableCopies > 0 && (
                    <button
                      className="btn btn-primary float-end"
                      onClick={() => openBorrowModal(book._id)}
                    >
                      Borrow this book
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>No results found.</p>
      )}

      {/* Pagination */}
      <nav>
        <ul className="pagination float-end">
          {Array.from({ length: Math.ceil(books.length / booksPerPage) }, (_, index) => (
            <li key={index + 1} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
              <button onClick={() => paginate(index + 1)} className="page-link">
                {index + 1}
              </button>
            </li>
          ))}
        </ul>
      </nav>

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

export default SearchResultsPage;
