import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom"; // For getting the book set ID from URL

const UpdateBookSet = () => {
  const { id } = useParams(); // Assuming you're passing the book set ID via URL params
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
      [name]: value ?? "", // Ensure empty string if undefined
    });
  };

  // Fetch catalogs for the select dropdown
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

  // Fetch the existing book set data for editing
  useEffect(() => {
    const fetchBookSet = async () => {
      try {
        const response = await axios.get(
          `http://localhost:9999/api/book-sets/${id}`
        );
        if (response.data) {
          setFormData({
            catalog_id: response.data.bookSet.catalog_id || "",
            isbn: response.data.bookSet.isbn || "",
            code: response.data.bookSet.code || "",
            shelfLocationCode: response.data.bookSet.shelfLocationCode || "",
            title: response.data.bookSet.title || "",
            author: response.data.bookSet.author || "",
            publishedYear: response.data.bookSet.publishedYear ? new Date(response.data.bookSet.publishedYear).toISOString().split('T')[0] : "",
            publisher: response.data.bookSet.publisher || "",
            physicalDescription: response.data.bookSet.physicalDescription || "",
            totalCopies: response.data.bookSet.totalCopies || "",
            availableCopies: response.data.bookSet.availableCopies || "",
          });
        }
      } catch (error) {
        console.error("Error fetching book set data:", error);
      }
    };

    if (id) {
      fetchBookSet(); // Fetch data only if there's a bookSetId (for edit mode)
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(
        `http://localhost:9999/api/book-sets/update/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Book set updated successfully:", response.data);
    } catch (error) {
      console.error("Error updating book set:", error);
    }
  };

  return (
    <div className="container">
      <h1 className="my-4">Update Book Set</h1>
      <form onSubmit={handleSubmit}>

        {/* Catalog ID */}
        <div className="mb-3">
          <label htmlFor="catalog_id" className="form-label">Catalog ID:</label>
          <select
            className="form-select"
            name="catalog_id"
            value={formData.catalog_id || ""}  // Bind the selected catalog_id
            onChange={handleInputChange}
          >
            {catalogData.map((catalog) => (
              <option key={catalog._id} value={catalog._id}>
                {catalog.name}
              </option>
            ))}
          </select>
        </div>

        {/* ISBN */}
        <div className="mb-3">
          <label htmlFor="isbn" className="form-label">ISBN:</label>
          <input
            type="text"
            className="form-control"
            id="isbn"
            name="isbn"
            value={formData.isbn || ""} // Ensure value is always a string
            onChange={handleInputChange}
          />
        </div>

        {/* Code */}
        <div className="mb-3">
          <label htmlFor="code" className="form-label">Code:</label>
          <input
            type="text"
            className="form-control"
            id="code"
            name="code"
            value={formData.code || ""} // Ensure value is always a string
            onChange={handleInputChange}
          />
        </div>

        {/* Title */}
        <div className="mb-3">
          <label htmlFor="title" className="form-label">Title:</label>
          <input
            type="text"
            className="form-control"
            id="title"
            name="title"
            value={formData.title || ""} // Ensure value is always a string
            onChange={handleInputChange}
          />
        </div>

        {/* Author */}
        <div className="mb-3">
          <label htmlFor="author" className="form-label">Author:</label>
          <input
            type="text"
            className="form-control"
            id="author"
            name="author"
            value={formData.author || ""} // Ensure value is always a string
            onChange={handleInputChange}
          />
        </div>

        {/* Published Year */}
        <div className="mb-3">
          <label htmlFor="publishedYear" className="form-label">Published Year:</label>
          <input
            type="date"
            className="form-control"
            id="publishedYear"
            name="publishedYear"
            value={formData.publishedYear || ""} // Ensure value is always a string
            onChange={handleInputChange}
          />
        </div>

        {/* Publisher */}
        <div className="mb-3">
          <label htmlFor="publisher" className="form-label">Publisher:</label>
          <input
            type="text"
            className="form-control"
            id="publisher"
            name="publisher"
            value={formData.publisher || ""} // Ensure value is always a string
            onChange={handleInputChange}
          />
        </div>

        {/* Physical Description */}
        <div className="mb-3">
          <label htmlFor="physicalDescription" className="form-label">Physical Description:</label>
          <input
            type="text"
            className="form-control"
            id="physicalDescription"
            name="physicalDescription"
            value={formData.physicalDescription || ""} // Ensure value is always a string
            onChange={handleInputChange}
          />
        </div>

        {/* Shelf Location Code */}
        <div className="mb-3">
          <label htmlFor="shelfLocationCode" className="form-label">Shelf Location Code:</label>
          <input
            type="text"
            className="form-control"
            id="shelfLocationCode"
            name="shelfLocationCode"
            value={formData.shelfLocationCode || ""} // Ensure value is always a string
            onChange={handleInputChange}
          />
        </div>

        {/* Total Copies */}
        <div className="mb-3">
          <label htmlFor="totalCopies" className="form-label">Total Copies:</label>
          <input
            type="number"
            className="form-control"
            id="totalCopies"
            name="totalCopies"
            value={formData.totalCopies || ""} // Ensure value is always a string
            onChange={handleInputChange}
          />
        </div>

        {/* Available Copies */}
        <div className="mb-3">
          <label htmlFor="availableCopies" className="form-label">Available Copies:</label>
          <input
            type="number"
            className="form-control"
            id="availableCopies"
            name="availableCopies"
            value={formData.availableCopies || ""} // Ensure value is always a string
            onChange={handleInputChange}
          />
        </div>

        <button type="submit" className="btn btn-primary">Update Book</button>
      </form>
    </div>
  );
};

export default UpdateBookSet;
