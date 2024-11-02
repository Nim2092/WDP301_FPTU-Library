import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const CreatePenaltyReason = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    reasonName: "",
    penaltyAmount: "",
    type: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:9999/api/penalty-reasons/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Penalty reason created successfully");
        navigate("/list-penalty-reasons");
      } else {
        toast.error("Failed to create penalty reason");
      }
    } catch (error) {
      console.error("Error creating penalty reason:", error);
      toast.error("Error creating penalty reason");
    }
  };

  return (
    <div className="container mt-4">
      <ToastContainer />
      <h2>Create Penalty Reason</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Reason Name</label>
          <input
            type="text"
            className="form-control"
            name="reasonName"
            value={formData.reasonName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Penalty Amount</label>
          <input
            type="number"
            className="form-control"
            name="penaltyAmount"
            value={formData.penaltyAmount}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Type</label>
          <input
            type="text"
            className="form-control"
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary mt-3">
          Create
        </button>
      </form>
    </div>
  );
};

export default CreatePenaltyReason;
