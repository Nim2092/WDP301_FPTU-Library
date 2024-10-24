import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

function SearchByStudentId({ onNextStep }) {
  const [studentId, setStudentId] = useState("");

  // This function handles searching by student ID
  const handleSearch = async () => {
    if (studentId.trim()) {
      try {
        const user = await axios.get(`http://localhost:9999/api/user/getByCode/${studentId}`);
        const userID = user.data.data.userID;
        onNextStep(userID); // Pass userID to parent component
      } catch (error) {
        toast.error("Error fetching user details. Please try again.");
        console.error("Error fetching user by Student ID:", error);
      }
    } else {
      toast.error("Please enter a valid Student ID.");
      // alert("Please enter a valid Student ID.");
    }
  };

  return (
    <div className="mt-4">
      <ToastContainer />
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
