import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function NewsDetail() {
  const [newsDetail, setNewsDetail] = useState({});
  const { id } = useParams(); // Get the ID from the URL parameters

  useEffect(() => {
    let isMounted = true; // Flag to prevent memory leaks if the component is unmounted

    const fetchNewsDetail = async () => {
      try {
        const response = await fetch(
          `http://localhost:9999/api/news/get/${id}`
        );
        const data = await response.json();
        if (isMounted) {
          setNewsDetail(data.data); // Only update state if the component is still mounted
        }
        console.log(data.data);
      } catch (error) {
        console.error("Error fetching news detail:", error);
      }
    };

    fetchNewsDetail(); // Call the function after defining it

    return () => {
      isMounted = false; // Set the flag to false on component unmount
    };
  }, [id]); // Dependency array ensures this runs when the component mounts or the ID changes

  return (
    <div className="news_detail container mt-4">
      {newsDetail.title ? (
        <>
          <h1>{newsDetail.title}</h1>
          <p> {new Date(newsDetail.createdAt).toLocaleString()}</p>
          <img
            src={
              newsDetail.thumbnail
                ? `http://localhost:9999/api/news/thumbnail/${newsDetail.thumbnail
                    .split("/")
                    .pop()}`
                : "data:image/png;base64,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" // Thay thế bằng URL của hình ảnh mặc định nếu không có image
            }
            style={{ maxWidth: "100%", height: "auto", marginTop: "20px" }}
            alt={newsDetail.title}
          />

          <p style={{ marginTop: "20px" }}>{newsDetail.content}</p>
        </>
      ) : (
        <p>Loading news details...</p> // Display loading message while fetching
      )}
    </div>
  );
}

export default NewsDetail;
