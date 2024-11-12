import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const UpdatePenaltyReason = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    reasonName: "",
    penaltyAmount: "",
    type: "",
  });

  useEffect(() => {
    const fetchPenaltyReason = async () => {
      try {
        const response = await fetch(`http://localhost:9999/api/penalty-reasons/get/${id}`);
        const data = await response.json();
        if (response.ok) {
          setFormData(data.data);
        } else {
          toast.error("Failed to fetch penalty reason");
        }
      } catch (error) {
        console.error("Error fetching penalty reason:", error);
        toast.error("Error fetching penalty reason");
      }
    };

    fetchPenaltyReason();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:9999/api/penalty-reasons/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Penalty reason updated successfully");
        navigate("/list-penalty-reasons");
      } else {
        toast.error("Failed to update penalty reason");
      }
    } catch (error) {
      console.error("Error updating penalty reason:", error);
      toast.error("Error updating penalty reason");
    }
  };

  return (
    <div className="container mt-4">
       
      <h2>Update Penalty Reason</h2>
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
          Update
        </button>
      </form>
    </div>
  );
};

export default UpdatePenaltyReason;
