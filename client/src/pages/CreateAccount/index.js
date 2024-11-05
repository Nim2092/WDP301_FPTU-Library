import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
const CreateAccount = () => {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [role, setRole] = useState("");
  const [roles, setRoles] = useState([]); // State to hold role options
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  useEffect(() => {
    // Fetch roles from the backend
    const fetchRoles = async () => {
      try {
        const response = await axios.get("https://fptu-library.xyz/api/user/all-role");
        setRoles(response.data.data);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };
    fetchRoles();
  }, []);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]); // Use File object directly for form data
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prepare form data with an image file if provided
    const formData = new FormData();
    formData.append("image", image);
    formData.append("fullName", name);
    formData.append("phoneNumber", phoneNumber);
    formData.append("role_id", role);
    formData.append("email", email);
    formData.append("code", code);
    formData.append("password", password);
    try {
      const response = await axios.post("https://fptu-library.xyz/api/user/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Account created successfully");
      setTimeout(() => {
        navigate("/account-list");
      }, 1000);
    } catch (error) {
      console.error("Error creating account:", error);
    }
  };

  return (
    <div className="create-account-container mt-4" style={{ margin: "100px 100px" }}>
       
      <h2 className="text-center">Create Account</h2>
      <form onSubmit={handleSubmit}>
        <div className="row">
          {/* Image Upload Section */}
          <div className="col-md-3">
            <div className="create-account-image-upload form-group">
              {image ? (
                <img src={URL.createObjectURL(image)} alt="Selected" className="img-thumbnail" />
              ) : (
                <div
                  className="img-thumbnail d-flex justify-content-center align-items-center"
                  style={{
                    height: "200px",
                    width: "100%",
                    backgroundColor: "#f0f0f0",
                  }}
                >
                  Add img
                </div>
              )}
              <input
                type="file"
                className="form-control mt-2"
                onChange={handleImageChange}
              />
            </div>
          </div>

          {/* Form Input Fields */}
          <div className="col-md-9">
            <div className="create-account-form-group form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                className="form-control"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter name"
              />
            </div>
            <div className="create-account-form-group form-group mt-3">
              <label htmlFor="code">Code</label>
              <input
                type="text"
                className="form-control"
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter code"
              />
            </div>
            <div className="create-account-form-group form-group mt-3">
              <label htmlFor="phoneNumber">Phone number</label>
              <input
                type="text"
                className="form-control"
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Enter phone number"
              />
            </div>
            <div className="create-account-form-group form-group mt-3">
              <label htmlFor="role">Role</label>
              <select
                className="form-control"
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="">Select a role</option>
                {roles.map((r) => (
                  <option key={r._id} value={r._id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="create-account-form-group form-group mt-3">
              <label htmlFor="email">Email</label>
              <input
                type="text"
                className="form-control"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
              />
            </div>
            <div className="create-account-form-group form-group mt-3">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="d-flex justify-content-center mt-4">
          <button type="submit" className="btn btn-primary btn-lg">
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateAccount;
