import React, { useState, useEffect } from "react";
import axios from "axios";

const CreateBook = () => {
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
    
    const formDataToSend = new FormData();
    for (let key in formData) {
      formDataToSend.append(key, formData[key] || ""); // Ensure no undefined values
    }

    try {
      const response = await axios.post(
        "http://localhost:9999/api/book-sets/create",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          }
        }
      );
      console.log("Book created successfully:", response.data);
    } catch (error) {
      console.error("Error creating book:", error);
    }
  };

  return (
    <div className="container">
      <h1>Create Book Set</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Catalog ID:</label>
          <select
            name="catalog_id"
            value={formData.catalog_id}
            onChange={handleInputChange}
          >
            <option value="">Select Catalog</option> {/* Provide a default option */}
            {catalogData.map((catalog) => (
              <option key={catalog._id} value={catalog._id}>
                {catalog.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>ISBN:</label>
          <input
            type="text"
            name="isbn"
            value={formData.isbn}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Code:</label>
          <input
            type="text"
            name="code"
            value={formData.code}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Title:</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Author:</label>
          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Published Year:</label>
          <input
            type="date"
            name="publishedYear"
            value={formData.publishedYear}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Publisher:</label>
          <input
            type="text"
            name="publisher"
            value={formData.publisher}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Physical Description:</label>
          <input
            type="text"
            name="physicalDescription"
            value={formData.physicalDescription}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Shelf Location Code:</label>
          <input
            type="text"
            name="shelfLocationCode"
            value={formData.shelfLocationCode}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Total Copies:</label>
          <input
            type="number"
            name="totalCopies"
            value={formData.totalCopies}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Available Copies:</label>
          <input
            type="number"
            name="availableCopies"
            value={formData.availableCopies}
            onChange={handleInputChange}
          />
        </div>

        <button type="submit">Create Book</button>
      </form>
    </div>
  );
};

export default CreateBook;
