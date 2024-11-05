import React, { useState, useContext } from "react";
import axios from "axios";
import AuthContext from "../../contexts/UserContext";
import { toast, ToastContainer } from "react-toastify";
import ReactPaginate from "react-paginate";
import { Modal, Button, Form, Container } from "react-bootstrap";

function SearchResults({ books = [] }) {
  const { user } = useContext(AuthContext);
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [borrowDate, setBorrowDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [bookSet, setBookSet] = useState(null);
  const [book, setBook] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);

  const itemsPerPage = 5; // Số sách hiển thị trên mỗi trang

  // Lấy dữ liệu sách cho phân trang
  const offset = currentPage * itemsPerPage;
  const currentBooks = books.slice(offset, offset + itemsPerPage);

  // Mở Modal mượn sách và lấy thông tin sách
  const openBorrowModal = async (bookId) => {
    setSelectedBookId(bookId);
    setLoading(true);
    try {
      const response = await axios.get(`https://fptu-library.xyz/api/book-sets/available/${bookId}`);
      setBookSet(response.data.bookSet);
      setBook(response.data.availableBooks);
      setShowModal(true);
      setBorrowDate(new Date().toISOString().slice(0, 10));
      setDueDate(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10));
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu sách:", error);
      toast.error("Lỗi khi lấy dữ liệu sách.");
    }
    setLoading(false);
  };

  // Xử lý yêu cầu mượn sách
  const handleBorrowSubmit = async () => {

    setLoading(true);
    try {
      const booksetCurrent = bookSet._id;
      const ordersResponse = await axios.get(`https://fptu-library.xyz/api/orders/by-user/${user.id}`);
      const orders = ordersResponse.data.data;
      const hasDifferentBookSet = orders.some((order) => order.book_id.bookSet_id._id === booksetCurrent);

      if (hasDifferentBookSet && (orders.status === "Pending" || orders.status === "Approved" 
        || orders.status === "Received" || orders.status === "Overdue" || orders.status === "Renew Pending")) {
        toast.error("Bạn không thể mượn sách từ bộ sách này vì đã có sách đang mượn.");
        return;
      }

      const firstBook = book[0];
      const response = await axios.post(`https://fptu-library.xyz/api/orders/create-borrow/${firstBook._id}`, {
        book_id: firstBook._id,
        userId: user.id,
        borrowDate: borrowDate,
        dueDate: dueDate,
        // created_by: user.id,
        // updated_by: user.id,
      });

      if (response.status === 201) {
        toast.success("Đã mượn sách thành công!");
        setShowModal(false);
      } else {
        console.error("Lỗi khi mượn sách:", response.data.message);
        toast.error(response.data.message);
      }
    } catch (error) {
      const message = error.response?.data?.message || "Đã xảy ra lỗi.";
      console.error(error);
      toast.error(message);
    }
    setLoading(false);
  };

  const closeModal = () => {
    setShowModal(false);
    setBorrowDate("");
    setDueDate("");
  };

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  return (
    <Container className="mt-4">
      <ToastContainer />
      {books.length === 0 ? (
        <p>Không tìm thấy sách</p>
      ) : (
        currentBooks.map((book) => (
          <div className="card mb-4 p-3" key={book._id}>
            <div className="row no-gutters">
              <div className="col-md-3">
                {book.image ? (
                  <img
                  src={`https://fptu-library.xyz/api/book-sets/image/${book.image.split("/").pop()}`}
                  alt={book.title}
                  style={{ width: "250px", height: "auto" }}
                />
                ) : (
                  <img
                    src={"https://www.shutterstock.com/image-vector/default-ui-image-placeholder-wireframes-260nw-1037719192.jpg"}
                    alt="Default"
                    style={{ width: "250px", height: "auto" }}
                  />
                )}
              </div>
              <div className="col-md-9">
                <div className="card-body">
                  <h5 className="card-title">{book.title}</h5>
                  <p className="card-text"><strong>Tác giả:</strong> {book.author}</p>
                  <p className="card-text"><strong>Nhà xuất bản:</strong> {book.publisher}</p>
                  <p className="card-text"><strong>Năm xuất bản:</strong> {new Date(book.publishedYear).getFullYear()}</p>
                  <p className="card-text"><strong>ISBN:</strong> {book.isbn}</p>
                  <p className="card-text"><strong>Tổng số bản:</strong> {book.totalCopies}</p>
                  <p className="card-text"><strong>Số bản có sẵn:</strong> {book.availableCopies}</p>
                  <p className="card-text"><strong>Số bản đã mượn:</strong> {book.totalCopies - book.availableCopies}</p>

                  <button
                    className="btn btn-primary float-end"
                    onClick={() => openBorrowModal(book._id)}
                    disabled={loading}
                  >
                    {loading ? "Đang xử lý..." : "Mượn sách"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))
      )}

      {/* Phân trang */}
      <ReactPaginate
        previousLabel={"Trước"}
        nextLabel={"Tiếp"}
        breakLabel={"..."}
        pageCount={Math.ceil(books.length / itemsPerPage)}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageClick}
        containerClassName={"pagination justify-content-center"}
        pageClassName={"page-item"}
        pageLinkClassName={"page-link"}
        previousClassName={"page-item"}
        previousLinkClassName={"page-link"}
        nextClassName={"page-item"}
        nextLinkClassName={"page-link"}
        breakClassName={"page-item"}
        breakLinkClassName={"page-link"}
        activeClassName={"active"}
      />

      {/* Modal mượn sách */}
      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Mượn sách</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="borrowDate">
              <Form.Label>Ngày mượn</Form.Label>
              <Form.Control
                type="date"
                value={borrowDate}
                onChange={(e) => setBorrowDate(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="dueDate" className="mt-3">
              <Form.Label>Ngày trả</Form.Label>
              <Form.Control
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleBorrowSubmit} disabled={loading}>
            {loading ? "Đang xử lý..." : "Xác nhận mượn"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default SearchResults;
