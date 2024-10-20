import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CreateNews() {
  const [data, setData] = useState({
    title: "",
    content: "",
    thumbnail: null, // Lưu file ảnh thay vì URL
  });

  const [imagePreview, setImagePreview] = useState(null); // Để hiển thị preview ảnh
  const navigate = useNavigate();

  // Xử lý khi người dùng chọn ảnh
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setData({ ...data, thumbnail: e.target.files[0] }); // Lưu file ảnh vào state
      setImagePreview(URL.createObjectURL(e.target.files[0])); // Hiển thị preview ảnh
    }
  };

  // Xử lý form submission để tạo mới bài viết
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("content", data.content);
    formData.append("thumbnail", data.thumbnail); // Gửi file ảnh đã chọn
    formData.append("createdBy", "60c72b2f9b1e8a5b5c8f1a2e"); // Static user ID
    formData.append("updatedBy", "60c72b2f9b1e8a5b5c8f1a2e"); // Static user ID

    try {
      const response = await axios.post("http://localhost:9999/api/news/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Khi gửi file ảnh, cần sử dụng multipart/form-data
        },
      });

      if (response.status === 201) {
        alert("News created successfully");
        navigate("/list-news-admin"); // Điều hướng về trang danh sách bài viết
      } else {
        alert("Failed to create news");
      }
    } catch (error) {
      console.error("Error creating news:", error);
      alert("Error creating news");
    }
  };

  return (
    <div className="container mt-4">
      <h1>Create News</h1>
      <form onSubmit={handleSubmit}>
      <div className="form-group mt-3">
          <label htmlFor="thumbnail">Thumbnail</label>
          {imagePreview && (
            <div className="mt-3">
              <img src={imagePreview} alt="Preview" style={{ maxWidth: "200px", maxHeight: "200px" }} />
            </div>
          )}
          <input
            type="file"
            className="form-control"
            id="thumbnail"
            onChange={handleImageChange} // Xử lý khi người dùng chọn ảnh
          />
          
        </div>

        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            className="form-control"
            id="title"
            value={data.title}
            onChange={(e) => setData({ ...data, title: e.target.value })}
            placeholder="Enter title"
            required
          />
        </div>

        <div className="form-group mt-3">
          <label htmlFor="content">Content</label>
          <textarea
            className="form-control"
            id="content"
            value={data.content}
            onChange={(e) => setData({ ...data, content: e.target.value })}
            placeholder="Enter content"
            required
          />
        </div>

        

        <button type="submit" className="btn btn-primary mt-3">
          Create News
        </button>
      </form>
    </div>
  );
}

export default CreateNews;
