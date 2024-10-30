import React, { useEffect, useState } from "react";
import Button from "../Button/Button";
import { useNavigate } from "react-router-dom";
import "./News.scss"; // Import the CSS file

function News() {
  const [newsItems, setNewsItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
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
          newsItems.slice(-3).map((item) => ( // Take the last 3 items
            <div key={item._id} className="col-md-4 mb-4" >
              <div className="card h-100" onClick={() => handleClick(item._id)}>
                <img
                  src={`http://localhost:9999/api/news/thumbnail/${item.thumbnail.split("/").pop()}`}
                  className="card-img-top"
                  alt={item.title}
                  style={{ width: "100%", height: "200px", objectFit: "cover", cursor: "pointer" }}
                />
                <div className="card-body">
                  <h5 className="card-title" style={{ cursor: "pointer" }}>
                    {item.title}
                  </h5>
                  <div
                    className="card-text content-preview"
                    style={{ marginTop: "20px" }}
                    dangerouslySetInnerHTML={{ __html: item.content }}
                  />
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
