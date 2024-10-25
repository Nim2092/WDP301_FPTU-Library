import React, { useState, useEffect, useContext } from "react";
import "./ListBookBorrowed.scss";
import { Link } from "react-router-dom";
import axios from "axios";
import AuthContext from "../../contexts/UserContext"; // Adjust this path to where your context is located

function ListBookBorrowed() {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Access user and token from AuthContext
  const { user, token } = useContext(AuthContext);

  useEffect(() => {
    const fetchBorrowedBooks = async () => {
      if (!user) return; // If no user is logged in, don't make the API call

      try {
        setLoading(true); // Start loading
        const response = await axios.get(
          `http://localhost:9999/api/orders/by-user/${user.id}`, // Assuming the user object has an `id` field
          {
            headers: {
              Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
            },
          }
        );
        setBorrowedBooks(response.data.data); // Assuming the response contains an array of orders in `data.data`
      } catch (err) {
        setError("Failed to fetch borrowed books. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchBorrowedBooks();
  }, [user, token]);

  // Function to handle the "Report lost book" action
  const handleReportLostBook = async (orderId) => {
    const confirmLost = window.confirm("Are you sure you want to report this book as lost?");
    if (confirmLost) {
      try {
        // API call to update the order status to 'lost'
        await axios.put(
          `http://localhost:9999/api/orders/change-status/${orderId}`, // Adjust the API endpoint as per your backend
          { status: 'lost' }, // You might need to adjust the payload depending on your API
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        alert("The book has been successfully reported as lost.");
        // Optionally, refetch the data to update the UI
        const response = await axios.get(
          `http://localhost:9999/api/orders/by-user/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setBorrowedBooks(response.data.data); // Update the borrowed books list
      } catch (err) {
        console.error(err);
        alert("Failed to report the book as lost. Please try again.");
      }
    }
  };

  // Show loading indicator while fetching data
  if (loading) {
    return <p>Loading borrowed books...</p>;
  }

  return (
    <div className="container mt-5">
      {/* <div className="d-flex justify-content-end mb-3">
        <button className="btn btn-primary">Order</button>
      </div> */}

      {error && <p className="text-danger">{error}</p>}

      {!error && borrowedBooks.length === 0 && (
        <p>No borrowed books found for this user.</p>
      )}

      {borrowedBooks.length > 0 && (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>ID</th>
              <th>Book</th>
              <th>Borrow date</th>
              <th>Due date</th>
              <th>Status</th> 
              <th>Identifi Code</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {borrowedBooks.map((order, index) => (
              <tr key={order._id}>
                <td>{index + 1}</td>
                <td>{order.book_id?.bookSet_id?.title || "Unknown Title"}</td> {/* Displaying the book title from the nested bookSet */}
                <td>{new Date(order.borrowDate).toLocaleDateString()}</td>
                <td>{new Date(order.dueDate).toLocaleDateString()}</td>
                <td>{order.status || "Unknown Status"}</td> 
                <td>{order.book_id.identifier_code}</td>
                <td>
                  <button
                    onClick={() => handleReportLostBook(order._id)} // Call the handleReportLostBook function with order ID
                    className="btn btn-outline-primary me-2"
                  >
                    Report lost book
                  </button>
                  <Link
                    to={`/renew-book/${order._id}`}
                    className="btn btn-outline-primary me-2"
                  >
                    Renew Book
                  </Link>
                  <Link
                    to={`/order-book-detail/${order._id}`}
                    className="btn btn-outline-primary"
                  >
                    Detail
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ListBookBorrowed;
