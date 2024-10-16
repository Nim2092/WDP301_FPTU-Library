import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Editor from "../../components/Editor";
function CreateNews() {
  const [data, setData] = useState({
    title: "",
    content: "",
    thumbnail: "",
  }); // Initialize state with empty strings for the form fields

  const navigate = useNavigate();

  // Handle form submission to create a new news item
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:9999/api/news/create",
        {
          title: data.title,
          content: data.content,
          thumbnail: data.thumbnail,
          createdBy: "60c72b2f9b1e8a5b5c8f1a2e", // Static user ID for createdBy
          updatedBy: "60c72b2f9b1e8a5b5c8f1a2e", // Static user ID for updatedBy
        }
      );

      if (response.status === 201) {
        alert("News created successfully");
        navigate("/news"); // Navigate to the news list page after successful creation
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
        <div className="form-group mt-3">
          <label htmlFor="thumbnail">Thumbnail URL</label>
          <input
            type="text"
            className="form-control"
            id="thumbnail"
            value={data.thumbnail}
            onChange={(e) => setData({ ...data, thumbnail: e.target.value })}
            placeholder="Enter thumbnail URL"
          />
        </div>
        <button type="submit" className="btn btn-primary mt-3">
          Create News
        </button>
      </form>
      <Editor />    
    </div>
  );
}

export default CreateNews;
