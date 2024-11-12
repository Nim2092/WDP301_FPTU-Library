import "./Bookdetail.scss";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import AuthContext from '../../contexts/UserContext';
import { Modal, Button, Form } from 'react-bootstrap';

function BookDetail() {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const [bookSet, setBookSet] = useState(null);
  const [books, setBooks] = useState([]);
  const [image, setImage] = useState(null);
  const [numberOfCopies, setNumberOfCopies] = useState();
  const [identifierCode, setIdentifierCode] = useState("");
  const [condition, setCondition] = useState();
  const [conditionDetail, setConditionDetail] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [statusFilter, setStatusFilter] = useState("");
  const [conditionFilter, setConditionFilter] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bookIdToDelete, setBookIdToDelete] = useState(null);

  const fetchBookDetail = async () => {
    try {
      const response = await axios.get(`http://localhost:9999/api/book-sets/${id}`);
      setBookSet(response.data.bookSet);
      setBooks(response.data.books);
      const image = response.data.bookSet.image;
      if (image) {
        setImage(`http://localhost:9999/api/book-sets/image/${image.split("/").pop()}`);
      }
    } catch (error) {
      console.error("Error fetching book details:", error);
    }
  };

  useEffect(() => {
    fetchBookDetail();
  }, [id]);

  useEffect(() => {
    const filterBooks = () => {
      let filtered = books;
      if (statusFilter) {
        filtered = filtered.filter(book => book.status === statusFilter);
      }
      if (conditionFilter) {
        filtered = filtered.filter(book => book.condition === conditionFilter);
      }
      setFilteredBooks(filtered);
    };

    filterBooks();
  }, [books, statusFilter, conditionFilter]);

  const handleSearchCopy = () => {
    if (identifierCode.trim() === "") {
      setFilteredBooks(books);
    } else {
      const filtered = books.filter(book =>
        book.identifier_code.includes(identifierCode)
      );
      setFilteredBooks(filtered);
    }
  };

  const handleAddNewCopy = async () => {
    try {
      await axios.post(`http://localhost:9999/api/book-sets/add-books`, {
        bookSet_id: id,
        numberOfCopies: parseInt(numberOfCopies),
        createdBy: user.id
      });
      toast.success("Thêm sách thành công");
      await fetchBookDetail();
    } catch (error) {
      toast.error("Thêm sách lỗi");
    }
  };

  const handleEditCopy = async (id) => {
    try {
      const response = await axios.put(`http://localhost:9999/api/books/update/${id}`, {
        condition: condition,
        condition_detail: conditionDetail,
        updatedBy: user.id
      });
      if (response.status === 200) {
        toast.success("Sửa sách thành công");
        await fetchBookDetail();
      }
    } catch (error) {
      toast.error("Sửa sách lỗi");
    }
  };

  const handleShowDeleteModal = (id) => {
    setBookIdToDelete(id);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setBookIdToDelete(null);
  };

  const handleDeleteCopy = async () => {
    try {
      await axios.delete(`http://localhost:9999/api/books/delete/${bookIdToDelete}`);
      toast.success("Xóa sách thành công");
      await fetchBookDetail();
    } catch (error) {
      toast.error("Xóa sách lỗi");
    } finally {
      handleCloseDeleteModal();
    }
  };

  const handleShowEditModal = (id) => {
    setSelectedBookId(id);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => setShowEditModal(false);

  const handleShowAddModal = () => setShowAddModal(true);
  const handleCloseAddModal = () => setShowAddModal(false);

  const handleEditSubmit = async () => {
    await handleEditCopy(selectedBookId);
    handleCloseEditModal();
  };

  const handleAddSubmit = async () => {
    await handleAddNewCopy();
    handleCloseAddModal();
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);

  return (
    <div className="container">
      <ToastContainer />
      {bookSet && (
        <div className="book-detail">
          <div className="row mt-3 book-detail-info shadow-sm p-3 mb-5 bg-body rounded" >
            <div className="col-md-4">
              <img src={image} alt={bookSet.title} style={{ width: '250px', marginBottom: '10px' }} />
            </div>
            <div className="col-md-8 row">
              <div className="row mb-2">
                <div className="col-md-6"><strong>Tên sách:</strong></div>
                <div className="col-md-6">{bookSet.title}</div>
              </div>
              <div className="row mb-2">
                <div className="col-md-6"><strong>Tác giả:</strong></div>
                <div className="col-md-6">{bookSet.author}</div>
              </div>
              <div className="row mb-2">
                <div className="col-md-6"><strong>Năm xuất bản:</strong></div>
                <div className="col-md-6">{new Date(bookSet.publishedYear).getFullYear()}</div>
              </div>
              <div className="row mb-2">
                <div className="col-md-6"><strong>Nhà xuất bản:</strong></div>
                <div className="col-md-6">{bookSet.publisher}</div>
              </div>
              <div className="row mb-2">
                <div className="col-md-6"><strong>Mã ISBN:</strong></div>
                <div className="col-md-6">{bookSet.isbn}</div>
              </div>
              <div className="row mb-2">
                <div className="col-md-6"><strong>Giá:</strong></div>
                <div className="col-md-6">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(bookSet.price)}</div>
              </div>
              <div className="row mb-2">
                <div className="col-md-6"><strong>Tổng số bản sao:</strong></div>
                <div className="col-md-6">{bookSet.totalCopies}</div>
              </div>
              <div className="row mb-2">
                <div className="col-md-6"><strong>Số bản sao còn lại:</strong></div>
                <div className="col-md-6">{bookSet.availableCopies}</div>
              </div>
              <div className="row mb-2">
                <div className="col-md-6"><strong>Số bản sao đã mượn:</strong></div>
                <div className="col-md-6">{bookSet.totalCopies - bookSet.availableCopies}</div>
              </div>
              <div className="row mb-2">
                <div className="col-md-6"><strong>Số bản sao tốt:</strong></div>
                <div className="col-md-6">{books.filter(book => book.condition === 'Good').length}</div>
              </div>
              <div className="row mb-2">
                <div className="col-md-6"><strong>Số bản sao cứng:</strong></div>
                <div className="col-md-6">{books.filter(book => book.condition === 'Hard').length}</div>
              </div>
              <div className="row mb-2">
                <div className="col-md-6"><strong>Số bản sao trung bình:</strong></div>
                <div className="col-md-6">{books.filter((book) => book.condition === "Medium").length}</div>
              </div>
            </div>
          </div>
          <div className="book-copies">
            <div className="row">
              <div className="col-md-6">
                <h3 className="text-start">Danh sách các bản sao</h3>
              </div>
              <div className="col-md-3">
                <select className="form-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  <option value="">Tất cả</option>
                  <option value="Available">Còn lại</option>
                  <option value="Borrowed">Đã mượn</option>
                  <option value="Destroyed">Đã hủy</option>
                </select>

              </div>
              <div className="col-md-3">
                <select className="form-select" value={conditionFilter} onChange={(e) => setConditionFilter(e.target.value)}>
                  <option value="">Tất cả</option>
                  <option value="Good">Tốt</option>
                  <option value="Light">Hơi bị hư</option>
                  <option value="Medium">Hư hại nhẹ</option>
                  <option value="Hard">Hư hại nặng</option>
                  <option value="Lost">Mất</option>
                </select>
              </div>
            </div>
            <div className="row mt-3 mb-3">
              <div className="search-copy col-md-6" >
                <input
                  type="text"
                  placeholder="Nhập mã định danh"
                  value={identifierCode}
                  style={{ width: '200px', padding: '5px', borderRadius: '5px', marginRight: '10px' }}
                  onChange={(e) => setIdentifierCode(e.target.value)}
                />
                <button className="btn btn-primary" onClick={handleSearchCopy}>Tìm kiếm</button>
              </div>
              
              <div className="col-md-6">
                <button className="btn btn-primary float-end" onClick={handleShowAddModal}>Thêm bản sao</button>
              </div>
            </div>
            <div className="col-md-12">
              <table className="table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Mã định danh</th>
                    <th>Trạng thái</th>
                    <th>Tình trạng</th>
                    <th>Chi tiết tình trạng</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {currentBooks.length > 0 ? (
                    currentBooks.map((book, index) => (
                      <tr key={book._id}>
                        <td>{indexOfFirstItem + index + 1}</td>
                        <td>{book.identifier_code}</td>
                        <td>{book.status === "Available" ? "Còn lại" : book.status === "Borrowed" ? "Đã mượn" : book.status === "Destroyed" ? "Đã hủy" : ""}</td>
                        <td>{book.condition === "Good" ? "Tốt" : book.condition === "Light" ? "Hơi bị hư" : book.condition === "Medium" ? "Hư hại nhẹ" : book.condition === "Hard" ? "Hư hại nặng" : book.condition === "Lost" ? "Mất" : ""}</td>
                        <td>{book.condition_detail || 'N/A'}</td>
                        <td className="d-flex justify-content-between">
                          <button className="btn btn-primary" onClick={() => handleShowEditModal(book._id)}>Sửa</button>
                          <button className="btn btn-danger" onClick={() => handleShowDeleteModal(book._id)}>Xóa</button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6">Không có bản sao nào</td>
                    </tr>
                  )}
                </tbody>
              </table>
              <div className="pagination float-end mb-3">
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    className={`btn ${currentPage === index + 1 ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={handleCloseEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>Sửa bản sao</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formCondition">
              <Form.Label>Tình trạng</Form.Label>
              <Form.Select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
              >
                <option value="Good">Tốt</option>
                <option value="Light">Hơi bị hư</option>
                <option value="Medium">Hư hại nhẹ</option>
                <option value="Hard">Hư hại nặng</option>
                <option value="Lost">Mất</option>
              </Form.Select>
            </Form.Group>
            <Form.Group controlId="formConditionDetail">
              <Form.Label>Chi tiết tình trạng</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập chi tiết tình trạng"
                value={conditionDetail}
                onChange={(e) => setConditionDetail(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEditModal}>
            Đóng
          </Button>
          <Button variant="primary" onClick={handleEditSubmit}>
            Lưu thay đổi
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Add Modal */}
      <Modal show={showAddModal} onHide={handleCloseAddModal}>
        <Modal.Header closeButton>
          <Modal.Title>Thêm bản sao</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formNumberOfCopies">
              <Form.Label>Số lượng bản sao</Form.Label>
              <Form.Control
                type="number"
                placeholder="Nhập số lượng bản sao"
                value={numberOfCopies}
                onChange={(e) => setNumberOfCopies(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseAddModal}>
            Đóng
          </Button>
          <Button variant="primary" onClick={handleAddSubmit}>
            Thêm bản sao
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận xóa</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Bạn có chắc chắn muốn xóa bản sao sách này không?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteModal}>
            Hủy
          </Button>
          <Button variant="danger" onClick={handleDeleteCopy}>
            Xóa
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default BookDetail;
