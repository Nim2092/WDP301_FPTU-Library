import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import ReactPaginate from 'react-paginate';

const ListPenaltyReasons = () => {
  const navigate = useNavigate();
  const [penaltyReasons, setPenaltyReasons] = useState([]);
  const [message, setMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(5);

  useEffect(() => {
    const fetchPenaltyReasons = async () => {
      try {
        const response = await fetch("https://fptu-library/api/penalty-reasons/list");
        const data = await response.json();
        setPenaltyReasons(data.data);
      } catch (error) {
        console.error("Error fetching penalty reasons:", error);
        toast.error("Error fetching penalty reasons");
      }
    };

    fetchPenaltyReasons();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this penalty reason?")) {
      try {
        const response = await fetch(
          `https://fptu-library/api/penalty-reasons/delete/${id}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          setPenaltyReasons((prevReasons) =>
            prevReasons.filter((reason) => reason._id !== id)
          );
          toast.success("Penalty reason deleted successfully");
        } else {
          toast.error("Failed to delete penalty reason");
        }
      } catch (error) {
        console.error("Error deleting penalty reason:", error);
        toast.error("Error deleting penalty reason");
      }
    }
  };

  const handleUpdate = (id) => {
    navigate(`/update-penalty-reason/${id}`);
  };

  const handleCreatePenaltyReasons = () => {
    navigate("/create-penalty-reason");
  };

  const indexOfLastItem = (currentPage + 1) * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = penaltyReasons.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  return (
    <div className="container mt-4">
       
      <div className="d-flex justify-content-end mb-3">
        <button
          className="btn btn-primary"
          onClick={handleCreatePenaltyReasons}
          title="Tạo mới"
        >
          <i className="fa fa-plus" aria-hidden="true"></i>
          <span className="tooltip-text"> Tạo mới</span>
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
            <th>Tên lỗi</th>
            <th>Số tiền phạt</th>
            <th>Loại</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.length > 0 ? (
            currentItems.map((reason, index) => (
              <tr key={reason._id}>
                <td>{currentPage * itemsPerPage + index + 1}</td>
                <td className="text-start">{reason.reasonName}</td>
                <td>
                  {reason.penaltyAmount} {reason.type === "PN1" ? "VNĐ" : "%"}
                </td>
                <td>{reason.type}</td>
                <td>
                  <button
                    className="btn btn-success"
                    style={{marginRight: '10px'}}
                    title="Sửa"
                    onClick={() => handleUpdate(reason._id)}
                  >
                    <i className="fa fa-pencil" aria-hidden="true"></i>
                  </button>
                  <button
                    className="btn btn-danger"
                    title="Xóa"
                    onClick={() => handleDelete(reason._id)}
                  >
                    <i className="fa fa-trash" aria-hidden="true"></i>
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                Không tìm thấy lỗi
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="d-flex justify-content-end">
        <ReactPaginate
          previousLabel={'<'}
          nextLabel={'>'}
          breakLabel={'...'}
          pageCount={Math.ceil(penaltyReasons.length / itemsPerPage)}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageClick}
          containerClassName={"pagination justify-content-center"}
          pageClassName={"page-item"}
          pageLinkClassName={"page-link"}
          previousClassName={"page-item"}
          previousLinkClassName={"page-link"}
          nextClassName={"page-item"}
          nextLinkClassName={"page-link"}
          breakClassName={"page-item"}
          breakLinkClassName={"page-link"}
          activeClassName={"active"}
        />
      </div>
    </div>
  );
};

export default ListPenaltyReasons;
