import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

function CreateNews() {
  const [data, setData] = useState({
    title: "",
    content: "", // CKEditor will update this value
    thumbnail: null,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();

  // Handle image selection and preview
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setData({ ...data, thumbnail: e.target.files[0] });
      setImagePreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  // Handle form submission to create news
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("content", data.content); // CKEditor content
    formData.append("thumbnail", data.thumbnail);
    formData.append("createdBy", "60c72b2f9b1e8a5b5c8f1a2e");
    formData.append("updatedBy", "60c72b2f9b1e8a5b5c8f1a2e");

    try {
      const response = await axios.post("https://fptu-library/api/news/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        alert("News created successfully");
        navigate("/list-news-admin");
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
            onChange={handleImageChange}
          />
        </div>

        <div className="form-group mt-3">
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
          <CKEditor
            editor={ClassicEditor}
            data={data.content}
            onChange={(event, editor) => {
              const contentData = editor.getData();
              setData({ ...data, content: contentData }); // Update content with CKEditor data
            }}
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
