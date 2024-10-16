import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function UpdateNews() {
  const { id } = useParams(); // Get the news ID from the URL
  const navigate = useNavigate(); // Hook to navigate to another route
  const [data, setData] = useState({ title: "", content: "", thumbnail: "" }); // Initialize state with empty values
  const [loading, setLoading] = useState(true); // Loading state

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:9999/api/news/update/${id}`, {
        title: data.title,
        content: data.content,
        thumbnail: data.thumbnail,
      });

      if (response.status === 200) {
        alert("News updated successfully");
        navigate("/list-news-admin"); // Navigate back to the news list page
      } else {
        alert("Failed to update news");
      }
    } catch (error) {
      console.error("Error updating news:", error);
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
        <div className="form-group mt-3">
          <label htmlFor="thumbnail">Thumbnail URL</label>
          <input
            type="text"
            className="form-control"
            id="thumbnail"
            value={data.thumbnail}
            onChange={(e) => setData({ ...data, thumbnail: e.target.value })}
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
