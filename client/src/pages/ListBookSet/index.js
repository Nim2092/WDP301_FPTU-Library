import React, { useState, useEffect } from "react";
import axios from "axios";
import BookSearch from "../../components/SearchBookset";
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactPaginate from 'react-paginate';
function ListBookSet() {
  const [bookSetData, setBookSetData] = useState([]);
  const [filteredBookSetData, setFilteredBookSetData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Number of book sets displayed per page
  const [catalogData, setCatalogData] = useState([]);
  const [selectedCatalog, setSelectedCatalog] = useState('all');

  useEffect(() => {
    axios.get("https://fptu-library.xyz.xyz/api/catalogs/list")
      .then((response) => {
        setCatalogData(response.data);
      })
      .catch((error) => console.error("Error fetching catalog data:", error));
  }, []);

  // Fetch and sort book sets
  useEffect(() => {
    axios.get("https://fptu-library.xyz/api/book-sets/list")
      .then((response) => {
        const sortedData = response.data.data.sort((a, b) =>
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        setBookSetData(sortedData);
        setFilteredBookSetData(sortedData); // Initialize filtered data
      })
      .catch((error) => {
        console.error("Error fetching book set data:", error);
      });
  }, []);

  // Handle catalog change
  const handleCatalogChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedCatalog(selectedValue);

    if (selectedValue === 'all') {
      setFilteredBookSetData(bookSetData);
    } else {
      const filtered = bookSetData.filter(book => book.catalog_id._id === selectedValue);
      setFilteredBookSetData(filtered);
    }
  };

  // Handle search
  const handleSearch = (results) => {
    setFilteredBookSetData(results);
  };

  // Handle delete
  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this book set?");
    if (!confirmed) return;

    try {
      await axios.delete(`https://fptu-library.xyz/api/book-sets/delete/${id}`);
      const updatedData = filteredBookSetData.filter((bookSet) => bookSet._id !== id);
      setFilteredBookSetData(updatedData);
      toast.success("Successfully deleted the book set");
    } catch (error) {
      console.error("Error deleting book set:", error);
      toast.error("Unable to delete book set");
    }
  };

  // Update the paginate function to work with ReactPaginate
  const handlePageClick = (data) => {
    setCurrentPage(data.selected + 1);
  };

  return (
    <div className="mt-4 container">
       
      <div className="row d-flex justify-content-between align-items-center mb-3">
        <div className="col-md-4" title="Tìm kiếm">
          <BookSearch  onSearch={handleSearch} />
        </div>
        <div className="col-md-2">
        <select
            className="form-select"
            value={selectedCatalog}
            onChange={handleCatalogChange}
          >
            <option value="all">Tất cả</option>
            {catalogData.map(catalog => (
              <option key={catalog._id} value={catalog._id}>
                {catalog.name}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-2">
          <Link to="/create-book" title="Tạo mới" className="btn btn-primary w-100">
            <i className="fa fa-plus" aria-hidden="true"></i>
            <span className="tooltip-text"> Tạo mới</span>
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
                  <th>Tên sách</th>
                  <th>Tác giả</th>
                  <th>ISBN</th>
                  <th>Mã sách</th>
                  <th>Vị trí</th>
                  <th>Nhà xuất bản</th>
                  <th>Năm xuất bản</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookSetData.map((bookSet) => (
                  <tr key={bookSet._id} className="align-middle">
                    <td>
                      {bookSet.image ? (
                        <img
                          src={`https://fptu-library.xyz/api/book-sets/image/${bookSet.image.split("/").pop()}`}
                          alt={bookSet.title}
                          style={{ width: "100px", height: "auto" }}
                        />
                      ) : (
                        <img src={"https://www.shutterstock.com/image-vector/default-ui-image-placeholder-wireframes-260nw-1037719192.jpg"} alt="Default" style={{ width: "100px", height: "auto" }} />
                      )}
                    </td>
                    <td>{bookSet.title}</td>
                    <td>{bookSet.author}</td>
                    <td>{bookSet.isbn}</td>
                    <td>{bookSet.code}</td>
                    <td>{bookSet.shelfLocationCode}</td>
                    <td>{bookSet.publisher}</td>
                    <td>{new Date(bookSet.publishedYear).getFullYear()}</td>
                    <td className="d-flex ">
                      <Link to={`/update-bookset/${bookSet._id}`} title="Sửa" className="btn btn-primary btn-sm" style={{marginRight: '5px'}}> 
                        <i className="fa fa-pencil" aria-hidden="true"></i>
                      </Link>
                      <button className="btn btn-danger btn-sm" title="Xóa" onClick={() => handleDelete(bookSet._id)} style={{marginRight: '5px'}}>
                        <i className="fa fa-trash" aria-hidden="true"></i>
                      </button>
                      <Link to={`/book-detail/${bookSet._id}`} title="Xem chi tiết" className="btn btn-info btn-sm">
                        <i className="fa fa-eye" aria-hidden="true"></i>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* ReactPaginate for Pagination */}
            <div className="d-flex justify-content-end">
              <ReactPaginate
                previousLabel={'<'}
                nextLabel={'>'}
                breakLabel={'...'}
                pageCount={Math.ceil(filteredBookSetData.length / itemsPerPage)}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageClick}
                containerClassName={'pagination justify-content-center'}
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
            </div>
          </>
        ) : (
          <p>Không tìm thấy sách.</p>
        )}
      </div>
    </div>
  );
}

export default ListBookSet;
