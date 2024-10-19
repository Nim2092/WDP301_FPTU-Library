import React, { useState, useEffect } from "react";
import axios from "axios"; // Import axios for making API requests
import { useLocation } from "react-router-dom"; // To get the query parameter from URL
import "bootstrap/dist/css/bootstrap.min.css";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function SearchResultsPage() {
  const query = useQuery();
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      const title = query.get("title"); // Get the title from the URL query
      if (title) {
        try {
          const response = await axios.get("http://localhost:9999/api/book-sets/list", {
            params: {
              title,
            },
          });
          setBooks(response.data.data);
        } catch (error) {
          console.error("Error fetching books:", error);
        }
      }
    };

    fetchBooks();
  }, [query]);

  return (
    <div className="container">
      {books.length > 0 ? (
        books.map((book) => (
          <div className="card mb-4 p-3" key={book._id}>
            <div className="row no-gutters">
              <div className="col-md-3">
                <img
                  src="https://via.placeholder.com/150"
                  alt={book.title}
                  className="img-fluid"
                />
              </div>
              <div className="col-md-9">
                <div className="card-body">
                  <h5 className="card-title">{book.title}</h5>
                  <p className="card-text"><strong>Author:</strong> {book.author}</p>
                  <p className="card-text"><strong>Publisher:</strong> {book.publisher}</p>
                  <p className="card-text"><strong>Year:</strong> {new Date(book.publishedYear).getFullYear()}</p>
                  <p className="card-text"><strong>ISBN:</strong> {book.isbn}</p>
                  <button className="btn btn-primary float-end">Borrow this book</button>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>No results found.</p>
      )}
    </div>
  );
}

export default SearchResultsPage;
