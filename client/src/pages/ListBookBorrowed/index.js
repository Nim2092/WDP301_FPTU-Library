import React, { useState, useEffect, useContext } from "react";
import "./ListBookBorrowed.scss";
import { Link } from "react-router-dom";
import axios from "axios";
import AuthContext from "../../contexts/UserContext"; // Adjust this path to where your context is located
import 'font-awesome/css/font-awesome.min.css';
import ReactPaginate from 'react-paginate'; // Ensure this import is present
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
function ListBookBorrowed() {
  const navigate = useNavigate();
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(0); // New state for current page
  const [totalPages, setTotalPages] = useState(0); // New state for total pages
  const [statusFilter, setStatusFilter] = useState("");
  // Access user and token from AuthContext
  const { user, token } = useContext(AuthContext);

  useEffect(() => {
    const fetchBorrowedBooks = async () => {
      if (!user) return; // If no user is logged in, don't make the API call

      try {
        const response = await axios.get(
          `https://fptu-library.xyz/api/orders/by-user/${user.id}?page=${currentPage + 1}&status=${statusFilter}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
            },
          }
        );
        const sortedBooks = response.data.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sort by creation date
        setBorrowedBooks(sortedBooks); // Assuming the response contains an array of orders in `data.data`
        setTotalPages(response.data.totalPages); // Assuming the API returns total pages
      } catch (err) {
        console.error(err);
      }
    };

    fetchBorrowedBooks();
  }, [user, token, currentPage, statusFilter]); // Added currentPage and statusFilter to dependencies

  const handlePageClick = (data) => {
    setCurrentPage(data.selected); // Update current page on page change
  };

  // Function to handle the "Report lost book" action
  const handleReportLostBook = async (orderId, currentStatus) => {
    const confirmLost = window.confirm(
      "Are you sure you want to report this book as lost?"
    );
    if (confirmLost) {
      try {
        await axios.put(
          `https://fptu-library.xyz/api/orders/report-lost/${orderId}`,
          { userId: user.id, status: currentStatus, updated_by: user.id },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success("The book has been successfully reported as lost.");

        const response = await axios.get(
          `https://fptu-library.xyz/api/orders/by-user/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setBorrowedBooks(response.data.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to report the book as lost. Please try again.");
      }
    }
  };

  const handleCancelOrder = async (orderId) => {

    try {
      await axios.put(`https://fptu-library.xyz/api/orders/change-status/${orderId}`, {
        status: "Canceled",
        updated_by: user.id
      },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Đơn hàng đã được hủy thành công.");
    } catch (err) {
      const message = err.response?.data?.message || "Đã xảy ra lỗi.";
      console.error(err);
      toast.error(message);
    }
  };

  const handleRenewBook = async (orderId) => {
    navigate(`/renew-book/${orderId}`);
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
      case 'Renew Pending':
        return 'text-warning';
      default:
        return 'text-secondary';
    }
  };

  return (
    <div className="mt-5">
      <div className="row mb-3">
        <div className="col-md-9">
        </div>
        <div className="col-md-3">
          <select className="form-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">Tất cả</option>
            <option value="Appoved">Đã duyệt</option>
            <option value="Pending">Chờ duyệt</option>
            <option value="Received">Đã nhận</option>
            <option value="Canceled">Đã hủy</option>
            <option value="Lost">Đã mất</option>
            <option value="Returned">Đã trả</option>
            <option value="Renew Pending">Đang gia hạn</option>
          </select>
        </div>
      </div>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên sách</th>
            <th>Ngày mượn</th>
            <th>Ngày hẹn trả</th>
            <th>Trạng thái</th>
            <th>Mã định danh sách</th>
            <th>Số lần gia hạn</th>
            <th>Hành động</th>
          </tr>
        </thead>
        {borrowedBooks.length > 0 ? (
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
                  {order.status === "Pending" ? "Chờ duyệt" :
                    order.status === "Received" ? "Đã nhận" :
                      order.status === "Canceled" ? "Đã hủy" :
                        order.status === "Lost" ? "Đã mất" :
                          order.status === "Returned" ? "Đã trả" :
                            order.status === "Renew Pending" ? "Đang gia hạn" :
                              order.status === "Approved" ? "Đã duyệt" : "Không xác định"}
                </td>
                <td>{order.book_id?.identifier_code}</td>
                <td>{order.renewalCount}</td>
                <td className="text-center">
                  <div className="d-flex flex-wrap justify-content-center">
                    <button
                      onClick={() => handleReportLostBook(order._id, order.status)}
                      className="btn btn-outline-primary btn-sm m-1"
                      title="Báo mất sách"
                      style={{
                        cursor: order.status !== "Received" ? 'not-allowed' : 'pointer',
                        display: order.status !== "Received" ? 'none' : 'block'
                      }}
                    >
                      <img width="20" height="20" src="https://img.icons8.com/hatch/64/quest.png" alt="quest" />
                    </button>

                    <button
                      className="btn btn-outline-primary btn-sm m-1"
                      title="Gia hạn sách"
                      onClick={() => handleRenewBook(order._id)}
                      style={{
                        cursor: order.status !== "Received" ? 'not-allowed' : 'pointer',
                        display: order.status !== "Received" ? 'none' : 'block'
                      }}
                    >
                      <img width="20" height="20" src="https://img.icons8.com/ios/50/renew-subscription.png" alt="renew-subscription" />
                    </button>

                    <Link
                      to={`/order-book-detail/${order._id}`}
                      className="btn btn-outline-primary btn-sm m-1"
                      title="Xem chi tiết"
                    >
                      <img width="20" height="20" src="https://img.icons8.com/ios/30/visible--v1.png" alt="visible--v1" />
                    </Link>

                    <button
                      onClick={() => handleCancelOrder(order._id)}
                      className="btn btn-outline-danger btn-sm m-1"
                      title="Hủy đơn hàng"
                      style={{
                        cursor: order.status !== "Pending" ? 'not-allowed' : 'pointer',
                        display: order.status !== "Pending" ? 'none' : 'block'
                      }}
                    >
                      <img width="20" height="20" src="https://img.icons8.com/ios/30/cancel.png" alt="cancel" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        ) : (
          <tbody>
            <tr>
              <td colSpan="8" className="text-center">Không tìm thấy sách nào</td>
            </tr>
          </tbody>
        )}
      </table>
      {borrowedBooks.length > 10 && (
        <ReactPaginate
          previousLabel={'<'}
          nextLabel={'>'}
          breakLabel={'...'}
          pageCount={totalPages}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageClick}
          containerClassName={'pagination justify-content-end'}
          pageClassName={'page-item'}
          pageLinkClassName={'page-link'}
          previousClassName={'page-item'}
          previousLinkClassName={'page-link'}
          nextClassName={'page-item'}
          nextLinkClassName={'page-link'}
          breakClassName={'page-item'}
          breakLinkClassName={'page-link'}
          activeClassName={'active'}
        />
      )}
    </div>
  );
}

export default ListBookBorrowed;
