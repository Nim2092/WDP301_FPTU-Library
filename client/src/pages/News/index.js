import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./news.scss"; // Import the CSS file

function NewsPage() {
  const [newsItems, setNewsItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Show 6 articles per page

  useEffect(() => {
    // Fetch news items from the API
    const fetchNews = async () => {
      try {
        const response = await fetch("https://fptu-library.xyz/api/news/list");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setNewsItems(data.data.reverse()); // Reverse the order of news items
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };

    fetchNews();
  }, []);

  // Calculate total pages for pagination
  const totalPages = Math.ceil(newsItems.length / itemsPerPage);

  // Calculate items to display for the current page
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
      <h2>News</h2>
      {Array.isArray(currentItems) && currentItems.length > 0 ? (
        currentItems.map((item) => (
          <div className="row mb-4" key={item._id}>
            <div className="col-md-4">
              <img
                src={`https://fptu-library.xyz/api/news/thumbnail/${item.thumbnail.split("/").pop()}`}
                className="img-fluid"
                alt={item.title}
              />
            </div>
            <div className="col-md-8">
              <div className="card-body">
                <h5 className="card-title">{item.title}</h5>
                <div
                  className="card-text content-preview"
                  dangerouslySetInnerHTML={{ __html: item.content }}
                />
                <div className="text-end mt-3">
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

      {/* Pagination */}
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
