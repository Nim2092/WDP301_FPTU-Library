import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Search.scss";
import Button from "../Button/Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function BookSearch({ setSearchResults }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [bookName, setBookName] = useState("");
  const [author, setAuthor] = useState("");
  const [publisher, setPublisher] = useState("");
  const [publicationYear, setPublicationYear] = useState("");

  const handleSubmit = async () => {
    try {
      const response = await axios.get("https://fptu-library.xyz/api/book-sets/list", {
        params: {
          title: bookName,
          author,
          publisher,
          pubYear: publicationYear,
        },
      });
      // Truyền kết quả tìm kiếm qua state trong navigate
      navigate(`/search-results?title=${searchTerm}`, { state: { results: response.data.data } });
    } catch (error) {
      console.error("Error fetching book sets", error);
    }
  };

  return (
    <div className="search">
      <div className="container search__container">
        <div className="justify-content-center">
          <div className="row">
            <div className="search__input input-group mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Search for books..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="row search__advanced">
            <a href="/advanced-search" className="btn btn-link text-end">
              Go to Advanced Search
            </a>
          </div>
          <div className="row search__button">
            <Button text="Search" clName="btn btn-primary" onClick={handleSubmit} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookSearch;
