import React, { useState } from "react";

const AdvancedBookForm = () => {
  const [catalog, setCatalog] = useState("catalog1");

  const handleCatalogChange = (event) => {
    setCatalog(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Here you can handle form submission logic, such as API call
    alert("Form submitted!");
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <div className="d-flex flex-column gap-2">
          <label htmlFor="catalog">Select Catalog</label>
          <select
            id="catalog"
            name="catalog"
            value={catalog}
            onChange={handleCatalogChange}
            className="form-control"
          >
            <option value="catalog1">Catalog 1</option>
            <option value="catalog2">Catalog 2</option>
          </select>

          <label htmlFor="book-name">Book Name</label>
          <input
            type="text"
            id="book-name"
            name="book-name"
            className="form-control"
          />

          <label htmlFor="author">Author</label>
          <input
            type="text"
            id="author"
            name="author"
            className="form-control"
          />

          <div className="row g-3">
            <div className="col-md-6">
              <label htmlFor="publisher">Publisher</label>
              <input
                type="text"
                id="publisher"
                name="publisher"
                className="form-control"
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="publication-year">Publication Year</label>
              <input
                type="date"
                id="publication-year"
                name="publication-year"
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
