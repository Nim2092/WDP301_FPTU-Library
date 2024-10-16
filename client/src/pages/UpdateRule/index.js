import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // Assuming you're using React Router

function UpdateRule() {
  const { id } = useParams(); // Get the rule ID from the URL
  const [data, setData] = useState({ title: "", content: "" }); // Initialize with empty strings
  const [message, setMessage] = useState(""); // Message to display after success/failure

  // Fetch the rule data when the component is mounted
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:9999/api/rules/get/${id}`
        );
        const result = await response.json();
        if (response.ok) {
          // Pre-fill the form with fetched data
          setData(result.data || { title: "", content: "" });
        } else {
          setMessage("Error fetching rule data");
        }
      } catch (error) {
        console.error("Error fetching rule:", error);
        setMessage("Error fetching rule");
      }
    };

    fetchData();
  }, [id]); // Re-run the effect if the ID changes

  // Handle form submission to update the rule
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation to ensure fields are not empty
    if (!data.title || !data.content) {
      setMessage("Title and content are required");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:9999/api/rules/update/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: data.title,
            content: data.content,
            updatedBy: "60c72b2f9b1e8a5b5c8f1a3e", // Replace with dynamic user ID if needed
          }),
        }
      );

      const result = await response.json();
      console.log(result);
      if (response.ok) {
        setMessage("Rule updated successfully");
      } else {
        setMessage(result.message || "Failed to update rule");
      }
    } catch (error) {
      console.error("Error updating rule:", error);
      setMessage("Error updating rule");
    }
  };

  return (
    <div className="container mt-4">
      <h1>Update Rule</h1>

      {/* Show success or error messages */}
      {message && (
        <div
          className={`alert ${
            message.includes("successfully") ? "alert-success" : "alert-danger"
          }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            className="form-control"
            id="title"
            value={data.title || ""} // Controlled input with fallback
            onChange={(e) => setData({ ...data, title: e.target.value })} // Update title on change
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea
            className="form-control"
            id="content"
            value={data.content || ""} // Controlled input with fallback
            onChange={(e) => setData({ ...data, content: e.target.value })} // Update content on change
            required
          />
        </div>

        <button type="submit" className="btn btn-success mt-3">
          Update Rule
        </button>
      </form>
    </div>
  );
}

export default UpdateRule;
