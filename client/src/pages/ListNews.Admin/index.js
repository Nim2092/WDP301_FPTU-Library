import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import ReactPaginate from "react-paginate";
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
        const response = await fetch("http://localhost:9999/api/news/list");
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
          `http://localhost:9999/api/news/delete/${id}`,
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


  // Handle page click
  const handlePageClick = (data) => {
    setCurrentPage(data.selected + 1);
  };

  return (
    <div className="container mt-4">
       
      <div className="d-flex justify-content-end mb-3">
        <button
          className="btn btn-primary"
          style={{ backgroundColor: "#CC99FF", borderColor: "#CC99FF" }}
          onClick={handleCreateNew}
          title="Tạo tin"
        >
          <i className="fa fa-plus" aria-hidden="true"></i>
        </button>
      </div>

      {/* Display success or error messages */}
      {message && (
        <div
          className={`alert ${message.includes("successfully") ? "alert-success" : "alert-danger"
            }`}
        >
          {message}
        </div>
      )}

      <table className="table table-bordered mt-4">
        <thead>
          <tr>
            <th>#</th>
            <th>Ảnh</th>
            <th>Tiêu đề</th>
            <th>Nội dung</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.length > 0 ? (
            currentItems.map((news, index) => (
              <tr key={news._id}>
                <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                <td>
                  <img
                    src={`http://localhost:9999/api/news/thumbnail/${news.thumbnail
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
                <td>
                  <button
                    className="btn btn-success"
                    onClick={() => handleUpdate(news._id)}
                    title="Cập nhật"
                    style={{ marginRight: "20px" }}
                  >
                    <i className="fa fa-pencil" aria-hidden="true"></i>
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleDetail(news._id)}
                    title="Xem chi tiết"
                    style={{ marginRight: "20px" }}
                  >
                    <i className="fa fa-eye" aria-hidden="true"></i>
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(news._id)}
                    title="Xóa"
                  >
                    <i className="fa fa-trash" aria-hidden="true"></i>
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

      <ReactPaginate
        previousLabel={'<'}
        nextLabel={'>'}
        breakLabel={'...'}
        pageCount={totalPages}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageClick}
        containerClassName={'pagination justify-content-end'}
        pageClassName={'page-item'}
        pageLinkClassName={'page-link'}
        previousClassName={'page-item'}
        previousLinkClassName={'page-link'}
        nextClassName={'page-item'}
        nextLinkClassName={'page-link'}
        breakClassName={'page-item'}
        breakLinkClassName={'page-link'}
        activeClassName={"active"}
      />
    </div>
  );
};

export default ListNews;
