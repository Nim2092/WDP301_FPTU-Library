import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../contexts/UserContext";
import { toast } from "react-toastify";
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
        const response = await axios.get("http://localhost:9999/api/catalogs/list");
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
      const response = await axios.post("http://localhost:9999/api/book-sets/create", data, {
        headers: {
          "Content-Type": "multipart/form-data", // Sử dụng multipart/form-data khi có file
        },
      });

      if (response.status === 201) {
        toast.success("Book Set created successfully");
        navigate("/list-book-set");
      } else {
        toast.error("Failed to create book set");
      }
    } catch (error) {
      console.error("Error creating book set:", error);
      toast.error("Error creating book set");
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="my-4 text-center">Create Book Set</h1>

      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-3">
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
          </div>
          <div className="col-md-9">
            <div className="row">
              <div className="mb-3 col-md-6">
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
              {[
                { label: "ISBN", id: "isbn", type: "text" },
                { label: "Price", id: "price", type: "number" },
                { label: "Code", id: "code", type: "text" },
                { label: "Title", id: "title", type: "text" },
                { label: "Author", id: "author", type: "text" },
                { label: "Published Year", id: "publishedYear", type: "date" },
                { label: "Publisher", id: "publisher", type: "text" },
                { label: "Physical Description", id: "physicalDescription", type: "text" },
                { label: "Shelf Location Code", id: "shelfLocationCode", type: "text" },
                { label: "Total Copies", id: "totalCopies", type: "number" },
                { label: "Available Copies", id: "availableCopies", type: "number" },
              ].map(({ label, id, type }) => (
                <div className="mb-3 col-md-6" key={id}>
                  <label htmlFor={id} className="form-label">{label}:</label>
                  <input type={type} className="form-control" id={id} value={formData[id]} 
                  onChange={(e) => setFormData({ ...formData, [id]: e.target.value })} />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-center align-items-center">
          <button type="submit" className="btn btn-primary mb-3">Create Book Set</button>
        </div>
      </form>
    </div>
  );
}

export default CreateBookSet;
