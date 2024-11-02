import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const ListPenaltyReasons = () => {
  const navigate = useNavigate();
  const [penaltyReasons, setPenaltyReasons] = useState([]); // State for storing penalty reasons
  const [message, setMessage] = useState(""); // State for messages
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Number of items per page

  // Fetch penalty reasons from the API when the component is mounted
  useEffect(() => {
    const fetchPenaltyReasons = async () => {
      try {
        const response = await fetch("http://localhost:9999/api/penalty-reasons/list");
        const data = await response.json();
        setPenaltyReasons(data.data);
      } catch (error) {
        console.error("Error fetching penalty reasons:", error);
        toast.error("Error fetching penalty reasons");
      }
    };

    fetchPenaltyReasons();
  }, []);

  // Handle penalty reason deletion
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this penalty reason?")) {
      try {
        const response = await fetch(
          `http://localhost:9999/api/penalty-reasons/delete/${id}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          setPenaltyReasons((prevReasons) =>
            prevReasons.filter((reason) => reason._id !== id)
          ); // Ensure you're using the correct 'id'
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

  // Navigate to the update page
  const handleUpdate = (id) => {
    navigate(`/update-penalty-reason/${id}`);
  };

  // Navigate to the create penalty reason page
  const handleCreatePenaltyReasons = () => {
    navigate("/create-penalty-reason");
  };

  // Calculate items for the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = penaltyReasons.slice(indexOfFirstItem, indexOfLastItem);

  // Calculate total pages
  const totalPages = Math.ceil(penaltyReasons.length / itemsPerPage);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="container mt-4">
      <ToastContainer />
      <div className="d-flex justify-content-between mb-3">
        <h2>List Penalty Reasons</h2>
        <button
          className="btn btn-primary"
          style={{ backgroundColor: "#CC99FF", borderColor: "#CC99FF" }}
          onClick={handleCreatePenaltyReasons}
        >
          Create Penalty Reasons
        </button>
      </div>

      {/* Display success or error messages */}
      {message && (
        <div
          className={`alert ${
            message.includes("successfully") ? "alert-success" : "alert-danger"
          }`}
        >
          {message}
        </div>
      )}

      <table className="table table-bordered mt-4">
        <thead>
          <tr>
            <th>No.</th>
            <th>Reason Name</th>
            <th>Penalty Amount</th>
            <th>Type</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.length > 0 ? (
            currentItems.map((reason, index) => (
              <tr key={reason._id}>
                <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                <td className="text-start">{reason.reasonName}</td>
                <td className="text-start">${reason.penaltyAmount}</td>
                <td className="text-start">{reason.type}</td>
                <td className="d-flex justify-content-between">
                  <button
                    className="btn btn-success"
                    onClick={() => handleUpdate(reason._id)}
                  >
                    Update
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(reason._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                No penalty reasons found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      {penaltyReasons.length > 0 && (
        <nav aria-label="Page navigation">
          <ul className="pagination justify-content-center">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
            </li>
            
            {[...Array(totalPages)].map((_, index) => (
              <li
                key={index}
                className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
              >
                <button
                  className="page-link"
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </button>
              </li>
            ))}

            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default ListPenaltyReasons;
