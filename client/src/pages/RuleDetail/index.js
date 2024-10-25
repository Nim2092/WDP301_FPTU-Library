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
          `http://localhost:9999/api/rules/get/${id}`
        );
        const data = await response.json();

        if (response.ok) {
          console.log(data);
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
    return <div className="text-center mt-4">Loading...</div>;
  }

  // Show error message if there's any issue with fetching data
  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  // Render rule details
  return (
    <div className="rule_detail container mt-4">
      <div className="">
        <h1>
          <strong>{rule.title}</strong>
        </h1>
      </div>
      <div className="d-flex justify-content-between">
        <p>{new Date(rule.createdAt).toLocaleString()}</p>
        <p>{new Date(rule.updatedAt).toLocaleString()}</p>
      </div>
      <div className="mt-4">
        {/* Render content as HTML */}
        <div dangerouslySetInnerHTML={{ __html: rule.content }} />
      </div>
    </div>
  );
}

export default RuleDetail;
