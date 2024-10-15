import React, { useState, useEffect } from "react";
// import "./ListBookBorrowed.scss";

function ReportLostBook() {
  const [borrowedBooks, setBorrowedBooks] = useState([]);

  useEffect(() => {
    // Tạo dữ liệu giả để mô phỏng các sách đã mượn
    const fakeBorrowedBooks = [
      {
        id: 1,
        title: "Kinh te vi mo",
        borrowDate: "10/09/2024",
        dueDate: "15/09/2024",
        studentId: "HE163676",
      },
      {
        id: 2,
        title: "C/C++",
        borrowDate: "10/09/2024",
        dueDate: "15/09/2024",
        studentId: "HE163676",
      },
      {
        id: 3,
        title: "Java",
        borrowDate: "10/09/2024",
        dueDate: "15/09/2024",
        studentId: "HE163676",
      },
      {
        id: 4,
        title: "Python",
        borrowDate: "10/09/2024",
        dueDate: "15/09/2024",
        studentId: "HE163676",
      },
      {
        id: 5,
        title: "Human Resources",
        borrowDate: "10/09/2024",
        dueDate: "15/09/2024",
        studentId: "HE163676",
      },
    ];

    // Set dữ liệu giả vào state
    setBorrowedBooks(fakeBorrowedBooks);
  }, []);
  return (
    <div className="container mt-5">
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Book</th>
            <th>Borrow date</th>
            <th>Due date</th>
            <th>Student ID</th>
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
              <td>{book.studentId}</td>
              <td>
                <button className="btn btn-outline-primary me-2">Report</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ReportLostBook;
