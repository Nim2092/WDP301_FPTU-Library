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
  const [itemsPerPage] = useState(5); // Number of book sets displayed per page
  const [catalogData, setCatalogData] = useState([]);
  const [selectedCatalog, setSelectedCatalog] = useState('all');

  useEffect(() => {
    axios.get("https://fptu-library.xyz/api/catalogs/list")
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

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredBookSetData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredBookSetData.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="mt-4 container">
      <ToastContainer />

      <div className="row mb-3">
        <div className="col-md-9">
          <h1>Book Set List</h1>
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            value={selectedCatalog}
            onChange={handleCatalogChange}
          >
            <option value="all">All Catalogs</option>
            {catalogData.map(catalog => (
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
            Create New Book Set
          </Link>
        </div>
      </div>

      <div className="table-responsive">
        {filteredBookSetData.length > 0 ? (
          <>
            <table className="table table-bordered">
              <thead className="thead-light">
                <tr>
                  <th>Image</th>
                  <th>Title</th>
                  <th>Author</th>
                  <th>ISBN</th>
                  <th>Code</th>
                  <th>Shelf Location Code</th>
                  <th>Publisher</th>
                  <th>Published Year</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((bookSet) => (
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
                    <td className="d-flex justify-content-around">
                      <Link to={`/update-bookset/${bookSet._id}`} className="btn btn-primary btn-sm">
                        Edit
                      </Link>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(bookSet._id)}>
                        Delete
                      </button>
                      <Link to={`/book-detail/${bookSet._id}`} className="btn btn-info btn-sm">
                        Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <nav aria-label="Book Set Pagination">
              <ul className="pagination justify-content-center">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
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
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </>
        ) : (
          <p>No book sets found.</p>
        )}
      </div>
    </div>
  );
}

export default ListBookSet;
