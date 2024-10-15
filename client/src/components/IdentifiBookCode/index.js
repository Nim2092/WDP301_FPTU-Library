import React, { useState } from "react";

function IdentifiBookCode({ onNextStep }) {
  const [bookCode, setBookCode] = useState(""); // State to manage the book code input

  // Handler for input change
  const handleChange = (e) => {
    setBookCode(e.target.value);
  };

  // Handler for form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (bookCode.trim() === "") {
      alert("Please enter a valid book identification code.");
      return;
    }

    console.log("Book identification code:", bookCode);
    // Proceed to the next step after successful identification code submission
    onNextStep();
  };

  return (
    <div className="container mt-4">
      <h2>Enter Book Identification Code</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="bookIdCode">Book Identification Code:</label>
          <input
            type="text"
            id="bookIdCode"
            value={bookCode}
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
    </div>
  );
}

export default IdentifiBookCode;
