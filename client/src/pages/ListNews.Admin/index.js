import React from "react";
import { useNavigate } from "react-router-dom";
const ListNews = () => {
  const navigate = useNavigate();
  const newsData = [
    { id: 1, image: "Link", name: "New 1", detail: "lorem ....." },
    { id: 2, image: "Link", name: "New 2", detail: "lorem ....." },
    { id: 3, image: "Link", name: "New 3", detail: "lorem ....." },
    { id: 4, image: "Link", name: "New 4", detail: "lorem ....." },
    { id: 5, image: "Link", name: "New 5", detail: "lorem ....." },
    { id: 6, image: "Link", name: "New 6", detail: "lorem ....." },
    { id: 7, image: "Link", name: "New 7", detail: "lorem ....." },
  ];

  const handleUpdate = (id) => {
    navigate(`/update-news/${id}`);
    console.log(`Update news with ID: ${id}`);
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this news?");
    if (confirmDelete) {
      console.log(`Delete news with ID: ${id}`);
      // Proceed with deletion logic here
    }
  };
  

  const handleCreateNew = () => {
    navigate("/create-news");
    console.log("Create new news");
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between">
        <h2>List News</h2>
        <button
          className="btn btn-primary"
          style={{ backgroundColor: "#CC99FF", borderColor: "#CC99FF" }}
          onClick={handleCreateNew}
        >
          Create new
        </button>
      </div>
      <table className="table table-bordered mt-4">
        <thead>
          <tr>
            <th>ID</th>
            <th>Image</th>
            <th>Name</th>
            <th>Detail</th>
            <th>Action</th>
            
          </tr>
        </thead>
        <tbody>
          {newsData.map((news) => (
            <tr key={news.id}>
              <td>{news.id}</td>
              <td>{news.image}</td>
              <td>{news.name}</td>
              <td>{news.detail}</td>
              <td className="d-flex justify-content-between">
                <button
                  className="btn btn-success"
                  onClick={() => handleUpdate(news.id)}
                >
                  Update
                </button>
              
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(news.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListNews;
