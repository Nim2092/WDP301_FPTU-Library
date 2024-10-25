import React, { useState, useEffect } from "react";
import axios from "axios";
import SearchBookset from "../../components/SearchBookset";
import { Link } from "react-router-dom";

function ListBookSet() {
  const [bookSetData, setBookSetData] = useState([]);
  const [filteredBookSetData, setFilteredBookSetData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:9999/api/book-sets/list")
      .then((response) => {
        console.log(response.data.data);
        setBookSetData(response.data.data);
        setFilteredBookSetData(response.data.data); // Set the initial filtered data to all data
      })
      .catch((error) => {
        console.error("Error fetching book sets:", error);
      });
  }, []);

  // Function to handle search logic
  const handleSearch = (term) => {
    setSearchTerm(term);
    const filteredData = bookSetData.filter((bookSet) =>
      bookSet.title.toLowerCase().includes(term.toLowerCase()) ||
      bookSet.shelfLocationCode.toLowerCase().includes(term.toLowerCase()) ||
      bookSet.isbn.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredBookSetData(filteredData);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this book set?");
    if (!confirmed) return;

    try {
      const response = await axios.delete(`http://localhost:9999/api/book-sets/delete/${id}`);
      console.log(response.data);
      
      // Remove the deleted book set from the state to update the UI
      const updatedData = filteredBookSetData.filter((bookSet) => bookSet._id !== id);
      setBookSetData(updatedData); // Update both states to reflect the change
      setFilteredBookSetData(updatedData);
      
      alert("Book set deleted successfully");
    } catch (error) {
      console.error("Error deleting book set:", error);
      alert("Failed to delete book set");
    }
  };

  return (
    <div className="container mt-4">
      {/* Search component */}
      <SearchBookset searchTerm={searchTerm} onSearch={handleSearch} />
      <Link to="/create-book" className="btn btn-primary mb-3">
        Create Book Set
      </Link>
      <h1>List of Book Sets</h1>

      {/* Displaying the book sets in a table */}
      <div className="table-responsive">
        {filteredBookSetData.length > 0 ? (
          <table className="table table-bordered">
            <thead>
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
                  <td>{new Date(bookSet.publishedYear).toLocaleDateString()}</td>
                  <td className="d-flex justify-content-between">
                    <Link to={`/update-bookset/${bookSet._id}`} className="btn btn-primary">Edit</Link>
                    <button className="btn btn-danger" onClick={() => handleDelete(bookSet._id)}>Delete</button>
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
