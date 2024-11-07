import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import ReactPaginate from 'react-paginate';

function ListRule() {
  // State to store the list of rules fetched from the API
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true); // State to manage loading
  const [message, setMessage] = useState(""); // To display success or error messages
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const rulesPerPage = 10; // Number of rules per page

  // Fetch rules from the API when the component is mounted
  useEffect(() => {
    fetch("http://localhost:9999/api/rules/list")
      .then((response) => response.json())
      .then((data) => {
        setRules(data.data); // Accessing the 'data' field in the response
        setLoading(false); // Set loading to false after data is fetched
      })
      .catch((error) => {
        console.error("Error fetching rules:", error);
        setLoading(false); // Stop loading even if there's an error
      });
  }, []); // Empty dependency array means this runs once after the component mounts

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const offset = currentPage * rulesPerPage;
  const currentRules = rules.slice(offset, offset + rulesPerPage);

  if (loading) {
    return <div className="text-center mt-4"> Đang tải dữ liệu ...</div>; // Show a loading message while fetching data
  }

  // Handle delete rule action
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this rule?")) {
      try {
        const response = await fetch(`http://localhost:9999/api/rules/delete/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          // Remove the deleted rule from the state
          setRules(rules.filter((rule) => rule.id !== id));
          setMessage("Rule deleted successfully");
        } else {
          setMessage("Failed to delete rule");
        }
      } catch (error) {
        console.error("Error deleting rule:", error);
        setMessage("Error deleting rule");
      }
    }
  };

  const handleClick = (id) => {
    navigate(`/rule-detail/${id}`);
  };

  const getLimitedContent = (content, lineLimit = 3) => {
    const lines = content.split("\n");
    if (lines.length > lineLimit) {
      return lines.slice(0, lineLimit).join("\n") + "...";
    }
    return content;
  };
  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-end mb-3">
        <button className="btn btn-primary" title="Tạo mới" onClick={() => navigate("/create-new-rule")}>
          <i className="fa fa-plus" aria-hidden="true"></i>
          <span className="tooltip-text"> Tạo mới</span>
        </button>
      </div>

      {message && (
        <div className={`alert ${message.includes("successfully") ? "alert-success" : "alert-danger"}`}>
          {message}
        </div>
      )}

      <table className="table table-striped table-bordered">
        <thead className="thead-dark">
          <tr>
            <th>ID</th>
            <th>Tiêu đề</th>
            {/* <th>Nội dung</th> */}
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {currentRules.length > 0 ? (
            currentRules.map((rule, index) => (
              <tr key={rule.id}>
                <td>{offset + index + 1}</td>
                <td onClick={() => handleClick(rule.id)} className="btn-link text-start" style={{textDecoration: 'none', cursor: 'pointer'}}>{rule.title}</td>
                {/* <td>{getLimitedContent(rule.content)  }</td> */}
                <td>
                  <button className="btn btn-success" title="Sửa" onClick={() => navigate(`/update-rule/${rule.id}`)} style={{marginRight: '10px'}}>
                    <i className="fa fa-pencil" aria-hidden="true"></i>
                  </button>
                  <button className="btn btn-danger" title="Xóa" onClick={() => handleDelete(rule.id)}>
                    <i className="fa fa-trash" aria-hidden="true"></i>
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">Không tìm thấy quy định</td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="d-flex justify-content-end">
        <ReactPaginate
          previousLabel={'<'}
          nextLabel={'>'}
          breakLabel={'...'}
          pageCount={Math.ceil(rules.length / rulesPerPage)}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageClick}
          containerClassName={'pagination justify-content-center'}
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
    </div>
  );
}

export default ListRule;
