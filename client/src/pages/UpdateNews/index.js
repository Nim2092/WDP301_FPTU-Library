import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

function UpdateNews() {
  const { id } = useParams(); // Get the news ID from the URL
  const navigate = useNavigate(); // Hook to navigate to another route
  const [data, setData] = useState({ title: "", content: "", thumbnail: "" }); // Initialize state with empty values
  const [loading, setLoading] = useState(true); // Loading state
  const [thumbnail, setThumbnail] = useState(null); // State for selected image

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

  const handleThumbnailChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setThumbnail(URL.createObjectURL(e.target.files[0])); // Create a temporary URL to preview the image
      setData({ ...data, thumbnail: e.target.files[0] }); // Save the actual file to the state for server upload
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("content", data.content); // Save CKEditor HTML content
    // Only append the thumbnail if a new one is selected
    if (data.thumbnail instanceof File) {
      formData.append("thumbnail", data.thumbnail); // Send selected image file only if updated
    }
  
    try {
      const response = await axios.put(
        `http://localhost:9999/api/news/update/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Correct Content-Type for file uploads
          },
        }
      );
  
      if (response.status === 200) {
        alert("News updated successfully");
        navigate("/list-news-admin"); // Navigate back to the news list
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
      <div className="row">
        <div className="col-md-12 text-center">
          <h1>Update News</h1>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="row">
          {/* Thumbnail upload section */}
          <div className="col-md-3">
            <div className="form-group">
              {thumbnail ? (
                // Show newly selected thumbnail
                <img src={thumbnail} alt="Selected" className="img-thumbnail" />
              ) : data.thumbnail ? (
                // Show current thumbnail from data if available
                <img
                  src={`http://localhost:9999/api/news/thumbnail/${data.thumbnail
                    .split("/")
                    .pop()}`}
                  className="img-fluid"
                  alt={data.title}
                  style={{ width: "100%", height: "auto" }}
                />
              ) : (
                // Placeholder if no thumbnail is available
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
              )}
              <input
                type="file"
                className="form-control mt-2"
                onChange={handleThumbnailChange} // Handle thumbnail selection
              />
            </div>
          </div>
          <div className="col-md-9">
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
        </div>

        <div className="form-group mt-3">
          <label htmlFor="content">Content</label>
          <CKEditor
            editor={ClassicEditor}
            data={data.content} // Initial content for CKEditor
            onChange={(event, editor) => {
              const content = editor.getData();
              setData({ ...data, content: content }); // Update content on change
            }}
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
