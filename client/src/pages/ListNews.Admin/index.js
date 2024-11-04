import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
const ListNews = () => {
  const navigate = useNavigate();
  const [newsData, setNewsData] = useState([]); // State for storing news data
  const [message, setMessage] = useState(""); // State for messages
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Số item trên mỗi trang

  // Fetch news data from the API when the component is mounted
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch("https://fptu-library.xyz/api/news/list");
        const data = await response.json();
        setNewsData(data.data);
      } catch (error) {
        console.error("Error fetching news:", error);
        toast.error("Error fetching news");
      }
    };

    fetchNews();
  }, []);

  // Handle news deletion
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this news?")) {
      try {
        const response = await fetch(
          `https://fptu-library.xyz/api/news/delete/${id}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          // Remove the deleted news from the state
          setNewsData((prevNewsData) =>
            prevNewsData.filter((news) => news._id !== id)
          ); // Ensure you're using the correct 'id'
          toast.success("News deleted successfully");
        } else {
          toast.error("Failed to delete news");
        }
      } catch (error) {
        console.error("Error deleting news:", error);
        toast.error("Error deleting news");
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

  // Function to get limited content
  const getLimitedContent = (content, limit = 50) => {
    if (content.length > limit) {
      return content.substring(0, limit) + "...";
    }
    return content;
  };

  // Tính toán các item cho trang hiện tại
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // Sort news data by createdAt before slicing
  const sortedNewsData = [...newsData].sort((a, b) => 
    new Date(b.createdAt) - new Date(a.createdAt)
  );
  const currentItems = sortedNewsData.slice(indexOfFirstItem, indexOfLastItem);

  // Tính tổng số trang
  const totalPages = Math.ceil(newsData.length / itemsPerPage);

  // Xử lý thay đổi trang
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="container mt-4">
      <ToastContainer />
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
          {currentItems.length > 0 ? (
            currentItems.map((news, index) => (
              <tr key={news._id}>
                <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                <td>
                  <img
                    src={`https://fptu-library.xyz/api/news/thumbnail/${news.thumbnail
                      .split("/")
                      .pop()}`}
                    style={{ width: "120px", height: "120px" }}
                    alt={news.title}
                  />
                </td>
                <td className="text-start w-25">{news.title}</td>
                <td className="text-start w-25"><div
                    className="content-preview"
                    dangerouslySetInnerHTML={{
                      __html: getLimitedContent(news.content, 50),
                    }}
                  /></td>
                <td className="d-flex justify-content-between">
                  <button
                    className="btn btn-success"
                    onClick={() => handleUpdate(news._id)}
                  >
                    Update
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleDetail(news._id)}
                  >
                    Detail
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(news._id)}
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

      {/* Thêm phân trang Bootstrap */}
      {newsData.length > 0 && (
        <nav aria-label="Page navigation">
          <ul className="pagination justify-content-center">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
            </li>
            
            {[...Array(totalPages)].map((_, index) => (
              <li
                key={index}
                className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
              >
                <button
                  className="page-link"
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </button>
              </li>
            ))}

            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default ListNews;
