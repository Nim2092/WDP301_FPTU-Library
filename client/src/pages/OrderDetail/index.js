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
        const response = await axios.get(`https://fptu-library.xyz/api/orders/by-order/${orderId}`);
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

  if (loading) return <p className="text-center">Đang tải...</p>;
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
                <h3 className="card-title">Thông tin đơn mượn</h3>
                <div className="row mb-3" >
                  <div className="col-md-6"><strong>Mã đơn hàng:</strong></div>
                  <div className="col-md-6">{order._id}</div>
                </div>
                <div className="row mb-3" >
                  <div className="col-md-6"><strong>Trạng thái:</strong></div>
                  <div className="col-md-6" style={{
                    color: order.status === 'Pending' ? 'blue' : order.status === 'Approved' ? 'green'
                      : order.status === 'Rejected' ? 'orange' : order.status === 'Received' ? 'red' : order.status === 'Canceled' ? 'yellow'
                        : order.status === 'Returned' ? 'purple' : order.status === 'Overdue' ? 'pink' : order.status === 'Lost' ? 'brown'
                          : order.status === 'Renew Pending' ? 'gray' : 'black'
                  }}>
                    {order.status === "Pending" ? "Chờ duyệt" : order.status === "Approved" ? "Đã duyệt" : order.status === "Rejected" ? "Đã từ chối"
                      : order.status === "Received" ? "Đã nhận" : order.status === "Canceled" ? "Đã hủy" : order.status === "Returned" ? "Đã trả"
                        : order.status === "Overdue" ? "Quá hạn" : order.status === "Lost" ? "Mất" : order.status === "Renew Pending" ? "Chờ gia hạn" : "Khác"}
                  </div>
                </div>
                <hr />

                {/* User Information */}
                <h4 className="mt-3">Thông tin người mượn</h4>
                <div className="row mb-3">
                  <div className="col-md-6"><strong>Yêu cầu bởi:</strong></div>
                  <div className="col-md-6">{order.created_by?.fullName}</div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-6"><strong>Cập nhật bởi:</strong></div>
                  <div className="col-md-6">{order.updated_by?.fullName}</div>
                </div>
                <hr />

                {/* Renewal Information */}
                <h4 className="mt-3">Thông tin gia hạn</h4>
                <div className="row mb-3">
                  <div className="col-md-6"><strong>Lý do gia hạn:</strong></div>
                  <div className="col-md-6">{order.renew_reason || 'N/A'}</div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-6"><strong>Số lần gia hạn:</strong></div>
                  <div className="col-md-6">{order.renewalCount}</div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-6"><strong>Ngày gia hạn:</strong></div>
                  <div className="col-md-6">{order.renewalDate ? new Date(order.renewalDate).toLocaleDateString() : 'N/A'}</div>
                </div>
              </div>

              {/* Right Column */}
              <div className="col-md-6" style={{ borderLeft: '1px solid #ccc' }}>
                {/* Book Information */}
                <h4 className="mb-3">Thông tin sách</h4>
                <div className="row mb-3">
                  <div className="col-md-6"><strong>Mã sách:</strong></div>
                  <div className="col-md-6">{order.book_id?.identifier_code}</div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-6"><strong>Tình trạng:</strong></div>
                  <div className="col-md-6">{order.book_id?.condition === "Good" ? "Tốt" : order.book_id?.condition === "Light" ? "Hư hại nhẹ"
                    : order.book_id?.condition === "Medium" ? "Hư hại nặng" : order.book_id?.condition === "Hard" ? "Hư hại nặng" : "Hủy"}</div>
                </div>

                <div>
                  <div className="row mb-3">
                    <div className="col-md-6"><strong>Tên sách:</strong></div>
                    <div className="col-md-6">{order.book_id?.bookSet_id?.title}</div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-6"><strong>Tác giả:</strong></div>
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
                    <div className="col-md-6"><strong>Ngày yêu cầu:</strong></div>
                    <div className="col-md-6">{new Date(order.requestDate).toLocaleDateString()}</div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-6"><strong>Ngày mượn:</strong></div>
                    <div className="col-md-6">{new Date(order.borrowDate).toLocaleDateString()}</div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-6"><strong>Ngày hết hạn:</strong></div>
                    <div className="col-md-6">{new Date(order.dueDate).toLocaleDateString()}</div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-6"><strong>Ngày trả:</strong></div>
                    <div className="col-md-6">{order.returnDate ? new Date(order.returnDate).toLocaleDateString() : 'Chưa trả'}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center">Không tìm thấy thông tin đơn hàng.</p>
      )}
    </div>
  );
};

export default OrderDetail;
