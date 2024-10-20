import React, { useEffect, useState } from "react";
import Button from "../Button/Button";
import { useNavigate } from "react-router-dom";
function News() {
  const [newsItems, setNewsItems] = useState([]);
  const navigate = useNavigate();
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

  const handleClick = (id) => {
    navigate(`/news-detail/${id}`);
  };

  return (
    <div className="news container my-5">
      <h2>News</h2>
      <div className="row">
        {Array.isArray(newsItems) && newsItems.length > 0 ? (
          newsItems.slice(0, 3).map((item) => (
            <div key={item.id} className="col-md-4 mb-4">
              <div className="card h-100">
                <img
                  src={`http://localhost:9999/api/news/thumbnail/${item.thumbnail
                    .split("/")
                    .pop()}`}
                  className="card-img-top"
                  alt={item.title}
                />

                <div className="card-body">
                  <h5 className="card-title" onClick={() => handleClick(item._id)}>{item.title}</h5>
                  <p className="card-text">{item.content}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12">
            <p className="text-center">No news items available.</p>
          </div>
        )}
      </div>
      {newsItems.length > 3 && (
        <div className="text-end mt-4">
          <Button text="Xem thêm" link="/news" />
        </div>
      )}
    </div>
  );
}

export default News;
