import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function SearchResults() {
  const books = [
    {
      id: 1,
      title: "Python for Beginner",
      author: "Nguyen Ngoc Tan",
      publicer: "Dan Tri",
      year: "2023",
      isbn: "Updating",
      image: "https://via.placeholder.com/150", // Thay thế bằng đường dẫn ảnh thực tế
    },
    {
      id: 2,
      title: "Python for Beginner",
      author: "Nguyen Ngoc Tan",
      publicer: "Dan Tri",
      year: "2023",
      isbn: "Updating",
      image: "https://via.placeholder.com/150",
    },
    {
      id: 3,
      title: "Python for Beginner",
      author: "Nguyen Ngoc Tan",
      publicer: "Dan Tri",
      year: "2023",
      isbn: "Updating",
      image: "https://via.placeholder.com/150",
    },
  ];

  return (
    <div className="container mt-4">
      {books.map((book) => (
        <div className="card mb-4 p-3" key={book.id}>
          <div className="row no-gutters">
            <div className="col-md-3">
              <img
                src={book.image}
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
                  <strong>Publicer:</strong> {book.publicer}
                </p>
                <p className="card-text">
                  <strong>Year:</strong> {book.year}
                </p>
                <p className="card-text">
                  <strong>ISBN:</strong> {book.isbn}
                </p>
                <button className="btn btn-primary">Borrow this book</button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default SearchResults;
