import React, { useState } from "react";

const UpdateAccount = () => {
  const [image, setImage] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phoneNumber: "",
    cccdCmt: "",
    role: "ADMIN",
    dateOfBirth: "",
    accountName: "",
    password: "",
  });

  const handleImageChange = (e) => {
    setImage(URL.createObjectURL(e.target.files[0]));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);
    // Add form submission logic here
  };

  return (
    <div className="update-account-container mt-4" style={{ margin: "100px 100px" }}>
      <h2 className="text-center">Update Account</h2>
      <form onSubmit={handleSubmit}>
        <div className="row">
          {/* Image Upload Section */}
          <div className="col-md-3">
            <div className="update-account-image-upload form-group">
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
            <div className="update-account-form-group form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter name"
              />
            </div>
            <div className="update-account-form-group form-group mt-3">
              <label htmlFor="address">Address</label>
              <input
                type="text"
                className="form-control"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter address"
              />
            </div>
            <div className="update-account-form-group form-group mt-3">
              <label htmlFor="phoneNumber">Phone number</label>
              <input
                type="text"
                className="form-control"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Enter phone number"
              />
            </div>
            <div className="update-account-form-group form-group mt-3">
              <label htmlFor="cccdCmt">CCCD/CMT</label>
              <input
                type="text"
                className="form-control"
                id="cccdCmt"
                name="cccdCmt"
                value={formData.cccdCmt}
                onChange={handleChange}
                placeholder="Enter CCCD/CMT"
              />
            </div>
            <div className="update-account-form-group form-group mt-3">
              <label htmlFor="role">Role</label>
              <div>
                <input
                  type="radio"
                  id="admin"
                  name="role"
                  value="ADMIN"
                  checked={formData.role === "ADMIN"}
                  onChange={handleChange}
                />
                <label htmlFor="admin" className="mr-3" style={{ marginRight: "10px" }}>
                  ADMIN
                </label>
                <input
                  type="radio"
                  id="librarian"
                  name="role"
                  value="Librarian"
                  checked={formData.role === "Librarian"}
                  onChange={handleChange}
                />
                <label htmlFor="librarian">Librarian</label>
              </div>
            </div>
            <div className="update-account-form-group form-group mt-3">
              <label htmlFor="dateOfBirth">Date of Birth</label>
              <input
                type="date"
                className="form-control"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
              />
            </div>
            <div className="update-account-form-group form-group mt-3">
              <label htmlFor="accountName">Account Name</label>
              <input
                type="text"
                className="form-control"
                id="accountName"
                name="accountName"
                value={formData.accountName}
                onChange={handleChange}
                placeholder="Enter account name"
              />
            </div>
            <div className="update-account-form-group form-group mt-3">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
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

export default UpdateAccount;
