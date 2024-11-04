import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "axios";

const BookSearch = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.get("https://fptu-library.xyz/api/book-sets/list", {
        params: { title: searchTerm },
      });
      onSearch(response.data.data); // Pass results to parent component
    } catch (error) {
      console.error("Error fetching book sets:", error);
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <div className="form-group d-flex">
          <input
            type="text"
            className="form-control"
            placeholder="Nhập tên sách"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{marginRight: '10px'}}
          />
          <button type="submit" className="btn btn-primary"><i className="fa fa-search" aria-hidden="true"></i></button>
        </div>
      </form>
    </div>
  );
};

export default BookSearch;
