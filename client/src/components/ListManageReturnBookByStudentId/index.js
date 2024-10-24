import React, { useEffect, useState } from "react";
import axios from "axios";

function ListManageReturnBookByStudentId({ userID, onNextStep, onPreviousStep }) {
  const [bookList, setBookList] = useState([]);
  const [bookID, setBookID] = useState("");
  // Fetch books when userID changes
  useEffect(() => {
    if (userID) {
      axios.get(`http://localhost:9999/api/orders/by-user/${userID}`)
        .then(response => {
          setBookList(response.data.data);
        })
        .catch(error => {
          console.error("Error fetching orders:", error);
        });
    }
  }, [userID]);

  // Handle confirm action for selected book
  const handleConfirm = (bookID) => {
    console.log(`Confirm clicked for book ID: ${bookID}`);
    onNextStep(bookID); // Proceed to the next step and pass the book ID
  };

  // Handle previous step navigation
  const handlePreviousStep = () => {
    onPreviousStep(); // Go back to the previous step
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
            <th>Status</th>
            <th>Confirm</th>
          </tr>
        </thead>
        <tbody>
          {bookList.length > 0 ? (
            bookList.map((book, index) => (
              <tr key={book._id}>
                <td>{index + 1}</td>
                <td>{book.book_id.bookSet_id.title}</td>
                <td>{new Date(book.borrowDate).toLocaleDateString()}</td>
                <td>{new Date(book.dueDate).toLocaleDateString()}</td>
                <td>{book.status}</td>
                <td>
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => handleConfirm(book._id)}
                  >
                    Confirm
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">No books found</td>
            </tr>
          )}
        </tbody>
      </table>
      <button className="btn btn-primary mt-3" onClick={handlePreviousStep}>
        Previous
      </button>
    </div>
  );
}

export default ListManageReturnBookByStudentId;
