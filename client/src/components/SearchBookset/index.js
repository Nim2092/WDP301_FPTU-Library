import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "axios";

const BookSearch = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.get("http://localhost:9999/api/book-sets/list", {
        params: { title: searchTerm },
      });
      onSearch(response.data.data); // Pass results to parent component
    } catch (error) {
      console.error("Error fetching book sets:", error);
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit} className="row">
        <div className="form-group mb-3 col-md-3">
          <input
            type="text"
            className="form-control"
            placeholder="Enter title of book"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-2">
          <button type="submit" className="btn btn-primary">Search</button>
        </div>
      </form>
    </div>
  );
};

export default BookSearch;
