import React, { useState, useEffect  } from "react";
import axios from "axios";

function SearchByStudentId({ onNextStep }) {
  const [studentId, setStudentId] = useState("");
  const [userID, setUserID] = useState("");
  // This function handles searching by student ID
  useEffect(() => {
    axios.get(`http://localhost:9999/api/user/getByCode/${studentId}`)
      .then(response => {
        setUserID(response.data.data.userID);
        console.log(response.data);
      })
      .catch(error => {
        console.error("Error fetching orders:", error);
      });
  }, [studentId]);

  const handleSearch = () => {
    if (userID.trim()) {
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
