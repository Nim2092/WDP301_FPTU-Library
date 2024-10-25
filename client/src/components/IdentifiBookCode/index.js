import React, { useState, useEffect } from "react";
import axios from "axios";

function IdentifiBookCode({ bookID, onNextStep, onPreviousStep }) {
  const [bookCode, setBookCode] = useState(""); // State to manage the book code input
  const [identifiedBookCode, setIdentifiedBookCode] = useState(""); // State to manage the identified book code
  // Identify book code when bookID changes
  useEffect(() => {
    axios.get(`http://localhost:9999/api/orders/getById/${bookID}`)
      .then(response => {
        setBookCode(response.data.data.bookCode);
      })
      .catch(error => {
        console.error("Error fetching book details:", error);
      });
  }, [bookID]);

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

  const handlePreviousStep = () => {
    onPreviousStep(); // Proceed to the previous step
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
      <button className="btn btn-primary mt-3" onClick={handlePreviousStep}>
        Previous
      </button>
    </div>
  );
}

export default IdentifiBookCode;
