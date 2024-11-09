import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../contexts/UserContext";
import { toast, ToastContainer } from "react-toastify";
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
        setCatalogData(response.data.data);
      } catch (error) {
        console.error("Lỗi lấy dữ liệu catalog:", error);
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

      toast.success("Tạo bộ sách thành công");
      setTimeout(() => {
        navigate("/list-book-set");
      }, 2000);
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  return (
    <div className="container mt-5">
      <ToastContainer />
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-3">
            {/* Image Upload */}
            <div className="mb-3">
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
                <label className="form-label">Chuyên ngành:</label>
                <select
                  className="form-select"
                  name="catalog_id"
                  value={formData.catalog_id}
                  onChange={(e) => setFormData({ ...formData, catalog_id: e.target.value })}
                >
                  <option value="">Chọn chuyên ngành</option>
                  {catalogData.map((catalog) => (
                    <option key={catalog._id} value={catalog._id}>
                      {catalog.name}
                    </option>
                  ))}
                </select>
              </div>
              {[
                { label: "ISBN", id: "isbn", type: "text" },
                { label: "Giá", id: "price", type: "number" },
                { label: "Mã sách", id: "code", type: "text" },
                { label: "Tên sách", id: "title", type: "text" },
                { label: "Tác giả", id: "author", type: "text" },
                { label: "Nhà xuất bản", id: "publisher", type: "text" },
                { label: "Tổng số bản", id: "totalCopies", type: "number" },
                { label: "Vị trí kệ", id: "shelfLocationCode", type: "text" },
              ].map(({ label, id, type }) => (
                <div className="mb-3 col-md-6" key={id}>
                  <label htmlFor={id} className="form-label">{label}:</label>
                  <input type={type} className="form-control" id={id} value={formData[id]} 
                  required
                  onChange={(e) => setFormData({ ...formData, [id]: e.target.value })} />
                </div>
              ))}
              <div className="mb3 col-md-6">
                <label htmlFor="publishedYear" className="form-label">Năm xuất bản:</label>
                <input type="date" className="form-control" id="publishedYear" value={formData.publishedYear} 
                required
                max={new Date().toISOString().split('T')[0]}
                onChange={(e) => setFormData({ ...formData, publishedYear: e.target.value })} />
              </div>
              <div className="mb-3 col-md-12">
                <label htmlFor="description" className="form-label">Mô tả:</label>
                <textarea className="form-control" id="physicalDescription" value={formData.physicalDescription} 
                required
                onChange={(e) => setFormData({ ...formData, physicalDescription: e.target.value })} />
              </div>
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-center align-items-center">
          <button type="submit" className="btn btn-primary mb-3">Tạo bộ sách</button>
        </div>
      </form>
    </div>
  );
}

export default CreateBookSet;
