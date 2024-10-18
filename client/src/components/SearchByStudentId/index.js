import React, { useState } from "react";

function SearchByStudentId({ onNextStep }) {
  const [studentId, setStudentId] = useState("");

  // This function handles searching by student ID
  const handleSearch = () => {
    if (studentId.trim()) {
      // Implement search logic here, like API call or local data lookup
      console.log(`Searching for Student ID: ${studentId}`);
      
      // If successful, proceed to the next step
      onNextStep();
    } else {
      alert("Please enter a valid Student ID.");
    }
  };

  return (
    <div className="mt-4">
      <h3>Search By Student ID</h3>
      <div className="form-group">
        <input
          type="text"
          className="form-control"
          placeholder="Enter Student ID"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
        />
      </div>
      <button className="btn btn-primary mt-3" onClick={handleSearch}>
        Search
      </button>
    </div>
  );
}

export default SearchByStudentId;
