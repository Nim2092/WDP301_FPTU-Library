import React, { useState, useEffect } from "react";
import axios from "axios";
import BookSearch from "../../components/SearchBookset";
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ListBookSet() {
  const [bookSetData, setBookSetData] = useState([]);
  const [filteredBookSetData, setFilteredBookSetData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Số lượng bộ sách hiển thị trên mỗi trang
  const [catalogData, setCatalogData] = useState([]);
  const [selectedCatalog, setSelectedCatalog] = useState('all');


  // Lấy dữ liệu bộ sách và sắp xếp theo thời gian tạo
  useEffect(() => {
    axios.get("http://localhost:9999/api/book-sets/list")
      .then((response) => {
        const sortedData = response.data.data.sort((a, b) =>
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        setBookSetData(sortedData);
        setFilteredBookSetData(sortedData); // Thiết lập dữ liệu lọc ban đầu
      })
      .catch((error) => console.error("Lỗi khi lấy dữ liệu bộ sách:", error));
  }, []);

  // Xử lý tìm kiếm
  const handleSearch = (results) => {
    setFilteredBookSetData(results);
  };

  // Xử lý xóa bộ sách
  const handleDelete = async (id) => {
    const confirmed = window.confirm("Bạn có chắc chắn muốn xóa bộ sách này?");
    if (!confirmed) return;

    try {
      await axios.delete(`http://localhost:9999/api/book-sets/delete/${id}`);
      const updatedData = filteredBookSetData.filter((bookSet) => bookSet._id !== id);
      setBookSetData(updatedData);
      setFilteredBookSetData(updatedData);
      toast.success("Đã xóa bộ sách thành công");
    } catch (error) {
      console.error("Lỗi khi xóa bộ sách:", error);
      toast.error("Không thể xóa bộ sách");
    }
  };

  // Lọc sách theo catalog
  const handleCatalogChange = (e) => {
    const catalogId = e.target.value;
    setSelectedCatalog(catalogId);

    if (catalogId === 'all') {
      setFilteredBookSetData(bookSetData);
    } else {
      const filtered = bookSetData.filter(book => book.catalogId === catalogId);
      setFilteredBookSetData(filtered);
    }
  };

  // Phân trang
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredBookSetData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredBookSetData.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="mt-4 container">
      <ToastContainer />

      <div className="row mb-3">
        <div className="col-md-10">
          <h1>Danh sách các bộ sách</h1>
        </div>
        <div className="col-md-2">
          <select
            className="form-select"
            value={selectedCatalog}
            onChange={handleCatalogChange}
          >
            <option value="all">Tất cả Catalog</option>
            {catalogData && catalogData.map(catalog => (
              <option key={catalog._id} value={catalog._id}>
                {catalog.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="row d-flex justify-content-between align-items-center mb-3">
        <div className="col-md-10">
          <BookSearch onSearch={handleSearch} />
        </div>
        <div className="col-md-2">
          <Link to="/create-book" className="btn btn-primary w-100">
            Tạo bộ sách mới
          </Link>
        </div>
      </div>

      <div className="table-responsive">
        {filteredBookSetData.length > 0 ? (
          <>
            <table className="table table-bordered">
              <thead className="thead-light">
                <tr>
                  <th>Ảnh</th>
                  <th>Tiêu đề</th>
                  <th>Tác giả</th>
                  <th>ISBN</th>
                  <th>Mã sách</th>
                  <th>Mã vị trí kệ</th>
                  <th>Nhà xuất bản</th>
                  <th>Năm xuất bản</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((bookSet) => (
                  <tr key={bookSet._id} className="align-middle">
                    <td>
                      <img
                        src={`http://localhost:9999/api/book-sets/image/${bookSet.image.split("/").pop()}`}
                        alt={bookSet.title}
                        style={{ width: "100px", height: "auto" }}
                      />
                    </td>
                    <td>{bookSet.title}</td>
                    <td>{bookSet.author}</td>
                    <td>{bookSet.isbn}</td>
                    <td>{bookSet.code}</td>
                    <td>{bookSet.shelfLocationCode}</td>
                    <td>{bookSet.publisher}</td>
                    <td>{new Date(bookSet.publishedYear).getFullYear()}</td>
                    <td className="d-flex justify-content-around">
                      <Link to={`/update-bookset/${bookSet._id}`} className="btn btn-primary btn-sm">
                        Chỉnh sửa
                      </Link>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(bookSet._id)}>
                        Xóa
                      </button>
                      <Link to={`/book-detail/${bookSet._id}`} className="btn btn-info btn-sm">
                        Chi tiết
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Phân trang */}
            <nav aria-label="Phân trang bộ sách">
              <ul className="pagination justify-content-center">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Trước
                  </button>
                </li>

                {[...Array(totalPages)].map((_, index) => (
                  <li
                    key={index + 1}
                    className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
                  >
                    <button
                      className="page-link"
                      onClick={() => paginate(index + 1)}
                    >
                      {index + 1}
                    </button>
                  </li>
                ))}

                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Tiếp
                  </button>
                </li>
              </ul>
            </nav>
          </>
        ) : (
          <p>Không tìm thấy bộ sách nào.</p>
        )}
      </div>
    </div>
  );
}

export default ListBookSet;
