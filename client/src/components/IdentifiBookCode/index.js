import React, { useState, useEffect } from "react";
import axios from "axios";

function IdentifiBookCode({ bookID, onNextStep, onPreviousStep }) {
  const [bookDetails, setBookDetails] = useState(null); // Lưu trữ thông tin sách từ API
  const [bookCodeInput, setBookCodeInput] = useState(""); // State để lưu mã người dùng nhập vào

  // Fetch book details when `bookID` changes
  useEffect(() => {
    axios.get(`http://localhost:9999/api/orders/by-order/${bookID}`)
      .then(response => {
        setBookDetails(response.data.data); // Lưu dữ liệu sách từ API
        console.log("Fetched book details:", response.data.data);
      })
      .catch(error => {
        console.error("Error fetching book details:", error);
      });
  }, [bookID]);

  // Xử lý thay đổi trong input của người dùng
  const handleChange = (e) => {
    setBookCodeInput(e.target.value);
  };

  // Xử lý form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (bookCodeInput.trim() === "" || bookCodeInput !== bookDetails?.book_id?.identifier_code) {
      alert("The book identification code does not match. Please enter the correct code.");
      return;
    }

    console.log("Confirmed Book Identification Code:", bookCodeInput);
    // Chuyển sang bước tiếp theo nếu mã đúng
    onNextStep();
  };

  const handlePreviousStep = () => {
    onPreviousStep(); // Quay lại bước trước
  };

  return (
    <div className="container mt-4">
      <h2>Enter Book Identification Code</h2>
      {bookDetails ? (
        <table className="table table-bordered">
          <thead className="thead-light">
            <tr>
              <th>Book</th>
              <th>Borrow Date</th>
              <th>Due Date</th>
              <th>Identifier Code</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{bookDetails.book_id.bookSet_id.title}</td>
              <td>{new Date(bookDetails.borrowDate).toLocaleDateString()}</td>
              <td>{new Date(bookDetails.dueDate).toLocaleDateString()}</td>
              <td>{bookDetails.book_id.identifier_code}</td>
              <td>{bookDetails.status}</td>
            </tr>
          </tbody>
        </table>
      ) : (
        <p>Loading book details...</p>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="bookIdCode">Book Identification Code:</label>
          <input
            type="text"
            id="bookIdCode"
            value={bookCodeInput}
            onChange={handleChange}
            className="form-control"
            placeholder="Enter the code of the book"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary mt-3">
          Submit
        </button>
      </form>
      <button className="btn btn-secondary mt-3" onClick={handlePreviousStep}>
        Previous
      </button>
    </div>
  );
}

export default IdentifiBookCode;
