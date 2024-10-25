import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
function BookStatus({ bookID, onPreviousStep }) {
  const [bookData, setBookData] = useState({});
  const [fineData, setFineData] = useState({});
  useEffect(() => {
    axios.get(`http://localhost:9999/api/orders/by-order/${bookID}`)
      .then(response => {
        setBookData(response.data.data); // Lưu dữ liệu sách từ API
      })
      .catch(error => {
        toast.error("Error fetching book details:", error);
        console.error("Error fetching book details:", error);
      });
  }, [bookID]);


  // Handler for updating form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handler for submitting the form
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Book Return Data:", bookData);
    // Xử lý logic thanh toán hoặc cập nhật trạng thái tại đây
  };

  return (
    <div className="container mt-4">
        <ToastContainer />
      <button className="btn btn-primary mb-3" onClick={onPreviousStep}>Previous Step</button>
      <h2 className="mb-3 text-center">Return Book</h2>

      <form onSubmit={handleSubmit}>
        {/* Book Name */}
        <div className="form-group mt-3">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            className="form-control"
            value={bookData.book_id?.bookSet_id?.title || ""}
            readOnly
          />
        </div>

        {/* Borrow Date and Book Return Date */}
        <div className="row">
          <div className="form-group mt-3 col-md-6">
            <label htmlFor="borrowDate">Borrow Date</label>
            <input
              type="text"
              id="borrowDate"
              className="form-control"
              value={bookData.borrowDate ? new Date(bookData.borrowDate).toLocaleDateString("en-GB") : ""}
              readOnly
            />
          </div>
          <div className="form-group mt-3 col-md-6">
            <label htmlFor="bookReturnDate">Book Return Date</label>
            <input
              type="text"
              id="bookReturnDate"
              className="form-control"
              value={bookData.dueDate ? new Date(bookData.dueDate).toLocaleDateString("en-GB") : ""}
              readOnly
            />
          </div>
        </div>

        {/* Return Date and Book Condition */}
        <div className="row">
          <div className="form-group mt-3 col-md-6">
            <label htmlFor="returnDate">Return Date</label>
            <input
              type="date"
              id="returnDate"
              name="returnDate"
              className="form-control"
              value={new Date().toISOString().split('T')[0]} // Set current date in YYYY-MM-DD format
              onChange={handleChange}
            />
          </div>
          <div className="form-group mt-3 col-md-6">
            <label htmlFor="bookStatus">Book Condition</label>
            <select
              id="bookStatus"
              name="condition" // Sử dụng "condition" để lưu vào đúng trường dữ liệu
              className="form-control"
              value={bookData.condition || ""} // Hiển thị trạng thái ban đầu nếu có
              onChange={handleChange}
              required
            >
              <option value="" disabled>Select condition</option>
              <option value="Good">Good</option>
              <option value="Lost">Lost</option>
              <option value="Light">Light</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
        </div>

        {/* Note */}
        <div className="form-group mt-3">
          <label htmlFor="note">Note</label>
          <textarea
            id="note"
            name="note"
            className="form-control"
            value={bookData.note || ""}
            onChange={handleChange}
            rows="4"
            placeholder="Enter any notes regarding the return"
          ></textarea>
        </div>

        {/* Pay Button */}
        <div className="d-flex justify-content-center mt-4">
          <button type="submit" className="btn btn-primary btn-lg">
            Pay
          </button>
        </div>
      </form>
    </div>
  );
}

export default BookStatus;
