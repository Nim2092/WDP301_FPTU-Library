import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const CreateBook = () => {
  const navigate = useNavigate();
  const [catalogData, setCatalogData] = useState([]);
  const [formData, setFormData] = useState({
    catalog_id: "",
    isbn: "",
    code: "",
    shelfLocationCode: "",
    title: "",
    author: "",
    publishedYear: "",
    publisher: "",
    physicalDescription: "",
    totalCopies: "",
    availableCopies: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    const fetchCatalogs = async () => {
      try {
        const response = await fetch("http://localhost:9999/api/catalogs/list");
        if (!response.ok) {
          throw new Error("Failed to fetch catalog data");
        }
        const data = await response.json();
        setCatalogData(data);
      } catch (error) {
        console.error("Error fetching catalog data:", error);
      }
    };

    fetchCatalogs();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:9999/api/book-sets/create",
        formData,  
        {
          headers: {
            "Content-Type": "application/json",  
          }
        }
      );
      console.log("Book created successfully:", response.data);
      navigate("/list-book-set");
    } catch (error) {
      console.error("Error creating book:", error);
    }
  };


  return (
    <div className="container mt-5">
      <h1 className="mb-4">Create Book Set</h1>
      <form onSubmit={handleSubmit}>
        
        {/* Catalog ID */}
        <div className="mb-3">
          <label className="form-label">Catalog ID:</label>
          <select
            className="form-select"
            name="catalog_id"
            value={formData.catalog_id}
            onChange={handleInputChange}
          >
            <option value="">Select Catalog</option>
            {catalogData.map((catalog) => (
              <option key={catalog._id} value={catalog._id}>
                {catalog.name}
              </option>
            ))}
          </select>
        </div>

        {/* ISBN */}
        <div className="mb-3">
          <label className="form-label">ISBN:</label>
          <input
            type="text"
            className="form-control"
            name="isbn"
            value={formData.isbn}
            onChange={handleInputChange}
          />
        </div>

        {/* Code */}
        <div className="mb-3">
          <label className="form-label">Code:</label>
          <input
            type="text"
            className="form-control"
            name="code"
            value={formData.code}
            onChange={handleInputChange}
          />
        </div>

        {/* Title */}
        <div className="mb-3">
          <label className="form-label">Title:</label>
          <input
            type="text"
            className="form-control"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
          />
        </div>

        {/* Author */}
        <div className="mb-3">
          <label className="form-label">Author:</label>
          <input
            type="text"
            className="form-control"
            name="author"
            value={formData.author}
            onChange={handleInputChange}
          />
        </div>

        {/* Published Year */}
        <div className="mb-3">
          <label className="form-label">Published Year:</label>
          <input
            type="date"
            className="form-control"
            name="publishedYear"
            value={formData.publishedYear}
            onChange={handleInputChange}
          />
        </div>

        {/* Publisher */}
        <div className="mb-3">
          <label className="form-label">Publisher:</label>
          <input
            type="text"
            className="form-control"
            name="publisher"
            value={formData.publisher}
            onChange={handleInputChange}
          />
        </div>

        {/* Physical Description */}
        <div className="mb-3">
          <label className="form-label">Physical Description:</label>
          <input
            type="text"
            className="form-control"
            name="physicalDescription"
            value={formData.physicalDescription}
            onChange={handleInputChange}
          />
        </div>

        {/* Shelf Location Code */}
        <div className="mb-3">
          <label className="form-label">Shelf Location Code:</label>
          <input
            type="text"
            className="form-control"
            name="shelfLocationCode"
            value={formData.shelfLocationCode}
            onChange={handleInputChange}
          />
        </div>

        {/* Total Copies */}
        <div className="mb-3">
          <label className="form-label">Total Copies:</label>
          <input
            type="number"
            className="form-control"
            name="totalCopies"
            value={formData.totalCopies}
            onChange={handleInputChange}
          />
        </div>

        {/* Available Copies */}
        <div className="mb-3">
          <label className="form-label">Available Copies:</label>
          <input
            type="number"
            className="form-control"
            name="availableCopies"
            value={formData.availableCopies}
            onChange={handleInputChange}
          />
        </div>

        <button type="submit" className="btn btn-primary" >Create Book</button>
      </form>
    </div>
  );
};

export default CreateBook;
