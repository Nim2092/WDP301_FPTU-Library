import "./Bookdetail.scss";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
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

  useEffect(() => {
    const fetchBookDetail = async () => {
      try {
        const response = await axios.get(`https://fptu-library.xyz/api/book-sets/${id}`);
        setBookSet(response.data.bookSet);
        setBooks(response.data.books);
        const image = response.data.bookSet.image;
        if (image) {
          setImage(`https://fptu-library.xyz/api/book-sets/image/${image.split("/").pop()}`);
        }
      } catch (error) {
        console.error("Error fetching book details:", error);
      }
    };
    fetchBookDetail();
  }, [id]);

  useEffect(() => {
    setFilteredBooks(books);
  }, [books]);

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
      await axios.post(`https://fptu-library.xyz/api/book-sets/add-books`, {
        bookSet_id: id,
        numberOfCopies: parseInt(numberOfCopies),
        createdBy: user.id
      });
      toast.success("Thêm sách thành công");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      toast.error("Thêm sách lỗi");
    }
  };

  const handleEditCopy = async (id) => {
    try {
      const response = await axios.put(`https://fptu-library.xyz/api/books/update/${id}`, {
        condition: condition,
        condition_detail: conditionDetail,
        updatedBy: user.id
      });
      if (response.status === 200) {
        toast.success("Sửa sách thành công");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      toast.error("Sửa sách lỗi");
    }
  };

  const handleDeleteCopy = async (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this book copy?");
    if (!isConfirmed) return;

    try {
      await axios.delete(`https://fptu-library.xyz/api/books/delete/${id}`);
      toast.success("Xóa sách thành công");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      toast.error("Xóa sách lỗi");
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
            <div className="col-md-12">
              <h3 className="text-center">Danh sách các bản sao</h3>
            </div>
            <div className="row">
              <div className="search-copy mb-3 col-md-6" >
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
                    <th>Điều kiện</th>
                    <th>Chi tiết điều kiện</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {currentBooks.length > 0 ? (
                    currentBooks.map((book, index) => (
                      <tr key={book._id}>
                        <td>{indexOfFirstItem + index + 1}</td>
                        <td>{book.identifier_code}</td>
                        <td>{book.status}</td>
                        <td>{book.condition}</td>
                        <td>{book.condition_detail || 'N/A'}</td>
                        <td className="d-flex justify-content-between">
                          <button className="btn btn-primary" onClick={() => handleShowEditModal(book._id)}>Sửa</button>
                          <button className="btn btn-danger" onClick={() => handleDeleteCopy(book._id)}>Xóa</button>
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
              <Form.Label>Trạng thái</Form.Label>
              <Form.Select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
              >
                <option value="Good">Good</option>
                <option value="Light">Light</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
                <option value="Lost">Lost</option>
              </Form.Select>
            </Form.Group>
            <Form.Group controlId="formConditionDetail">
              <Form.Label>Chi tiết điều kiện</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter condition detail"
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
              <Form.Label>Number of Copies</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter number of copies"
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
    </div>
  );
}

export default BookDetail;
