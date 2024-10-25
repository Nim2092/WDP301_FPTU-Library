import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const UpdateBookSet = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [catalogData, setCatalogData] = useState([]);
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [formData, setFormData] = useState({
    catalog_id: "", // Holds the ID of the catalog
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
  const [currentCatalogName, setCurrentCatalogName] = useState(""); // Holds the catalog name for display

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value ?? "",
    });
  };

  // Fetch catalogs for the dropdown list
  useEffect(() => {
    const fetchCatalogs = async () => {
      try {
        const response = await axios.get("http://localhost:9999/api/catalogs/list");
        setCatalogData(response.data);
      } catch (error) {
        console.error("Error fetching catalog data:", error);
      }
    };
    fetchCatalogs();
  }, []);

  // Fetch existing book set data for editing
  useEffect(() => {
    const fetchBookSet = async () => {
      try {
        const response = await axios.get(`http://localhost:9999/api/book-sets/${id}`);
        if (response.data) {
          const bookSet = response.data.bookSet;
          setFormData({
            catalog_id: bookSet.catalog_id._id || "",
            isbn: bookSet.isbn || "",
            code: bookSet.code || "",
            shelfLocationCode: bookSet.shelfLocationCode || "",
            title: bookSet.title || "",
            author: bookSet.author || "",
            publishedYear: bookSet.publishedYear
              ? new Date(bookSet.publishedYear).toISOString().split("T")[0]
              : "",
            publisher: bookSet.publisher || "",
            physicalDescription: bookSet.physicalDescription || "",
            totalCopies: bookSet.totalCopies || "",
            availableCopies: bookSet.availableCopies || "",
          });
          setImage(`http://localhost:9999${bookSet.image}`);
          setCurrentCatalogName(bookSet.catalog_id.name); // Set current catalog name
        }
      } catch (error) {
        console.error("Error fetching book set data:", error);
      }
    };
    if (id) fetchBookSet();
  }, [id]);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedImage = e.target.files[0];
      setImage(URL.createObjectURL(selectedImage));
      setImageFile(selectedImage);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedFormData = new FormData();
    Object.keys(formData).forEach((key) => {
      updatedFormData.append(key, formData[key]);
    });
    if (imageFile) {
      updatedFormData.append("image", imageFile);
    }

    try {
      const response = await axios.put(
        `http://localhost:9999/api/book-sets/update/${id}`,
        updatedFormData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.status === 200) {
        alert("Book set updated successfully");
        navigate("/list-book-set");
      } else {
        alert("Failed to update book set");
      }
    } catch (error) {
      console.error("Error updating book set:", error);
      alert("Error updating book set");
    }
  };

  return (
    <div className="container">
      <h1 className="my-4">Update Book Set</h1>
      <form onSubmit={handleSubmit}>
        {/* Catalog ID */}
        <div className="mb-3">
          <label htmlFor="catalog_id" className="form-label">Catalog:</label>
          <select
            className="form-select"
            name="catalog_id"
            value={formData.catalog_id}
            onChange={(e) => handleInputChange(e)}
          >
            {/* Display current catalog name as selected option */}
            <option value={formData.catalog_id}>
              {currentCatalogName || "Select Catalog"}
            </option>
            {catalogData
              .filter((catalog) => catalog._id !== formData.catalog_id) // Exclude current catalog from options
              .map((catalog) => (
                <option key={catalog._id} value={catalog._id}>
                  {catalog.name}
                </option>
              ))}
          </select>
        </div>

        {/* Image Upload */}
        <div className="mb-3">
          <label className="form-label">Book Set Image:</label>
          {image && (
            <div className="mt-3">
              <img src={image} alt="Preview" style={{ maxWidth: "200px", maxHeight: "200px" }} />
            </div>
          )}
          <input
            type="file"
            className="form-control"
            onChange={handleImageChange}
          />
        </div>

        {/* ISBN */}
        <div className="mb-3">
          <label htmlFor="isbn" className="form-label">ISBN:</label>
          <input
            type="text"
            className="form-control"
            id="isbn"
            name="isbn"
            value={formData.isbn}
            onChange={handleInputChange}
            required
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
            value={formData.code}
            onChange={handleInputChange}
            required
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
            value={formData.title}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Author */}
        <div className="mb-3">
          <label htmlFor="author" className="form-label">
            Author:
          </label>
          <input
            type="text"
            className="form-control"
            id="author"
            name="author"
            value={formData.author || ""}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Published Year */}
        <div className="mb-3">
          <label htmlFor="publishedYear" className="form-label">
            Published Year:
          </label>
          <input
            type="date"
            className="form-control"
            id="publishedYear"
            name="publishedYear"
            value={formData.publishedYear || ""}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Publisher */}
        <div className="mb-3">
          <label htmlFor="publisher" className="form-label">
            Publisher:
          </label>
          <input
            type="text"
            className="form-control"
            id="publisher"
            name="publisher"
            value={formData.publisher || ""}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Physical Description */}
        <div className="mb-3">
          <label htmlFor="physicalDescription" className="form-label">
            Physical Description:
          </label>
          <input
            type="text"
            className="form-control"
            id="physicalDescription"
            name="physicalDescription"
            value={formData.physicalDescription || ""}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Shelf Location Code */}
        <div className="mb-3">
          <label htmlFor="shelfLocationCode" className="form-label">
            Shelf Location Code:
          </label>
          <input
            type="text"
            className="form-control"
            id="shelfLocationCode"
            name="shelfLocationCode"
            value={formData.shelfLocationCode || ""}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Total Copies */}
        <div className="mb-3">
          <label htmlFor="totalCopies" className="form-label">
            Total Copies:
          </label>
          <input
            type="number"
            className="form-control"
            id="totalCopies"
            name="totalCopies"
            value={formData.totalCopies || ""}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Available Copies */}
        <div className="mb-3">
          <label htmlFor="availableCopies" className="form-label">
            Available Copies:
          </label>
          <input
            type="number"
            className="form-control"
            id="availableCopies"
            name="availableCopies"
            value={formData.availableCopies || ""}
            onChange={handleInputChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Update Book Set
        </button>
      </form>
    </div>
  );
};

export default UpdateBookSet;
