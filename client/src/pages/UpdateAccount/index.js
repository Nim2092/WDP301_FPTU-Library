import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const UpdateAccount = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [roleId, setRoleId] = useState(""); // role_id của người dùng
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [roles, setRoles] = useState([]); // Danh sách các role

  // Lấy tất cả các role
  useEffect(() => {
    axios.get("http://localhost:9999/api/user/all-role").then((res) => {
      setRoles(res.data.data);
    });
  }, []);

  // Lấy dữ liệu người dùng bao gồm role hiện tại
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:9999/api/user/get/${id}`);
        const { fullName, email, phoneNumber, role_id, image } = response.data.data;
        setFullName(fullName || "");
        setEmail(email || "");
        setPhoneNumber(phoneNumber || "");
        setRoleId(role_id._id || ""); // Set current role_id bằng _id
        setImagePreview(image ? `http://localhost:9999${image}` : null);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setMessage("Failed to load user data.");
      }
    };

    fetchUserData();
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "fullName") setFullName(value);
    else if (name === "email") setEmail(value);
    else if (name === "phoneNumber") setPhoneNumber(value);
    else if (name === "roleId") setRoleId(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const data = new FormData();
    data.append("fullName", fullName);
    data.append("email", email);
    data.append("phoneNumber", phoneNumber);
    data.append("role_id", roleId);

    if (image) {
      data.append("image", image);
    }

    try {
      const response = await axios.put(`http://localhost:9999/api/user/update/${id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status !== 200) {
        throw new Error("Network response was not ok");
      }

      navigate("/account-list");
    } catch (error) {
      setMessage("Đã xảy ra lỗi trong quá trình cập nhật.");
      console.error("Error updating account:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="update-account-container mt-4"
      style={{ margin: "100px 100px" }}
    >
      <h2 className="text-center">Update Account</h2>
      {message && <p className="text-center">{message}</p>}
      <form onSubmit={handleSubmit}>
        <div className="row">
          {/* Image Upload Section */}
          <div className="col-md-3">
            <div className="update-account-image-upload form-group">
              {imagePreview ? (
                <img src={imagePreview} alt="Selected" className="img-thumbnail" />
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

          <div className="col-md-9">
            <div className="update-account-form-group form-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                type="text"
                className="form-control"
                id="fullName"
                name="fullName"
                value={fullName}
                onChange={handleChange}
                placeholder="Enter full name"
              />
            </div>
            <div className="update-account-form-group form-group mt-3">
              <label htmlFor="email">Email address</label>
              <input
                type="text"
                className="form-control"
                id="email"
                name="email"
                value={email}
                onChange={handleChange}
                placeholder="Enter email"
              />
            </div>
            <div className="update-account-form-group form-group mt-3">
              <label htmlFor="phoneNumber">Phone number</label>
              <input
                type="text"
                className="form-control"
                id="phoneNumber"
                name="phoneNumber"
                value={phoneNumber}
                onChange={handleChange}
                placeholder="Enter phone number"
              />
            </div>
            <div className="update-account-form-group form-group mt-3">
              <label htmlFor="roleId">Role Name</label>
              <select
                className="form-control"
                id="roleId"
                name="roleId"
                value={roleId} // Chọn role hiện tại
                onChange={handleChange}
              >
                {roles.map((role) => (
                  <option key={role._id} value={role._id}>
                    {role.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="d-flex justify-content-center mt-4">
          <button
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateAccount;
