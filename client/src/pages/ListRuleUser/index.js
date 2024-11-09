import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

function ListRule() {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://fptu-library.xyz/api/rules/list")
      .then((response) => response.json())
      .then((data) => {
        setRules(data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching rules:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-center mt-4">Loading...</div>;
  }

  const getLimitedContent = (content, lineLimit = 3) => {
    const lines = content.split("\n");
    if (lines.length > lineLimit) {
      return lines.slice(0, lineLimit).join("\n") + "...";
    }
    return content;
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this rule?")) {
      try {
        const response = await fetch(`https://fptu-library.xyz/api/rules/delete/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
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
    navigate(`/list-rule-user/rule-detail/${id}`);
  };

  return (
    <div className="container mt-4">
      <table className="table table-striped table-bordered">
        <thead className="thead-dark">
          <tr>
            <th style={{ textAlign: "center", width: "50px" }}>STT</th> {/* Căn giữa và đặt độ rộng */}
            <th>Title</th>
            {/* <th>Content</th> */}
          </tr>
        </thead>
        <tbody>
          {rules.length > 0 ? (
            rules.map((rule, index) => (
              <tr key={rule.id}>
                <td style={{ textAlign: "center" }}>{index + 1}</td> {/* Căn giữa số thứ tự */}
                <td 
                  onClick={() => handleClick(rule.id)} 
                  className="btn-link" 
                  style={{ fontWeight: "bold", color: "#007bff", textAlign: "left" }} // Highlight phần title
                >
                  {rule.title}
                </td>
                {/* <td>{getLimitedContent(rule.content)}</td> */}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center">No rules found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ListRule;
