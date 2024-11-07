import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./news.scss"; // Import the CSS file
import ReactPaginate from "react-paginate";

function NewsPage() {
  const [newsItems, setNewsItems] = useState([]);
  const [currentItems, setCurrentItems] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 10; // Number of items per page

  useEffect(() => {
    // Fetch news items from the API
    const fetchNews = async () => {
      try {
        const response = await fetch("https://fptu-library/api/news/list");
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

  useEffect(() => {
    const endOffset = itemOffset + itemsPerPage;
    setCurrentItems(newsItems.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(newsItems.length / itemsPerPage));
  }, [itemOffset, newsItems]);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % newsItems.length;
    setItemOffset(newOffset);
  };

  return (
    <div className="news container my-5">
      {Array.isArray(currentItems) && currentItems.length > 0 ? (
        currentItems.map((item) => (
          <div className="row mb-4" style={{ boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.1)' , borderRadius: '10px'}} key={item._id}>
            <div className="col-md-4" >
              <img
                src={`https://fptu-library/api/news/thumbnail/${item.thumbnail.split("/").pop()}`}
                className="img-fluid"
                style={{borderRadius: '10px', margin: '10px', border: '1px solid #ccc'}}
                alt={item.title}
              />
            </div>
            <div className="col-md-8" style={{padding: '10px'}}>
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
      <ReactPaginate
        previousLabel={'<'}
        nextLabel={'>'}
        breakLabel={'...'}
        pageCount={pageCount}
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
        activeClassName={'active'}
      />
    </div>
  );
}

export default NewsPage;
