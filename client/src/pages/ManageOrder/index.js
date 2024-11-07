import React, { useState, useEffect, useContext } from "react";
import { Modal, Button } from "react-bootstrap";
import axios from "axios";
import AuthContext from "../../contexts/UserContext";
import { toast } from "react-toastify";
import ReactPaginate from 'react-paginate';

const BorrowBookList = () => {
  const [showModal, setShowModal] = useState(false);
  const [condition, setCondition] = useState({
    condition: "",
    condition_detail: "",
  });
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

  // Fetch books function with identifierCode parameter
  const fetchBooks = async (identifierCode = "") => {
    try {
      let response;

      if (identifierCode) {
        response = await axios.get(`https://fptu-library/api/orders/by-identifier-code/${identifierCode}`);
      } else if (status === "") {
        response = await axios.get(`https://fptu-library/api/orders/getAll`);
      } else {
        response = await axios.get(`https://fptu-library/api/orders/filter?status=${status}`);
      }

      const data = response.data.data || [];
      const formattedData = Array.isArray(data) ? data : [data];

      if (formattedData.length === 0) {
        toast.info("Không tìm thấy sách với tiêu chí đã chọn.");
      }

      // Sort borrowBooks by the most recent date
      const sortedData = formattedData.sort((a, b) => new Date(b.borrowDate) - new Date(a.borrowDate));
      setBorrowBooks(sortedData);
    } catch (error) {
      const errorMessage = error.response ? error.response.data.message : "Đã xảy ra lỗi khi lấy sách đã mượn.";
      setBorrowBooks([]);
      console.error("Error fetching borrow books:", errorMessage);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [status]);

  const handleActionClick = (book, type) => {
    setSelectedBook(book);
    setModalType(type);
    setShowModal(true);
  };

  const handleConditionChange = (e) => {
    const { name, value } = e.target;
    setCondition((prevCondition) => ({
      ...prevCondition,
      [name]: value,
    }));
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
      };

      if (modalType === "reject") {
        updateData.reason_order = reason;
      }

      if (modalType === "receive") {
        updateData.condition = condition;
      }

      // Update the status of the order
      await axios.put(`https://fptu-library/api/orders/change-status/${selectedBook._id}`, updateData);

      // Update the condition of the book if the action is "receive"
      if (modalType === "receive") {
        await axios.put(`https://fptu-library/api/books/update/${selectedBook.book_id._id}`, condition);
      }

      setShowModal(false);
      setReason("");
      setCondition({ condition: "", condition_detail: "" }); // Reset condition state
      fetchBooks();
    } catch (error) {
      const errorMessage = error.response ? error.response.data.message : "Đã xảy ra lỗi khi cập nhật trạng thái sách.";
      toast.error(errorMessage);
      console.error(`Error ${modalType === 'approve' ? 'approving' : 'updating'} the book:`, error);
    }
  };

  const handleSelectAll = () => {
    if (selectedBooks.length === borrowBooks.length) {
      setSelectedBooks([]);
    } else {
      const allBookIds = borrowBooks.map((book) => book._id);
      setSelectedBooks(allBookIds);
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
      await axios.put(`https://fptu-library/api/orders/approve-all`, updateData);
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
            placeholder=" Nhập mã sách"
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
              <input type="checkbox" title="Chọn tất cả" onClick={handleSelectAll} />
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
                  <span className={`text-${book.status === "Pending" ? "warning" : book.status === "Approved" ? "success" : book.status === "Rejected" ? "danger" : book.status === "Received" ? "info" : "secondary"}              `}>
                    {book.status === "Pending" ? "Đang chờ" : book.status === "Approved" ? "Đã duyệt" : book.status === "Rejected" ? "Đã từ chối" : book.status === "Received" ? "Đã nhận" : book.status === "Canceled" ? "Đã hủy" : book.status === "Returned" ? "Đã trả" : book.status === "Overdue" ? "Quá hạn" : book.status === "Lost" ? "Mất" : book.status === "Renew Pending" ? "Đang chờ duyệt gia hạn" : "Khác"}
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
                  <td><Button variant="primary" title="Nhận" onClick={() => handleActionClick(book, "receive")}>
                    <i className="fa fa-check" aria-hidden="true"></i>
                  </Button></td>
                )}
                {book.status === "Renew Pending" && (
                  <td><Button variant="primary" title="Duyệt gia hạn" onClick={() => handleActionClick(book, "receive")}>
                    <i className="fa fa-check" aria-hidden="true"></i>
                  </Button></td>
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
                ? "Xác nhận nhận"
                : "Lý do từ chối"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalType === "approve" && (
            <>
              <p>
                Bạn có chắc chắn muốn {modalType} yêu cầu cho sách:{" "}
                <strong>{selectedBook?.book_id?.bookSet_id?.title}</strong>?
              </p>
            </>
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
              <div className="form-group mb-3">
                <label htmlFor="condition">Tình trạng sách</label>
                <select
                  className="form-select"
                  name="condition"
                  value={condition.condition}
                  onChange={handleConditionChange}
                >
                  <option value="Good">Good</option>
                  <option value="Light">Light</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                  <option value="Lost">Lost</option>
                </select>
              </div>
              <div className="form-group mb-3">
                <label htmlFor="condition_detail">Mô tả tình trạng</label>
                <input
                  type="text"
                  className="form-control"
                  id="condition_detail"
                  name="condition_detail"
                  value={condition.condition_detail}
                  onChange={handleConditionChange}
                  placeholder="Nhập mô tả tình trạng"
                />
              </div>
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
