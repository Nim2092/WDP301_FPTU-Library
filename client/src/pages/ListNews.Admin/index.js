import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ListNews = () => {
  const navigate = useNavigate();
  const [newsData, setNewsData] = useState([]); // State for storing news data
  const [message, setMessage] = useState(""); // State for messages

  // Fetch news data from the API when the component is mounted
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch("http://localhost:9999/api/news/list");
        const data = await response.json();
        setNewsData(data.data);
        console.log(data.data); // Assuming 'data.data' contains the news items
      } catch (error) {
        console.error("Error fetching news:", error);
        setMessage("Error fetching news");
      }
    };

    fetchNews();
  }, []);

  // Handle news deletion
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this news?")) {
      try {
        const response = await fetch(
          `http://localhost:9999/api/news/delete/${id}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          // Remove the deleted news from the state
          setNewsData((prevNewsData) =>
            prevNewsData.filter((news) => news.id !== id)
          ); // Ensure you're using the correct 'id'
          setMessage("News deleted successfully");
        } else {
          setMessage("Failed to delete news");
        }
      } catch (error) {
        console.error("Error deleting news:", error);
        setMessage("Error deleting news");
      }
    }
  };

  // Navigate to the update page
  const handleUpdate = (id) => {
    navigate(`/update-news/${id}`);
  };

  // Navigate to the create news page
  const handleCreateNew = () => {
    navigate("/create-news");
  };

  const handleDetail = (id) => {
    navigate(`/news-detail/${id}`);
  };
  //hàm lấy ra 50 ký tự đầu của content
  const getLimitedContent = (content, limit = 50) => {
    if (content.length > limit) {
      return content.substring(0, limit) + "...";
    }
    return content;
  };
  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between mb-3">
        <h2>List News</h2>
        <button
          className="btn btn-primary"
          style={{ backgroundColor: "#CC99FF", borderColor: "#CC99FF" }}
          onClick={handleCreateNew}
        >
          Create New
        </button>
      </div>

      {/* Display success or error messages */}
      {message && (
        <div
          className={`alert ${
            message.includes("successfully") ? "alert-success" : "alert-danger"
          }`}
        >
          {message}
        </div>
      )}

      <table className="table table-bordered mt-4">
        <thead>
          <tr>
            <th>No.</th>
            <th>Image</th>
            <th>Title</th>
            <th>Content</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {newsData.length > 0 ? (
            newsData.map((news, index) => (
              <tr key={news.id}>
                <td>{index + 1}</td> {/* Sequential number starting from 1 */}
                <td>
                  <img
                    src={news.image || "https://via.placeholder.com/150"}
                    alt={news.title}
                    style={{ width: "100px", height: "100px" }}
                  />
                </td>
                <td>{news.title}</td>
                <td>{getLimitedContent(news.content, 50)}</td>
                <td className="d-flex justify-content-between">
                  <button
                    className="btn btn-success"
                    onClick={() => handleUpdate(news.id)}
                  >
                    Update
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleDetail(news.id)}
                  >
                    Detail
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(news.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                No news found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ListNews;
