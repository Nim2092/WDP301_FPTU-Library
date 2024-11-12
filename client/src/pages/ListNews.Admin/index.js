import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import ReactPaginate from "react-paginate";
import { Modal, Button } from "react-bootstrap";

const ListNews = () => {
  const navigate = useNavigate();
  const [newsData, setNewsData] = useState([]);
  const [message, setMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [showModal, setShowModal] = useState(false);
  const [newsIdToDelete, setNewsIdToDelete] = useState(null);

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

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `http://localhost:9999/api/news/delete/${newsIdToDelete}`,
        {
          method: "DELETE",
        }
      );
      setNewsData((prevNewsData) =>
        prevNewsData.filter((news) => news._id !== newsIdToDelete)
      );
      toast.success("Xóa tin tức thành công");
    } catch (error) {
      console.error("Error deleting news:", error);
      toast.error("Xóa tin tức thất bại");
    } finally {
      setShowModal(false);
    }
  };

  const handleShowModal = (id) => {
    setNewsIdToDelete(id);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleUpdate = (id) => {
    navigate(`/list-news-admin/update-news/${id}`);
  };

  const handleCreateNew = () => {
    navigate("/list-news-admin/create-news");
  };

  const handleDetail = (id) => {
    navigate(`/news/news-detail/${id}`);
  };

  const getLimitedContent = (content, limit = 50) => {
    if (content.length > limit) {
      return content.substring(0, limit) + "...";
    }
    return content;
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const sortedNewsData = [...newsData].sort((a, b) =>
    new Date(b.createdAt) - new Date(a.createdAt)
  );
  const currentItems = sortedNewsData.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(newsData.length / itemsPerPage);

  const handlePageClick = (data) => {
    setCurrentPage(data.selected + 1);
  };

  return (
    <div className="container mt-4">
      <ToastContainer />
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
                    onClick={() => handleShowModal(news._id)}
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

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this news?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ListNews;
