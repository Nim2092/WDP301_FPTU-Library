import React from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS

function ListManageReturnBookByStudentId({ onNextStep }) {
  // Sample data for books - you may replace this with props or fetched data
  const bookList = [
    { id: 1, title: "Kinh tế học đại cương", borrowDate: "10/09/2024", dueDate: "15/09/2024", studentId: "HE163676" },
    { id: 2, title: "C/C++", borrowDate: "10/09/2024", dueDate: "15/09/2024", studentId: "HE163676" },
    { id: 3, title: "Java", borrowDate: "10/09/2024", dueDate: "15/09/2024", studentId: "HE163676" },
    { id: 4, title: "Python", borrowDate: "10/09/2024", dueDate: "15/09/2024", studentId: "HE163676" },
    { id: 5, title: "Human Resources", borrowDate: "10/09/2024", dueDate: "15/09/2024", studentId: "HE163676" },
  ];

  const handleConfirm = (id) => {
    // Handle confirm action here (e.g., show popup or move to the next step)
    console.log(`Confirm clicked for book ID: ${id}`);
    onNextStep(); // Proceed to the next step
  };

  return (
    <div className="container mt-4">
      <table className="table table-bordered">
        <thead className="thead-light">
          <tr>
            <th>ID</th>
            <th>Book</th>
            <th>Borrow date</th>
            <th>Due date</th>
            <th>StudentID</th>
            <th>Confirm</th>
          </tr>
        </thead>
        <tbody>
          {bookList.map((book) => (
            <tr key={book.id}>
              <td>{book.id}</td>
              <td>{book.title}</td>
              <td>{book.borrowDate}</td>
              <td>{book.dueDate}</td>
              <td>{book.studentId}</td>
              <td>
                <button
                  className="btn btn-success btn-sm"
                  onClick={() => handleConfirm(book.id)}
                >
                  Confirm
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ListManageReturnBookByStudentId;
