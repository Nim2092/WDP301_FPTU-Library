import React, { useEffect, useState } from "react";
import axios from "axios";
function ListManageReturnBookByStudentId({ onNextStep }) {
  const [studentId, setStudentId] = useState("");
  const [bookList, setBookList] = useState([]);
  useEffect(() => {
    axios.get(`http://localhost:9999/api/orders/by-user/${studentId}`)
      .then(response => {
        setBookList(response.data.data);
      })
      .catch(error => {
        console.error("Error fetching orders:", error);
      });
  }, [studentId]);

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
