import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function SearchResults({ books }) {
  const navigate = useNavigate(); 

  
  const handleBorrowClick = (bookId) => {
    navigate(`/order-book/${bookId}`); 
  };

  return (
    <div className="container mt-4">
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
                  <button
                    className="btn btn-primary float-end"
                    onClick={() => handleBorrowClick(book._id)} // Gọi hàm khi nhấn nút
                  >
                    Borrow this book
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default SearchResults;
