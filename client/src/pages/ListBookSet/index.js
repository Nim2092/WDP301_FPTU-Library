import React, { useState, useEffect } from "react";
import axios from "axios";
import BookSearch from "../../components/SearchBookset";
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

function ListBookSet() {
  const [bookSetData, setBookSetData] = useState([]);
  const [filteredBookSetData, setFilteredBookSetData] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:9999/api/book-sets/list")
      .then((response) => {
        setBookSetData(response.data.data);
        setFilteredBookSetData(response.data.data); // Set initial filtered data
      })
      .catch((error) => console.error("Error fetching book sets:", error));
  }, []);

  const handleSearch = (results) => {
    setFilteredBookSetData(results);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this book set?");
    if (!confirmed) return;

    try {
      await axios.delete(`http://localhost:9999/api/book-sets/delete/${id}`);
      const updatedData = filteredBookSetData.filter((bookSet) => bookSet._id !== id);
      setBookSetData(updatedData);
      setFilteredBookSetData(updatedData);
      alert("Book set deleted successfully");
    } catch (error) {
      console.error("Error deleting book set:", error);
      alert("Failed to delete book set");
    }
  };

  return (
    <div className="container mt-4">
      {/* Search Component */}
      <BookSearch onSearch={handleSearch} />
      
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>List of Book Sets</h1>
        <Link to="/create-book" className="btn btn-primary">
          Create Book Set
        </Link>
      </div>

      <div className="table-responsive">
        {filteredBookSetData.length > 0 ? (
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
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookSetData.map((bookSet) => (
                <tr key={bookSet._id}>
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
                      Edit
                    </Link>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(bookSet._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No book sets found.</p>
        )}
      </div>
    </div>
  );
}

export default ListBookSet;
