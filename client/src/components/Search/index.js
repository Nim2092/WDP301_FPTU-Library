import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Search.scss";
import Button from "../Button/Button";
import axios from "axios";

function BookSearch({ setSearchResults }) {
  const [bookName, setBookName] = useState("");
  const handleSubmit = async () => {
    try {

      const response = await axios.get("http://localhost:9999/api/book-sets/list", {
        params: {
          title: bookName,
        },
      });
      // navigate(`/search-results?title=${bookName}`);

      setSearchResults(response.data.data);
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
                placeholder="Tìm kiếm sách..."
                value={bookName}
                onChange={(e) => setBookName(e.target.value)}
              />
            </div>
          </div>
          <div className="search__advanced ">
            <a href="/advanced-search" className="btn btn-link text-end">
              Tìm kiếm nâng cao
            </a>
          </div>
          <div className="row search__button">
            <Button text="Tìm kiếm" clName="btn btn-primary" onClick={handleSubmit} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookSearch;
