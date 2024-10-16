import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

function ListRule() {
  // State to store the list of rules fetched from the API
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true); // State to manage loading
  const [message, setMessage] = useState(""); // To display success or error messages
  const navigate = useNavigate();

  // Fetch rules from the API when the component is mounted
  useEffect(() => {
    fetch("http://localhost:9999/api/rules/list")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setRules(data.data); // Accessing the 'data' field in the response
        setLoading(false); // Set loading to false after data is fetched
      })
      .catch((error) => {
        console.error("Error fetching rules:", error);
        setLoading(false); // Stop loading even if there's an error
      });
  }, []); // Empty dependency array means this runs once after the component mounts

  if (loading) {
    return <div className="text-center mt-4">Loading...</div>; // Show a loading message while fetching data
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
    console.log(id);
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between mb-3">
        <h2>List of Rules</h2>
        <button className="btn btn-primary" onClick={() => navigate("/create-new-rule")}>
          Create new rule
        </button>
      </div>

      {/* Display success or error message */}
      {message && (
        <div className={`alert ${message.includes("successfully") ? "alert-success" : "alert-danger"}`}>
          {message}
        </div>
      )}

      <table className="table table-striped table-bordered">
        <thead className="thead-dark">
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Content</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rules.length > 0 ? (
            rules.map((rule) => (
              <tr key={rule.id}>
                <td>{rule.id}</td>
                <td onClick={() => handleClick(rule.id)} className="btn-link">{rule.title}</td>
                <td>{rule.content}</td>
                <td className="d-flex justify-content-between">
                  <button className="btn btn-success" onClick={() => navigate(`/update-rule/${rule.id}`)}>
                    Update
                  </button>
                  <button className="btn btn-danger" onClick={() => handleDelete(rule.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">No rules found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ListRule;
