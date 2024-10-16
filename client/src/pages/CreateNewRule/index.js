import React, { useState } from "react";

function CreateNewRule() {
  // State to manage form inputs
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!title || !content) {
      setMessage("Title and content are required");
      return;
    }

    try {
      // API request to create a new rule
      const response = await fetch("http://localhost:9999/api/rules/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
          createdBy: "60c72b2f9b1e8a5b5c8f1a3e", // Static ID for now
          updatedBy: "60c72b2f9b1e8a5b5c8f1a3e", // Static ID for now
        }),
      });

      const data = await response.json();
      console.log(data);
      if (response.ok) {
        setMessage("Rule created successfully");
        // Optionally reset the form
        setTitle("");
        setContent("");
      } else {
        setMessage(data.message || "Failed to create rule");
      }
    } catch (error) {
      console.error("Error creating rule:", error);
      setMessage("Error creating rule");
    }
  };

  return (
    <div className="container mt-4 create_new_rule">
      <h1>Create New Rule</h1>

      {message && <div className="alert alert-info">{message}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            className="form-control"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea
            className="form-control"
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary mt-3">
          Create Rule
        </button>
      </form>
    </div>
  );
}

export default CreateNewRule;
