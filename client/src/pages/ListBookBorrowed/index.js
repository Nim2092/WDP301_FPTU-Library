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
  const handleReportLostBook = async (orderId, currentStatus) => {
    const confirmLost = window.confirm(
      "Are you sure you want to report this book as lost?"
    );
    if (confirmLost) {
      try {
        await axios.put(
          `http://localhost:9999/api/orders/report-lost/${orderId}`,
          { userId: user.id, status: currentStatus },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        alert("The book has been successfully reported as lost.");

        const response = await axios.get(
          `http://localhost:9999/api/orders/by-user/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setBorrowedBooks(response.data.data);
      } catch (err) {
        console.error(err);
        alert("Failed to report the book as lost. Please try again.");
      }
    }
  };

  if (loading) {
    return <p>Loading borrowed books...</p>;
  }



  const handleCancelOrder = async (orderId) => {
    try {
      await axios.put(`http://localhost:9999/api/orders/change-status/${orderId}`, {
        status: "Canceled",
      },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Order has been canceled successfully.");
    } catch (err) {
      console.error(err);
      alert("Failed to cancel the order. Please try again.");
    }
  };

  const handleRenewBook = async (orderId) => {
    try {
      await axios.post(`http://localhost:9999/api/orders/renew/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Book has been renewed successfully.");
    } catch (err) {
      console.error(err);
      alert("Failed to renew the book. Please try again.");
    }
  };

  // Add this function before the return statement
  const getStatusColor = (status) => {
    switch (status) {
      case 'Received':
        return 'text-success';
      case 'Pending':
        return 'text-warning';
      case 'Canceled':
        return 'text-danger';
      case 'Lost':
        return 'text-danger';
      case 'Returned':
        return 'text-info';
      default:
        return 'text-secondary';
    }
  };

  return (
    <div className="container mt-5">
      {error && <p className="text-danger">{error}</p>}
      {!error && borrowedBooks.length === 0 && (
        <p>No borrowed books found.</p>
      )}
      <div className="row">
        <div className="col-md-6">
          <h2>Borrowed Books</h2>
        </div>
        <div className="col-md-6"></div>
      </div>
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
              <th>renewCount</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {borrowedBooks.map((order, index) => (
              <tr key={order._id}>
                <td>{index + 1}</td>
                <td>
                  {order.book_id?.bookSet_id?.title || "Unknown Title"}
                </td>{" "}
                {/* Displaying the book title from the nested bookSet */}
                <td>{new Date(order.borrowDate).toLocaleDateString()}</td>
                <td>{new Date(order.dueDate).toLocaleDateString()}</td>
                <td className={getStatusColor(order.status)}>
                  {order.status || "Unknown Status"}
                </td>
                <td>{order.book_id?.identifier_code}</td>
                <td>{order.renewalCount}</td>
                <td className="d-flex justify-content-between">
                  {order.status === "Received" && (
                    <>
                      <button
                        onClick={() => handleReportLostBook(order._id, order.status)}
                        className="btn btn-outline-primary me-2"
                      >
                        Report lost book
                      </button>
                      <button
                        className="btn btn-outline-primary me-2"
                        onClick={() => handleRenewBook(order._id)}
                      >
                        Renew Book
                      </button>
                    </>
                  )}
                  <Link
                    to={`/order-book-detail/${order._id}`}
                    className="btn btn-outline-primary"
                  >
                    Detail
                  </Link>
                  {order.status === "Pending" && (
                    <button
                      onClick={() => handleCancelOrder(order._id)}
                      className="btn btn-outline-danger"
                    >
                      Cancel Order
                    </button>
                  )}
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
