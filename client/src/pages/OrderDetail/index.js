import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap is imported
import './OrderDetail.scss';


const OrderDetail = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { orderId } = useParams();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:9999/api/orders/by-order/${orderId}`);
        setOrder(response.data.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching order details.');
        setLoading(false);
        console.error(err);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-danger">{error}</p>;

  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">Order Details</h1>

      {order ? (
        <div className="card shadow">
          <div className="card-body">
            {/* Order Information */}
            <h3 className="card-title">Order Information</h3>
            <div className="row mb-3">
              <div className="col-md-6">
                <p><strong>Order ID:</strong> {order._id}</p>
              </div>
              <div className="col-md-6">
                <p><strong>Status:</strong> {order.status === 1 ? "Active" : "Completed"}</p>
              </div>
            </div>
            
            {/* Book Information */}
            <h4 className="mb-3">Book Information</h4>
            <div className="row mb-3">
              <div className="col-md-6">
                <p><strong>Book Identifier Code:</strong> {order.book_id?.identifier_code}</p>
              </div>
              <div className="col-md-6">
                <p><strong>Condition:</strong> {order.book_id?.condition}</p>
              </div>
            </div>

            <h5 className="mb-3">Book Set Details</h5>
            <div className="row">
              <div className="col-md-6">
                <p><strong>Title:</strong> {order.book_id?.bookSet_id?.title}</p>
              </div>
              <div className="col-md-6">
                <p><strong>Author:</strong> {order.book_id?.bookSet_id?.author}</p>
              </div>
              <div className="col-md-6">
                <p><strong>ISBN:</strong> {order.book_id?.bookSet_id?.isbn}</p>
              </div>
              <div className="col-md-6">
                <p><strong>Publisher:</strong> {order.book_id?.bookSet_id?.publisher}</p>
              </div>
              <div className="col-md-6">
                <p><strong>Shelf Location Code:</strong> {order.book_id?.bookSet_id?.shelfLocationCode}</p>
              </div>
              <div className="col-md-6">
                <p><strong>Physical Description:</strong> {order.book_id?.bookSet_id?.physicalDescription}</p>
              </div>
            </div>

            {/* User Information */}
            <h4 className="mt-4">User Information</h4>
            <div className="row mb-3">
              <div className="col-md-6">
                <p><strong>Requested By:</strong> {order.created_by?.fullName}</p>
              </div>
              <div className="col-md-6">
                <p><strong>Last Updated By:</strong> {order.updated_by?.fullName}</p>
              </div>
            </div>

            {/* Date Information */}
            <h4 className="mt-4">Dates</h4>
            <div className="row">
              <div className="col-md-6">
                <p><strong>Request Date:</strong> {new Date(order.requestDate).toLocaleDateString()}</p>
              </div>
              <div className="col-md-6">
                <p><strong>Borrow Date:</strong> {new Date(order.borrowDate).toLocaleDateString()}</p>
              </div>
              <div className="col-md-6">
                <p><strong>Due Date:</strong> {new Date(order.dueDate).toLocaleDateString()}</p>
              </div>
              <div className="col-md-6">
                <p><strong>Return Date:</strong> {order.returnDate ? new Date(order.returnDate).toLocaleDateString() : 'Not returned yet'}</p>
              </div>
            </div>

            {/* Renewal Information */}
            <h4 className="mt-4">Renewal Information</h4>
            <div className="row">
              <div className="col-md-6">
                <p><strong>Renewal Reason:</strong> {order.renew_reason || 'N/A'}</p>
              </div>
              <div className="col-md-6">
                <p><strong>Renewal Count:</strong> {order.renewalCount}</p>
              </div>
              <div className="col-md-6">
                <p><strong>Renewal Date:</strong> {order.renewalDate ? new Date(order.renewalDate).toLocaleDateString() : 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p>Order details not found.</p>
      )}
    </div>
  );
};

export default OrderDetail;
