import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function UpdateNews() {
  const { id } = useParams(); // Get the news ID from the URL
  const navigate = useNavigate(); // Hook to navigate to another route
  const [data, setData] = useState({ title: "", content: "", thumbnail: "" }); // Initialize state with empty values
  const [loading, setLoading] = useState(true); // Loading state
  const [image, setImage] = useState(null); // State để lưu ảnh đã chọn

  useEffect(() => {
    // Fetch news detail
    const fetchNewsDetail = async () => {
      try {
        const res = await axios.get(`http://localhost:9999/api/news/get/${id}`);
        setData(res.data.data); // Assuming `data` is the nested object with news information
        setLoading(false); // Set loading to false once data is fetched
      } catch (error) {
        console.error("Error fetching news:", error);
        alert("Error fetching news details");
      }
    };

    fetchNewsDetail();
  }, [id]);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(URL.createObjectURL(e.target.files[0])); // Tạo URL tạm thời để xem trước ảnh
      // Bạn có thể lưu file thực tế trong state khác nếu cần upload lên server
      setData({ ...data, thumbnail: e.target.files[0] }); // Lưu file ảnh vào state để gửi lên server
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("content", data.content);
    formData.append("thumbnail", data.thumbnail); // Gửi file ảnh đã chọn

    try {
      const response = await axios.put(
        `http://localhost:9999/api/news/update/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Khi gửi file ảnh cần đặt đúng loại Content-Type
          },
        }
      );

      if (response.status === 200) {
        alert("News updated successfully");
        navigate("/list-news-admin"); // Điều hướng về trang danh sách
      } else {
        alert("Failed to update news");
      }
    } catch (error) {
      console.error(
        "Error updating news:",
        error.response ? error.response.data : error.message
      );
      alert("Error updating news");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-4">
  <h1>Update News</h1>
  <form onSubmit={handleSubmit}>
    <div className="row">
      {/* Phần upload hình ảnh */}
      <div className="col-md-3">
        <div className="form-group">
          {image ? (
            // Hiển thị ảnh mới được chọn
            <img src={image} alt="Selected" className="img-thumbnail" />
          ) : (
            // Hiển thị ảnh hiện tại từ dữ liệu nếu có
            data.thumbnail ? (
              <img
                src={`http://localhost:9999/api/news/thumbnail/${data.thumbnail.split('/').pop()}`}
                className="img-fluid"
                alt={data.title}
              />
            ) : (
              // Nếu không có ảnh trong dữ liệu, hiển thị khung trống
              <div
                className="img-thumbnail d-flex justify-content-center align-items-center"
                style={{
                  height: "200px",
                  width: "100%",
                  backgroundColor: "#f0f0f0",
                }}
              >
                Add img
              </div>
            )
          )}
          <input
            type="file"
            className="form-control mt-2"
            onChange={handleImageChange} // Xử lý khi người dùng chọn ảnh
          />
        </div>
      </div>
    </div>

    <div className="form-group">
      <label htmlFor="title">Title</label>
      <input
        type="text"
        className="form-control"
        id="title"
        value={data.title}
        onChange={(e) => setData({ ...data, title: e.target.value })}
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
        required
      />
    </div>
    <button type="submit" className="btn btn-primary mt-3">
      Update
    </button>
  </form>
</div>

  );
}

export default UpdateNews;
