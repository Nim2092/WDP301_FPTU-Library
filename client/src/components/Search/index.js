import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import "./Search.scss";
import Button from "../Button/Button";

function BookSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

const handleSearch = () => {
  if (searchTerm) {
    navigate(`/search-results?title=${searchTerm}`);
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
            <Button text="Search" clName="btn btn-primary" onClick={handleSearch} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookSearch;
