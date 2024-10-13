import React, { useState, useEffect } from "react";
import "./ListBookBorrowed.scss";
import { Link } from "react-router-dom";
function ListBookBorrowed() {
  const [borrowedBooks, setBorrowedBooks] = useState([]);

  //   useEffect(() => {
  //     const fetchBorrowedBooks = async () => {
  //       const response = await fetch("http://localhost:9999/api/borrowed-books");
  //       const data = await response.json();
  //       setBorrowedBooks(data);
  //     };

  //     fetchBorrowedBooks();
  //   }, []);

  useEffect(() => {
    // Tạo dữ liệu giả để mô phỏng các sách đã mượn
    const fakeBorrowedBooks = [
      {
        id: 1,
        title: "Kinh te vi mo",
        borrowDate: "10/09/2024",
        dueDate: "15/09/2024",
      },
      {
        id: 2,
        title: "C/C++",
        borrowDate: "10/09/2024",
        dueDate: "15/09/2024",
      },
      {
        id: 3,
        title: "Java",
        borrowDate: "10/09/2024",
        dueDate: "15/09/2024",
      },
      {
        id: 4,
        title: "Python",
        borrowDate: "10/09/2024",
        dueDate: "15/09/2024",
      },
      {
        id: 5,
        title: "Human Resources",
        borrowDate: "10/09/2024",
        dueDate: "15/09/2024",
      },
    ];

    // Set dữ liệu giả vào state
    setBorrowedBooks(fakeBorrowedBooks);
  }, []);
  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-end mb-3">
        <button className="btn btn-primary">Order</button>
      </div>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Book</th>
            <th>Borrow date</th>
            <th>Due date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {borrowedBooks.map((book, index) => (
            <tr key={book.id}>
              <td>{index + 1}</td>
              <td>{book.title}</td>
              <td>{book.borrowDate}</td>
              <td>{book.dueDate}</td>
              <td>
                <Link
                  to="/report-lost-book"
                  className="btn btn-outline-primary me-2"
                >
                  Report lost book
                </Link>
                <Link to="/renew-book" className="btn btn-outline-primary">
                  Renew Book
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ListBookBorrowed;
