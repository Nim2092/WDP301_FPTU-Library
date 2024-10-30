import React, { useState } from "react";
import axios from "axios";
const CreateAccount = () => {
  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleImageChange = (e) => {
    setImage(URL.createObjectURL(e.target.files[0]));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const accountData = {
      image,
      name,
      phoneNumber,
      role,
      email,
      password,
    };
    try {
      const response = await axios.post("http://localhost:9999/api/user/add", accountData);
      console.log("Account Created:", response.data);
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
                <img src={image} alt="Selected" className="img-thumbnail" />
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
              <div>
                <input
                  type="radio"
                  id="admin"
                  name="role"
                  value="ADMIN"
                  checked={role === "ADMIN"}
                  onChange={(e) => setRole(e.target.value)}
                />
                <label htmlFor="admin" className="mr-3" style={{ marginRight: "10px" }}>
                  ADMIN
                </label>
                <input
                  type="radio"
                  id="librarian"
                  name="role"
                  value="Librarian"
                  checked={role === "Librarian"}
                  onChange={(e) => setRole(e.target.value)}
                />
                <label htmlFor="librarian">Librarian</label>
              </div>
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
