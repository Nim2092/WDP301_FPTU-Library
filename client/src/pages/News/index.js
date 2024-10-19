import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Nếu bạn dùng react-router-dom

function NewsPage() {
  const [newsItems, setNewsItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Hiển thị 6 bài viết mỗi trang

  useEffect(() => {
    // Fetch news items from the API
    const fetchNews = async () => {
      try {
        const response = await fetch("http://localhost:9999/api/news/list");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setNewsItems(data.data);
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };

    fetchNews();
  }, []);

  // Tính toán số trang
  const totalPages = Math.ceil(newsItems.length / itemsPerPage);

  // Tính toán các bài viết sẽ hiển thị cho trang hiện tại
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = newsItems.slice(indexOfFirstItem, indexOfLastItem);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="news container my-5">
      {Array.isArray(currentItems) && currentItems.length > 0 ? (
        currentItems.map((item) => (
          <div className="row mb-4" key={item.id}>
            {/* Cột hình ảnh */}
            <div className="col-md-4">
              <img
                src={`http://localhost:9999/api/news/thumbnail/${item.thumbnail
                  .split("/")
                  .pop()}`}
                className="img-fluid"
                alt={item.title}
              />
            </div>

            {/* Cột nội dung */}
            <div className="col-md-8">
              <div className="card-body">
                <h5 className="card-title">{item.title}</h5>
                <p className="card-text">{item.content}</p>
                <div className="text-end">
                  <Link
                    to={`/news-detail/${item._id}`}
                    className="btn btn-primary"
                  >
                    Xem chi tiết
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="row">
          <div className="col-12">
            <p className="text-center">No news items available.</p>
          </div>
        </div>
      )}

      {/* Phân trang */}
      {newsItems.length > itemsPerPage && (
        <div className="row">
          <div className="col text-center">
            <button
              className="btn btn-secondary mx-2"
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="btn btn-secondary mx-2"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default NewsPage;
