import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom"; // To get the orderId from the URL
import "./RenewBook.scss"; // If you have a CSS file

function RenewBook() {
  const { orderId } = useParams(); // Get the orderId from the URL

  const [book, setBook] = useState(null);
  const [newDueDate, setNewDueDate] = useState("");
  const [renewReason, setRenewReason] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch order details when the component mounts
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:9999/api/orders/by-order/${orderId}`);
        setBook(response.data.data); // Assuming the order details are in data.data
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch book details.");
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `http://localhost:9999/api/orders/renew/${orderId}`,
        {
          dueDate: newDueDate,
          renew_reason: renewReason, // Pass the renewal reason
        }
      );
      alert("Book renewed successfully.");
    } catch (err) {
      setError("Failed to renew the book. Please try again.");
    }
  };

  if (loading) return <p>Loading book details...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="renew-book container my-5">
      <div className="row">
        <div className="col-md-4">
          <img
            src="https://via.placeholder.com/150" // Replace with actual book image
            alt="Book cover"
            className="img-fluid"
          />
        </div>
        <div className="col-md-8">
          <h3>{book?.book_id?.bookSet_id?.title || "Unknown Title"}</h3>
          <p><strong>Author:</strong> {book?.book_id?.bookSet_id?.author || "Unknown Author"}</p>
          <p><strong>Order date:</strong> {new Date(book?.borrowDate).toLocaleDateString()}</p>
          <p><strong>Due date:</strong> {new Date(book?.dueDate).toLocaleDateString()}</p>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="newDueDate" className="form-label">
                New due date
              </label>
              <input
                type="date"
                className="form-control"
                id="newDueDate"
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="renewReason" className="form-label">
                Reason for renewal
              </label>
              <textarea
                className="form-control"
                id="renewReason"
                rows="3"
                value={renewReason}
                onChange={(e) => setRenewReason(e.target.value)}
                required
              ></textarea>
            </div>
            <button type="submit" className="btn btn-danger">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RenewBook;
