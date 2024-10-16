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
            src={newsDetail.image}
            alt={newsDetail.title}
            style={{ maxWidth: "100%", height: "auto", marginTop: "20px" }}
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
