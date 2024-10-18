import React, { useState } from "react";

function BookStatus() {
  // Assuming some initial state values for demonstration purposes
  const [bookData, setBookData] = useState({
    name: "Sample Book Name",
    borrowDate: "10/09/2024",
    bookReturnDate: "15/09/2024",
    returnDate: new Date().toISOString().split("T")[0],
    bookStatus: "Good",
    totalFines: "50.000 VND",
    note: "",
  });

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
    alert("Payment Successful");
    // Add your submission logic here
  };

  return (
    <div className="container mt-4">
      <h2>Return Book</h2>
      <form onSubmit={handleSubmit}>
        {/* Book Name */}
        <div className="form-group mt-3">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            className="form-control"
            value={bookData.name}
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
              value={bookData.borrowDate}
              readOnly
            />
          </div>
          <div className="form-group mt-3 col-md-6">
            <label htmlFor="bookReturnDate">Book Return Date</label>
            <input
              type="text"
              id="bookReturnDate"
              className="form-control"
              value={bookData.bookReturnDate}
              readOnly
            />
          </div>
        </div>

        {/* Return Date and Book Status */}
        <div className="row">
          <div className="form-group mt-3 col-md-6">
            <label htmlFor="returnDate">Return Date</label>
            <input
              type="date"
              id="returnDate"
              name="returnDate"
              className="form-control"
              value={bookData.returnDate}
              onChange={handleChange}
            />
          </div>
          <div className="form-group mt-3 col-md-6">
            <label htmlFor="bookStatus">Book Status</label>
            <select
              id="bookStatus"
              name="bookStatus"
              className="form-control"
              value={bookData.bookStatus}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Select Book Status
              </option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
              <option value="Damaged">Damaged</option>
              <option value="Lost">Lost</option>
            </select>
          </div>
        </div>

        {/* Total Fines */}
        <div className="form-group mt-3">
          <label htmlFor="totalFines">Total Fines</label>
          <input
            type="text"
            id="totalFines"
            className="form-control"
            value={bookData.totalFines}
            readOnly
            style={{ color: "#8B0000", fontWeight: "bold" }}
          />
        </div>

        {/* Note */}
        <div className="form-group mt-3">
          <label htmlFor="note">Note</label>
          <textarea
            id="note"
            name="note"
            className="form-control"
            value={bookData.note}
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
