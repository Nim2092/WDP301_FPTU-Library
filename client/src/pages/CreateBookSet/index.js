import React, { useState, useEffect, useContext } from "react";
import { Modal, Button } from "react-bootstrap";
import axios from "axios";
import AuthContext from "../../contexts/UserContext";
import { toast } from "react-toastify";
import ReactPaginate from 'react-paginate';

const BorrowBookList = () => {
  const [showModal, setShowModal] = useState(false);
  const [condition, setCondition] = useState(""); // Separate state for condition
  const [conditionDetail, setConditionDetail] = useState(""); // Separate state for condition_detail
  const [modalType, setModalType] = useState(""); // 'approve', 'reject', 'receive', etc.
  const [selectedBook, setSelectedBook] = useState(null); // Holds the selected book for rejection or approval
  const [reason, setReason] = useState(""); // Holds the reason for rejection
  const [borrowBooks, setBorrowBooks] = useState([]); // List of borrowed books
  const [status, setStatus] = useState(""); // Holds the status filter
  const { user } = useContext(AuthContext); // Get the user context
  const [selectedBooks, setSelectedBooks] = useState([]); // For storing selected books' IDs
  const [identifierCode, setIdentifierCode] = useState(""); // Holds the identifier code for search
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10; // Number of items per page
  const [renew_reason, setRenewReason] = useState("");
  const [renewalDate, setRenewalDate] = useState("");

  const fetchBooks = async (identifierCode = "") => {
    try {
      let response;
      if (identifierCode) {
        response = await axios.get(`http://localhost:9999/api/orders/manage-by-identifier-code/${identifierCode}`);
      } else if (status === "") {
        response = await axios.get(`http://localhost:9999/api/orders/getAll`);
      } else {
        response = await axios.get(`http://localhost:9999/api/orders/filter?status=${status}`);
      } 
      const data = response.data.data || [];
      const formattedData = Array.isArray(data) ? data : [data];

      if (formattedData.length === 0) {
        toast.info("Không tìm thấy sách với tiêu chí đã chọn.");
      }

      const sortedData = formattedData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setBorrowBooks(sortedData);
    } catch (error) {
      const errorMessage = error.response ? error.response.data.message : "Đã xảy ra lỗi khi lấy sách đã mượn.";
      setBorrowBooks([]);
      console.error("Error fetching borrow books:", errorMessage);
    }
  };

  useEffect(() => {
    fetchBooks();
    const interval = setInterval(() => {
      fetchBooks();
    }, 5000); // Gọi fetchBooks mỗi 5 giây
  
    return () => clearInterval(interval); // Dọn dẹp interval khi component unmount hoặc khi status thay đổi
  }, [status]);
  

  const handleActionClick = (book, type) => {
    setSelectedBook(book);
    setModalType(type);
    setShowModal(true);

    if (type === "receive") {
      setCondition(book?.book_id?.condition || ""); // Prefill condition if available
      setConditionDetail(book?.book_id?.condition_detail || ""); // Prefill condition_detail if available

      // Prefill renew_reason and renewalDate if the status is Renew Pending
      if (book.status === "Renew Pending") {
        setRenewReason(book.renew_reason || ""); // Set renew reason if available
        setRenewalDate(book.renewalDate ? new Date(book.renewalDate).toISOString().slice(0, 10) : ""); // Format date as YYYY-MM-DD
      }
    }
  };


  const handleConditionChange = (e) => {
    setCondition(e.target.value);
  };

  const handleConditionDetailChange = (e) => {
    setConditionDetail(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      let newStatus = "";
      switch (modalType) {
        case "approve":
          newStatus = "Approved";
          break;
        case "reject":
          newStatus = "Rejected";
          break;
        case "receive":
          newStatus = "Received";
          break;
        default:
          newStatus = "Pending";
          break;
      }

      const updateData = {
        status: newStatus,
        updated_by: user.id,
        ...(modalType === "receive" && { condition, condition_detail: conditionDetail })
      };

      if (modalType === "reject") {
        updateData.reason_order = reason;
      }

      await axios.put(`http://localhost:9999/api/orders/change-status/${selectedBook._id}`, updateData);

      if (modalType === "receive") {
        await axios.put(`http://localhost:9999/api/books/update/${selectedBook.book_id._id}`, {
          condition,
          condition_detail: conditionDetail,
        });
      }

      setShowModal(false);
      setReason("");
      setCondition("");
      setConditionDetail("");
      fetchBooks();
    } catch (error) {
      const errorMessage = error.response ? error.response.data.message : "Đã xảy ra lỗi khi cập nhật trạng thái sách.";
      toast.error(errorMessage);
      console.error(`Error ${modalType === 'approve' ? 'approving' : 'updating'} the book:`, error);
    }
  };

  const handleSelectAll = () => {
    if (selectedBooks.length === currentBooks.length) {
      setSelectedBooks([]);
    } else {
      const allVisibleBookIds = currentBooks.map((book) => book._id);
      setSelectedBooks(allVisibleBookIds);
    }
  };

  const handleSelectBook = (bookId) => {
    if (selectedBooks.includes(bookId)) {
      setSelectedBooks(selectedBooks.filter((id) => id !== bookId));
    } else {
      setSelectedBooks([...selectedBooks, bookId]);
    }
  };

  const handleApproveSelected = async () => {
    if (selectedBooks.length === 0) {
      toast.error("Không có đơn đã chọn.");
      return;
    }

    try {
      const updateData = {
        orderIds: selectedBooks,
        updated_by: user.id,
      };
      await axios.put(`http://localhost:9999/api/orders/approve-all`, updateData);
      toast.success("Đơn đã chọn đã duyệt thành công!");
      fetchBooks();
      setSelectedBooks([]);
    } catch (error) {
      const errorMessage = error.response ? error.response.data.message : "Đã xảy ra lỗi khi duyệt đơn đã chọn.";
      toast.error(errorMessage);
      console.error("Error approving selected books:", error);
    }
  };

  const handleSearchByIdentifierCode = () => {
    fetchBooks(identifierCode);
  };

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const currentBooks = borrowBooks.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  return (
    <div className="mt-4">
      <div className="d-flex justify-content-between mb-3">
        <div className="search-bar d-flex align-items-center">
          <input
            type="text"
            style={{ width: "300px", height: "40px", borderRadius: "10px", border: "1px solid #ccc" }}
            placeholder=" Nhập mã định danh sách"
            value={identifierCode}
            onChange={(e) => setIdentifierCode(e.target.value)}
          />
          <Button variant="primary" style={{ marginLeft: "10px" }} title="Tìm kiếm" onClick={handleSearchByIdentifierCode}>
            <i className="fa fa-search" aria-hidden="true"></i>
          </Button>
        </div>
        <div className="d-flex align-items-center">
          <select
            className="form-select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">Tất cả đơn</option>
            <option value="Pending">Đang chờ</option>
            <option value="Approved">Đã duyệt</option>
            <option value="Rejected">Đã từ chối</option>
            <option value="Received">Đã nhận</option>
            <option value="Canceled">Đã hủy</option>
            <option value="Returned">Đã trả</option>
            <option value="Overdue">Quá hạn</option>
            <option value="Lost">Mất</option>
            <option value="Renew Pending">Đang chờ duyệt gia hạn</option>
          </select>
        </div>
        <div className="d-flex align-items-center">
          <Button variant="primary" style={{ marginRight: "10px" }} title="Duyệt" onClick={handleApproveSelected}>
            Duyệt
          </Button>
        </div>
      </div>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                title="Chọn tất cả"
                onChange={handleSelectAll}
                checked={selectedBooks.length === currentBooks.length && currentBooks.length > 0}
              />
            </th>
            <th>ID</th>
            <th>Tên sách</th>
            <th>Ngày mượn</th>
            <th>Ngày hẹn trả</th>
            <th>Mã định danh sách</th>
            <th>Trạng thái</th>
            <th>Tình trạng sách</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {currentBooks.length > 0 ? (
            currentBooks.map((book, index) => (
              <tr key={book._id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedBooks.includes(book._id)}
                    onChange={() => handleSelectBook(book._id)}
                  />
                </td>
                <td>{index + 1}</td>
                <td className="text-capitalize text-start" style={{ wordBreak: 'break-word', maxWidth: '18ch' }}>
                  {book.book_id?.bookSet_id?.title}
                </td>
                <td>{new Date(book.borrowDate).toLocaleDateString()}</td>
                <td>{new Date(book.dueDate).toLocaleDateString()}</td>
                <td>{book.book_id?.identifier_code}</td>
                <td>
                  <span className={`text-${book.status === "Pending" ? "warning" : book.status === "Approved" ? "success" :
                    book.status === "Rejected" ? "danger" : book.status === "Received" ? "info" : "secondary"}`}>
                    {book.status === "Pending" ? "Đang chờ" : book.status === "Approved" ? "Đã duyệt"
                      : book.status === "Rejected" ? "Đã từ chối" : book.status === "Received" ? "Đã nhận" : book.status === "Canceled" ? "Đã hủy"
                        : book.status === "Returned" ? "Đã trả" : book.status === "Overdue" ? "Quá hạn" : book.status === "Lost" ? "Mất"
                          : book.status === "Renew Pending" ? "Đang chờ duyệt gia hạn" : "Khác"}
                  </span>
                </td>
                <td>{book.book_id?.condition === "Good" ? "Tốt" : book.book_id?.condition === "Light" ? "Hư hỏng không đáng kể"
                  : book.book_id?.condition === "Medium" ? "Hư hỏng nhẹ" : book.book_id?.condition === "Hard" ? "Hư hỏng nặng" : book.book_id?.condition === "Lost" ? "Mất sách" : "Khác"}</td>
                {book.status === "Pending" && (
                  <td>
                    <Button variant="success" style={{ marginRight: '10px' }} title="Duyệt" onClick={() => handleActionClick(book, "approve")}>
                      <i className="fa fa-check" aria-hidden="true"></i>
                    </Button>
                    <Button variant="danger" title="Từ chối" onClick={() => handleActionClick(book, "reject")}>
                      <i className="fa fa-times" aria-hidden="true"></i>
                    </Button>
                  </td>
                )}
                {book.status === "Approved" && (
                  <td>
                    <Button variant="primary" style={{ marginRight: '10px' }} title="Nhận" onClick={() => handleActionClick(book, "receive")}>
                      <i className="fa fa-check" aria-hidden="true"></i>
                    </Button>
                    <Button variant="danger" title="Từ chối" onClick={() => handleActionClick(book, "reject")}>
                      <i className="fa fa-times" aria-hidden="true"></i>
                    </Button>
                  </td>
                )}
                {book.status === "Renew Pending" && (
                  <td>
                    <Button variant="primary" style={{ marginRight: '10px' }} title="Duyệt gia hạn" onClick={() => handleActionClick(book, "receive")}>
                      <i className="fa fa-check" aria-hidden="true"></i>
                    </Button>
                    <Button variant="danger" title="Từ chối" onClick={() => handleActionClick(book, "reject")}>
                      <i className="fa fa-times" aria-hidden="true"></i>
                    </Button>
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="text-center">Không tìm thấy sách</td>
            </tr>
          )}
        </tbody>
      </table>

      <ReactPaginate
        previousLabel={'<'}
        nextLabel={'>'}
        breakLabel={'...'}
        pageCount={Math.ceil(borrowBooks.length / itemsPerPage)}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageChange}
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

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {modalType === "approve"
              ? "Xác nhận duyệt"
              : modalType === "receive"
                ? "Xác nhận nhận sách"
                : "Lý do từ chối"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalType === "approve" && (
            <p>
              Bạn có chắc chắn muốn {modalType} yêu cầu cho sách:{" "}
              <strong>{selectedBook?.book_id?.bookSet_id?.title}</strong>?
            </p>
          )}
          {modalType === "reject" && (
            <div className="form-group mb-3">
              <label htmlFor="reason">Lý do từ chối</label>
              <input
                type="text"
                className="form-control"
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Nhập lý do từ chối"
              />
            </div>
          )}
          {modalType === "receive" && (
            <div className="form-group mb-3">
              <label htmlFor="condition">Tình trạng sách</label>
              <select
                className="form-select"
                name="condition"
                value={condition}
                onChange={handleConditionChange}
              >
                <option value="Good">Tốt</option>
                <option value="Light">Hư hỏng không đáng kể</option>
                <option value="Medium">Hư hỏng nhẹ</option>
                <option value="Hard">Hư hỏng nặng</option>
                <option value="Lost">Mất sách</option>
              </select>
              <div className="form-group mt-3">
                <label htmlFor="condition_detail">Mô tả tình trạng</label>
                <input
                  type="text"
                  className="form-control"
                  id="condition_detail"
                  name="condition_detail"
                  value={conditionDetail}
                  onChange={handleConditionDetailChange}
                  placeholder="Nhập mô tả tình trạng"
                />
              </div>
              {selectedBook?.status === "Renew Pending" && (
                <>
                  <div className="form-group mt-3">
                    <label htmlFor="renew_reason">Lý do gia hạn</label>
                    <input
                      type="text"
                      className="form-control"
                      id="renew_reason"
                      value={renew_reason}
                      onChange={(e) => setRenewReason(e.target.value)}
                      placeholder="Nhập lý do gia hạn"
                      readOnly
                    />
                  </div>
                  <div className="form-group mt-3">
                    <label htmlFor="renewalDate">Ngày gia hạn</label>
                    <input
                      type="date"
                      className="form-control"
                      id="renewalDate"
                      value={renewalDate}
                      onChange={(e) => setRenewalDate(e.target.value)}
                      placeholder="Nhập ngày gia hạn"
                      readOnly
                    />
                  </div>
                </>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {modalType === "approve" || modalType === "receive" ? "Xác nhận" : "Gửi"}
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
};

export default BorrowBookList;
