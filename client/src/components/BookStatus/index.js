import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function BookStatus({ bookID, onPreviousStep }) {
  const [bookData, setBookData] = useState({});
  const [fineData, setFineData] = useState({ fine_reason: "" });
  const [returnDate, setReturnDate] = useState(new Date().toISOString().split("T")[0]);
  const [bookCondition, setBookCondition] = useState("Good");

  useEffect(() => {
    axios
      .get(`http://localhost:9999/api/orders/by-order/${bookID}`)
      .then((response) => {
        const { book_id: book, borrowDate, dueDate, created_by, updated_by } = response.data.data;
        setBookData({ book, borrowDate, dueDate, created_by, updated_by });
      })
      .catch((error) => {
        toast.error("Error fetching book details");
        console.error("Error fetching book details:", error);
      });
  }, [bookID]);

  const handleFineReasonChange = (e) => {
    setFineData({ fine_reason: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      userId: bookData.created_by?._id || "",
      returnDate: new Date(returnDate).toISOString(),
      createBy: bookData.created_by?._id || "",
      updateBy: bookData.updated_by?._id || "",
      book_condition: bookCondition,
      fine_reason: fineData.fine_reason,
    };

    try {
      const response = await axios.post(`http://localhost:9999/api/orders/return/${bookID}`, payload);

      if (response.status === 200) {
        toast.success("Book return confirmed successfully!");
        onPreviousStep();
      } else {
        toast.error("Error confirming book return.");
      }
    } catch (error) {
      toast.error("Error confirming book return.");
      console.error("Error confirming book return:", error);
    }
  };

  return (
    <div className="container mt-4">
      <ToastContainer />
      <button className="btn btn-primary mb-3" onClick={onPreviousStep}>
        Previous Step
      </button>
      <h2 className="mb-3 text-center">Return Book</h2>

      <form onSubmit={handleSubmit}>
        {/* Book Name */}
        <div className="form-group mt-3">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            className="form-control"
            value={bookData.book?.bookSet_id?.title || ""}
            readOnly
          />
        </div>

        {/* Borrow Date and Due Date */}
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
              className="form-control"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              required
            />
          </div>
          <div className="form-group mt-3 col-md-6">
            <label htmlFor="bookStatus">Book Condition</label>
            <select
              id="bookStatus"
              className="form-control"
              value={bookCondition}
              onChange={(e) => setBookCondition(e.target.value)}
              required
            >
              <option value="Good">Good</option>
              <option value="Light">Light</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
              <option value="Lost">Lost</option>
            </select>
          </div>
        </div>

        {/* Fine Reason */}
        <div className="form-group mt-3">
          <label htmlFor="fineReason">Fine Reason</label>
          <textarea
            id="fineReason"
            name="fine_reason"
            className="form-control"
            value={fineData.fine_reason}
            onChange={handleFineReasonChange}
            rows="4"
            placeholder="Enter any reasons regarding fines or damage"
          ></textarea>
        </div>

        {/* Confirm Button */}
        <div className="d-flex justify-content-center mt-4">
          <button type="submit" className="btn btn-primary btn-lg">
            Confirm
          </button>
        </div>
      </form>
    </div>
  );
}

export default BookStatus;
