import React, { useState } from "react";
import axios from "axios"; // Use axios for API calls

const AdvancedBookForm = ({ setSearchResults }) => {
  const [catalog, setCatalog] = useState("");
  const [bookName, setBookName] = useState("");
  const [author, setAuthor] = useState("");
  const [publisher, setPublisher] = useState("");
  const [publicationYear, setPublicationYear] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.get("https://fptu-library.xyz/api/book-sets/list", {
        params: {
          title: bookName,
          author,
          publisher,
          pubYear: publicationYear,
        },
      });

      // Update search results with the response data
      setSearchResults(response.data.data);
    } catch (error) {
      console.error("Error fetching book sets", error);
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <div className="d-flex flex-column gap-2">
          {/* <label htmlFor="catalog">Select Catalog</label>
          <select
            id="catalog"
            name="catalog"
            value={catalog}
            onChange={(e) => setCatalog(e.target.value)}
            className="form-control"
          >
            <option value="catalog1">Catalog 1</option>
            <option value="catalog2">Catalog 2</option>
          </select> */}

          <label htmlFor="book-name">Book Name</label>
          <input
            type="text"
            id="book-name"
            name="book-name"
            value={bookName}
            onChange={(e) => setBookName(e.target.value)}
            className="form-control"
          />

          <label htmlFor="author">Author</label>
          <input
            type="text"
            id="author"
            name="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="form-control"
          />

          <div className="row g-3">
            <div className="col-md-6">
              <label htmlFor="publisher">Publisher</label>
              <input
                type="text"
                id="publisher"
                name="publisher"
                value={publisher}
                onChange={(e) => setPublisher(e.target.value)}
                className="form-control"
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="publication-year">Publication Year</label>
              <input
                type="date"
                id="publication-year"
                name="publication-year"
                value={publicationYear}
                onChange={(e) => setPublicationYear(e.target.value)}
                className="form-control"
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary mt-3">
            Search
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdvancedBookForm;
