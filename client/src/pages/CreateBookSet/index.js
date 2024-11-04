import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../contexts/UserContext";

function CreateBookSet() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
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
    price: "",
    image: null, // Sử dụng để lưu trữ file ảnh
    createdBy: user.id,
  });

  const [imagePreview, setImagePreview] = useState(null); // Để hiển thị ảnh preview

  // Hàm xử lý khi người dùng chọn ảnh
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, image: e.target.files[0] }); // Lưu file ảnh vào state
      setImagePreview(URL.createObjectURL(e.target.files[0])); // Hiển thị ảnh preview
    }
  };

  // Lấy dữ liệu catalog để sử dụng trong form
  useEffect(() => {
    const fetchCatalogs = async () => {
      try {
        const response = await axios.get("https://fptu-library.xyz/api/catalogs/list");
        setCatalogData(response.data);
      } catch (error) {
        console.error("Error fetching catalog data:", error);
      }
    };
    fetchCatalogs();
  }, []);

  // Hàm xử lý khi submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Sử dụng FormData để gửi ảnh và các dữ liệu khác
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    try {
      const response = await axios.post("https://fptu-library.xyz/api/book-sets/create", data, {
        headers: {
          "Content-Type": "multipart/form-data", // Sử dụng multipart/form-data khi có file
        },
      });

      if (response.status === 201) {
        alert("Book Set created successfully");
        navigate("/list-book-set");
      } else {
        alert("Failed to create book set");
      }
    } catch (error) {
      console.error("Error creating book set:", error);
      alert("Error creating book set");
    }
  };

  return (
    <div className="container mt-5">
      <h1>Create Book Set</h1>
      <form onSubmit={handleSubmit}>
        {/* Catalog ID */}
        <div className="mb-3">
          <label className="form-label">Catalog ID:</label>
          <select
            className="form-select"
            name="catalog_id"
            value={formData.catalog_id}
            onChange={(e) => setFormData({ ...formData, catalog_id: e.target.value })}
          >
            <option value="">Select Catalog</option>
            {catalogData.map((catalog) => (
              <option key={catalog._id} value={catalog._id}>
                {catalog.name}
              </option>
            ))}
          </select>
        </div>

        {/* Image Upload */}
        <div className="mb-3">
          <label className="form-label">Book Set Image:</label>
          {imagePreview && (
            <div className="mt-3">
              <img src={imagePreview} alt="Preview" style={{ maxWidth: "200px", maxHeight: "200px" }} />
            </div>
          )}
          <input
            type="file"
            className="form-control"
            onChange={handleImageChange} // Xử lý khi người dùng chọn ảnh
          />
        </div>

        {/* ISBN */}
        <div className="mb-3">
          <label className="form-label">ISBN:</label>
          <input
            type="text"
            className="form-control"
            name="isbn"
            value={formData.isbn}
            onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
            required
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
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            required
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
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
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
            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
            required
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
            onChange={(e) => setFormData({ ...formData, publishedYear: e.target.value })}
            required
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
            onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
            required
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
            onChange={(e) => setFormData({ ...formData, physicalDescription: e.target.value })}
            required
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
            onChange={(e) => setFormData({ ...formData, shelfLocationCode: e.target.value })}
            required
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
            onChange={(e) => setFormData({ ...formData, totalCopies: e.target.value })}
            required
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
            onChange={(e) => setFormData({ ...formData, availableCopies: e.target.value })}
            required
          />
        </div>

        {/* Price */}
        <div className="mb-3">
          <label className="form-label">Price:</label>
          <input
            type="number" 
            className="form-control"
            name="price"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            required
          />
        </div>


        <button type="submit" className="btn btn-primary">Create Book Set</button>
      </form>
    </div>
  );
}

export default CreateBookSet;
