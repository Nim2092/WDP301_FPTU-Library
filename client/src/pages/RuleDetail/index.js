import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function RuleDetail() {
  const { id } = useParams(); // Get the rule ID from the URL
  const [rule, setRule] = useState(null); // State to store rule data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Fetch the rule data when the component is mounted
  useEffect(() => {
    const fetchRule = async () => {
      try {
        const response = await fetch(
          `https://fptu-library/api/rules/get/${id}`
        );
        const data = await response.json();

        if (response.ok) {
          setRule(data.data); // Set rule data
          setLoading(false); // Stop loading
        } else {
          setError("Failed to fetch rule");
          setLoading(false);
        }
      } catch (err) {
        console.error("Error fetching rule:", err);
        setError("Error fetching rule");
        setLoading(false);
      }
    };

    fetchRule();
  }, [id]); // Re-fetch if ID changes

  // Show loading message while fetching data
  if (loading) {
    return <div className="text-center mt-4">Đang tải...</div>;
  }

  // Show error message if there's any issue with fetching data
  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  // Render rule details
  return (
    <div className="rule_detail container mt-4">
      <div className="text-center">
        <h1>
          <strong>{rule.title}</strong>
        </h1>
      </div>
      <div className="float-end">
        <p>{new Date(rule.createdAt).toLocaleString()}</p>
      </div>
      <div className="mt-5">
        {/* Render content as HTML */}
        <div dangerouslySetInnerHTML={{ __html: rule.content }} />
      </div>
    </div>
  );
}

export default RuleDetail;
