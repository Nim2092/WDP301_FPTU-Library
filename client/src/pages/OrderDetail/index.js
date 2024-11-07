import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';


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
    <div className="container my-5 shadow-md" >
      {order ? (
        <div className="card p-3" style={{ backgroundColor: '#f8f9fa' }}>
          <div className="">
            <div className="row">
              {/* Left Column */}
              <div className="col-md-6" >
                {/* Order Information */}
                <h3 className="card-title">Order Information</h3>
                <div className="row mb-3" >
                  <div className="col-md-6"><strong>Order ID:</strong></div>
                  <div className="col-md-6">{order._id}</div>
                </div>
                <div className="row mb-3" >
                  <div className="col-md-6"><strong>Status:</strong></div>
                  <div className="col-md-6" style={{ color: order.status === 'Pending' ? 'blue' : order.status === 'Approved' ? 'green' 
                    : order.status === 'Rejected' ? 'orange' : order.status === 'Received' ? 'red' : order.status === 'Canceled' ? 'yellow' 
                    : order.status === 'Returned' ? 'purple' : order.status === 'Overdue' ? 'pink' : order.status === 'Lost' ? 'brown' 
                    : order.status === 'Renew Pending' ? 'gray' : 'black' }}>
                    {order.status}
                  </div>
                </div>
                <hr />

                {/* User Information */}
                <h4 className="mt-3">User Information</h4>
                <div className="row mb-3">
                  <div className="col-md-6"><strong>Requested By:</strong></div>
                  <div className="col-md-6">{order.created_by?.fullName}</div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-6"><strong>Last Updated By:</strong></div>
                  <div className="col-md-6">{order.updated_by?.fullName}</div>
                </div>
                <hr />

                {/* Renewal Information */}
                <h4 className="mt-3">Renewal Information</h4>
                <div className="row mb-3">
                  <div className="col-md-6"><strong>Renewal Reason:</strong></div>
                  <div className="col-md-6">{order.renew_reason || 'N/A'}</div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-6"><strong>Renewal Count:</strong></div>
                  <div className="col-md-6">{order.renewalCount}</div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-6"><strong>Renewal Date:</strong></div>
                  <div className="col-md-6">{order.renewalDate ? new Date(order.renewalDate).toLocaleDateString() : 'N/A'}</div>
                </div>
              </div>

              {/* Right Column */}
              <div className="col-md-6" style={{ borderLeft: '1px solid #ccc' }}>
                {/* Book Information */}
                <h4 className="mb-3">Book Information</h4>
                <div className="row mb-3">
                  <div className="col-md-6"><strong>Book Identifier Code:</strong></div>
                  <div className="col-md-6">{order.book_id?.identifier_code}</div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-6"><strong>Condition:</strong></div>
                  <div className="col-md-6">{order.book_id?.condition}</div>
                </div>

                <div>
                  <div className="row mb-3">
                    <div className="col-md-6"><strong>Title:</strong></div>
                    <div className="col-md-6">{order.book_id?.bookSet_id?.title}</div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-6"><strong>Author:</strong></div>
                    <div className="col-md-6">{order.book_id?.bookSet_id?.author}</div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-6"><strong>ISBN:</strong></div>
                    <div className="col-md-6">{order.book_id?.bookSet_id?.isbn}</div>
                  </div>
                </div>
                {/* Date Information */}
                <div >
                  <div className="row mb-3">
                    <div className="col-md-6"><strong>Request Date:</strong></div>
                    <div className="col-md-6">{new Date(order.requestDate).toLocaleDateString()}</div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-6"><strong>Borrow Date:</strong></div>
                    <div className="col-md-6">{new Date(order.borrowDate).toLocaleDateString()}</div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-6"><strong>Due Date:</strong></div>
                    <div className="col-md-6">{new Date(order.dueDate).toLocaleDateString()}</div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-6"><strong>Return Date:</strong></div>
                    <div className="col-md-6">{order.returnDate ? new Date(order.returnDate).toLocaleDateString() : 'Not returned yet'}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center">Order details not found.</p>
      )}
    </div>
  );
};

export default OrderDetail;
